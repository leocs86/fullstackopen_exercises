const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
    { title: "title1", author: "author1", url: "http://url1", likes: 1 },
    { title: "title2", author: "author2", url: "http://url2", likes: 2 },
    { title: "title3", author: "author3", url: "http://url3", likes: 3 },
];

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
});

test("GET /api/blogs returns json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("GET /api/blogs returns all notes", async () => {
    const result = await api.get("/api/blogs");
    assert(result.body.length, initialBlogs.length);
});

test("GET /api/blogs returns id instead of _id", async () => {
    const result = await api.get("/api/blogs");
    const blog = result.body[0];
    assert(blog.id, !blog._id);
});

test("POST /api/blogs adds a new note to the DB", async () => {
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

test("POST /api/blogs without title OR author OR url returns 400 error", async () => {
    const noTitle = await api
        .post("/api/blogs")
        .send({ author: "xxx", url: "xxx" })
        .expect(400)
        .expect("Content-Type", /application\/json/);
    const noAuthor = await api
        .post("/api/blogs")
        .send({ title: "xxx", url: "xxx" })
        .expect(400)
        .expect("Content-Type", /application\/json/);
    const noUrl = await api
        .post("/api/blogs")
        .send({ title: "xxx", author: "xxx" })
        .expect(400)
        .expect("Content-Type", /application\/json/);
});

after(async () => {
    await mongoose.connection.close();
});
