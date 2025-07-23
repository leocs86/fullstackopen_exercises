const blogRouter = require("express").Router();
require("express-async-errors");

const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response, next) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
    });
    response.json(blogs);
});

blogRouter.get("/:id", async (request, response, next) => {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
        const err = new Error("blog not found");
        err.name = "NotFoundError";
        throw err;
    }

    response.json(blog);
});

blogRouter.delete("/:id", async (request, response, next) => {
    const result = await Blog.findByIdAndDelete(request.params.id);

    if (!result) {
        //difference between blog being deleted (204) and not existing blog (404)
        const err = new Error("blog not found");
        err.name = "NotFoundError";
        throw err;
    }
    response.sendStatus(204);
});

blogRouter.put("/:id", async (request, response, next) => {
    const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
        //using findByIdAndUpdate instead of .findById and .save
        new: true,
        runValidators: true, //used to run validators
        context: "query", //needed for some validators
    });

    if (!blog) {
        const err = new Error("blog not found");
        err.name = "NotFoundError";
        throw err;
    }
    response.json(blog);
});

blogRouter.post("/", async (request, response, next) => {
    const user = await User.findOne();

    const blog = new Blog({
        ...request.body,
        user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id); //adds to the user blogs list the id of the blog just created
    await user.save();

    response.status(201).json(savedBlog);
});

module.exports = blogRouter;
