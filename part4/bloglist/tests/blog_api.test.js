const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const initialBlogs = [
    { title: "title1", author: "author1", url: "http://url1", likes: 1 },
    { title: "title2", author: "author2", url: "http://url2", likes: 2 },
    { title: "title3", author: "author3", url: "http://url3", likes: 3 },
];

describe("with initialBlogs", () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(initialBlogs);
    });

    describe("GET /api/blogs", () => {
        test("GET /api/blogs returns json", async () => {
            await api
                .get("/api/blogs")
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        test("GET /api/blogs returns all blogs", async () => {
            const result = await api.get("/api/blogs");
            assert(result.body.length, initialBlogs.length);
        });

        test("GET /api/blogs returns id instead of _id", async () => {
            const result = await api.get("/api/blogs");
            const blog = result.body[0];
            assert(blog.id, !blog._id);
        });
    });

    describe("GET /api/blogs/:id", () => {
        test("GET /api/blogs/:id returns json", async () => {
            const allBlogs = await api.get("/api/blogs/");
            const id = allBlogs.body[0].id; //get the id from the /api/blogs/ route

            const result = await api
                .get(`/api/blogs/${id}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        test("GET /api/blogs/:id not found", async () => {
            const validNonexistingId = new mongoose.Types.ObjectId(); //generate a valid id (otherwise malformatted id will be triggered)

            const result = await api
                .get(`/api/blogs/${validNonexistingId}`)
                .expect(404)
                .expect("Content-Type", /application\/json/);
        });

        test("GET /api/blogs/:id malformatted id", async () => {
            const result = await api
                .get(`/api/blogs/xxx`)
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });
    });

    describe("POST /api/blogs", () => {
        test("POST /api/blogs adds a new blog to the DB", async () => {
            const newBlog = {
                title: "new title",
                author: "new author",
                url: "new url",
                likes: 9,
            };
            const result = await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/);
            const newBlogId = result.body.id;

            const blogsInDb = await api.get("/api/blogs");
            assert(
                //was the blog added?
                blogsInDb.body.some((blog) => {
                    return blog.id === newBlogId;
                })
            );
        });

        test("POST /api/blogs without likes will default to 0", async () => {
            const newBlog = {
                title: "new title",
                author: "new author",
                url: "new url",
            };
            const result = await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/);
            const newBlogId = result.body.id;

            const blogsInDb = await api.get("/api/blogs");
            assert(
                //was the blog added?
                blogsInDb.body.some((blog) => {
                    return blog.id === newBlogId && blog.likes === 0;
                })
            );
        });

        test("POST /api/blogs without title OR url returns 400 error", async () => {
            const noTitle = await api
                .post("/api/blogs")
                .send({ author: "xxx", url: "xxx" })
                .expect(400)
                .expect("Content-Type", /application\/json/);
            const noUrl = await api
                .post("/api/blogs")
                .send({ title: "xxx", author: "xxx" })
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });
    });

    describe("DELETE /api/blogs/:id", () => {
        test("DELETE /api/blogs/:id deletes blog (code:204)", async () => {
            const allBlogs = await api.get("/api/blogs/");
            const id = allBlogs.body[0].id; //get the id from the /api/blogs/ route

            const result = await api.delete(`/api/blogs/${id}`).expect(204);

            const newAllBlogs = await api.get("/api/blogs/"); //makes sure the blog was actually deleted
            assert(
                !newAllBlogs.body.some((obj) => {
                    return obj.id === id; //there isn't a note with that id anymore
                })
            );
        });

        test("DELETE /api/blogs/:id not found", async () => {
            const validNonexistingId = new mongoose.Types.ObjectId(); //generate a valid id (otherwise malformatted id will be triggered)

            const result = await api
                .delete(`/api/blogs/${validNonexistingId}`)
                .expect(404)
                .expect("Content-Type", /application\/json/);
        });

        test("DELETE /api/blogs/:id malformatted id", async () => {
            const result = await api
                .delete(`/api/blogs/xxx`)
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });
    });

    describe("PUT /api/blogs/:id", () => {
        test("PUT /api/blogs/:id updates blog", async () => {
            const allBlogs = await api.get("/api/blogs/");
            const id = allBlogs.body[0].id; //get the id from the /api/blogs/ route

            const result = await api
                .put(`/api/blogs/${id}`)
                .send({ likes: 99999 })
                .expect(200)
                .expect("Content-Type", /application\/json/);

            const newAllBlogs = await api.get("/api/blogs/");
            assert(
                newAllBlogs.body.some((obj) => {
                    return obj.id === id && obj.likes === 99999; //checks if likes are the same and id is the same
                })
            );
        });

        test("PUT /api/blogs/:id not found", async () => {
            const validNonexistingId = new mongoose.Types.ObjectId(); //generate a valid id (otherwise malformatted id will be triggered)

            const result = await api
                .put(`/api/blogs/${validNonexistingId}`)
                .send({ likes: 99999 })
                .expect(404)
                .expect("Content-Type", /application\/json/);
        });

        test("PUT /api/blogs/:id malformatted id", async () => {
            const result = await api
                .put(`/api/blogs/xxx`)
                .send({ likes: 99999 })
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });
    });
});

const initialUsers = [
    { username: "user1", name: "name1", password: "hash1xxxxx" },
    { username: "user2", name: "name2", password: "hash2xxxxx" },
];

describe("with initial users", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await User.insertMany(initialUsers);
    });

    describe("GET /api/users", () => {
        test("GET /api/users returns json", async () => {
            await api
                .get("/api/users")
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        test("GET /api/users returns all users", async () => {
            const result = await api.get("/api/users");
            assert(result.body.length, initialUsers.length);
        });

        test("GET /api/users doesn't return password hash", async () => {
            const result = await api.get("/api/users");
            const user = result.body[0];
            assert(!user.password);
        });
    });

    describe("POST /api/users", () => {
        test("POST /api/users creates a new user", async () => {
            const newUser = {
                name: "new name",
                username: "new username",
                password: "new pswd hash xxxxx",
            };
            const result = await api
                .post("/api/users")
                .send(newUser)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const newUserId = result.body.id;

            const usersInDb = await api.get("/api/users");
            assert(
                //was the user added?
                usersInDb.body.some((user) => {
                    return user.id === newUserId;
                })
            );
        });

        test("POST /api/users username must be unique", async () => {
            const newUser = {
                name: "new name 2",
                username: "user1", //already used
                password: "new pswd 2 hash xxxxx",
            };
            const result = await api
                .post("/api/users")
                .send(newUser)
                .expect(409)
                .expect("Content-Type", /application\/json/);
        });

        test("POST /api/users min length for both username and password", async () => {
            let newUser = {
                name: "namenamename",
                username: "us", //already used
                password: "new pswd 2 hash xxxxx",
            };
            let result = await api
                .post("/api/users")
                .send(newUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            newUser = {
                name: "namenamename",
                username: "usernameusername", //already used
                password: "xx",
            };
            result = await api
                .post("/api/users")
                .send(newUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);
        });
    });
});

after(async () => {
    await mongoose.connection.close();
});
