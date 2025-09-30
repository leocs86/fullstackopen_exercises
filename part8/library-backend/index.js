const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connection to MongoDB:", error.message);
    });

const typeDefs = `
  type Author {
    name: String!
    bookCount: Int!
    born: Int
    id: ID!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre:String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ) : Book
    editAuthor(
      name: String!,
      setBornTo: Int!
    ) : Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

`;

const resolvers = {
    Book: {
        //return author Obj instead of id when resolving a book
        author: async (root) => {
            return await Author.findById(root.author);
        },
    },

    Author: {
        bookCount: async (root) => {
            return await Book.countDocuments({ author: root.id });
        },
    },

    Query: {
        bookCount: async () => await Book.countDocuments(),
        authorCount: async () => await Author.countDocuments(),
        allBooks: async (root, args) => {
            const allBooks = await Book.find({}).populate("author");

            const booksfilteredAuthor = args.author
                ? allBooks.filter((b) => b.author.name === args.author)
                : allBooks;
            const booksfilteredGenre = args.genre
                ? booksfilteredAuthor.filter((b) =>
                      b.genres.includes(args.genre)
                  )
                : booksfilteredAuthor;

            return booksfilteredGenre;
        },
        allAuthors: async () => {
            const authors = await Author.find({});
            return authors;

            /*authors.map((author) => ({
                name: author.name,
                born: author.born,
                id: author.id,
                bookCount: books.filter((b) => b.author === author.name).length,
            })),*/
        },
        me: (root, args, context) => context.currentUser,
    },
    Mutation: {
        addBook: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError("forbidden action, log in before", {
                    extensions: {
                        code: "FORBIDDEN",
                    },
                });
            }
            try {
                let author = await Author.findOne({ name: args.author });
                if (!author) {
                    //if it doesn't exist we create the author
                    author = new Author({ name: args.author });
                    author = await author.save();
                }

                const newBook = new Book({
                    title: args.title,
                    published: args.published,
                    genres: args.genres,
                    author: author.id, // Use the ObjectId from the author we found/created
                });
                return (await newBook.save()).populate("author");
            } catch (err) {
                if (err.code === 11000) {
                    throw new GraphQLError("title already exists", {
                        extensions: {
                            code: "UNIQUENESS_ERROR",
                            message: err.message,
                        },
                    });
                } else if (err.name === "ValidationError") {
                    throw new GraphQLError("error in validation", {
                        extensions: {
                            code: "VALIDATION_ERROR",
                            message: err.message,
                        },
                    });
                } else {
                    throw new GraphQLError("error", {
                        extensions: {
                            code: "GENERAL_ERROR",
                            err,
                        },
                    });
                }
            }

            /*

            books = books.concat(book);
            if (!authors.find((a) => a.name === args.author)) {
                authors = authors.concat({
                    name: args.author,
                    born: null,
                    id: uuid(),
                });
            }
            return book;*/
        },
        editAuthor: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError("forbidden action, log in before", {
                    extensions: {
                        code: "FORBIDDEN",
                    },
                });
            }
            const author = await Author.findOne({ name: args.name });
            if (!author) {
                throw new GraphQLError("author doesn't exist", {
                    extensions: {
                        code: "BAD_INPUT",
                    },
                });
            }

            const result = await Author.findByIdAndUpdate(
                author.id,
                {
                    born: args.setBornTo,
                },
                { new: true }
            );
            return result;
        },
        createUser: async (root, args) => {
            try {
                const newUser = new User({ ...args });
                return await newUser.save();
            } catch (err) {
                if (err.code === 11000) {
                    throw new GraphQLError("user already exists", {
                        extensions: {
                            code: "UNIQUENESS_ERROR",
                            message: err.message,
                        },
                    });
                } else if (err.name === "ValidationError") {
                    throw new GraphQLError("error in validation", {
                        extensions: {
                            code: "VALIDATION_ERROR",
                            message: err.message,
                        },
                    });
                } else {
                    throw new GraphQLError("error", {
                        extensions: {
                            code: "GENERAL_ERROR",
                            err,
                        },
                    });
                }
            }
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
            if (user && args.password === "SecretPswd") {
                currentUser = user;
                const token = {
                    value: jwt.sign(
                        { username: user.username, id: user.id },
                        process.env.SECRET
                    ),
                };
                return token;
            } else {
                currentUser = null;
                throw new GraphQLError("invalid credentials", {
                    extensions: {
                        code: "LOGIN_ERROR",
                    },
                });
            }
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

startStandaloneServer(server, {
    listen: { port: 4000 },

    context: async ({ req, res }) => {
        try {
            const auth = req ? req.headers.authorization : null;
            if (auth && auth.startsWith("Bearer ")) {
                const decodedToken = jwt.verify(
                    auth.substring(7),
                    process.env.SECRET
                );
                const currentUser = await User.findById(decodedToken.id);
                return { currentUser };
            }
        } catch (err) {
            //if jwt can't decode token
            return null;
        }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
