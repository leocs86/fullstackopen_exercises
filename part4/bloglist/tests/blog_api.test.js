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

after(async () => {
    await mongoose.connection.close();
});
