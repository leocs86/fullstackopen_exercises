const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
    Subscription: {
        //defining the subscription
        bookAdded: {
            subscribe: () => {
                return pubsub.asyncIterableIterator(["BOOK_ADDED"]);
            },
        },
    },

    Book: {
        //return author Obj instead of id when resolving a book
        author: async (root) => {
            return await Author.findById(root.author);
        },
    },

    Author: {
        bookCount: async (root, args, context) => {
            //return await Book.countDocuments({ author: root.id });
            return context.loaders.bookCountLoader.load(root.id); //using loaders instead
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
            console.log("AllAuthors");
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

                const savedBook = await newBook.save();
                const resp = await savedBook.populate("author");
                pubsub.publish("BOOK_ADDED", { bookAdded: resp });
                return resp;
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

module.exports = resolvers;
