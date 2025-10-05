const blogRouter = require("express").Router();
require("express-async-errors");
const logger = require("../utils/logger");

const Blog = require("../models/blog");

blogRouter.get("/", async (request, response, next) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
    });
    response.json(blogs);
});

blogRouter.get("/:id", async (request, response, next) => {
    const blog = await Blog.findById(request.params.id).populate("user", {
        username: 1,
        name: 1,
    });

    if (!blog) {
        const err = new Error("blog not found");
        err.name = "NotFoundError";
        throw err;
    }

    response.json(blog);
});

blogRouter.delete("/:id", async (request, response, next) => {
    if (!request.token) {
        //no authorization token
        const err = new Error("missing Authorization token");
        err.name = "AuthorizationError";
        throw err;
    }
    const user = request.user; //middleware takes care of problems

    const blogToDelete = await Blog.findById(request.params.id);
    if (!blogToDelete) {
        //blog doesn't exist
        const err = new Error("blog not found");
        err.name = "NotFoundError";
        throw err;
    }

    if (blogToDelete.user.toString() != user._id.toString()) {
        //check if user created the blog
        const err = new Error("user of the token didn't create the blog");
        err.name = "ForbiddenError";
        throw err;
    }

    const result = await Blog.findByIdAndDelete(request.params.id); //delete the blog

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
    if (!request.token) {
        //no authorization token
        const err = new Error("missing Authorization token");
        err.name = "AuthorizationError";
        throw err;
    }
    const user = request.user; //middleware takes care of problems

    const blog = new Blog({
        ...request.body,
        user: user._id,
    });

    const savedBlog = await blog.save();
    const populatedBlog = await savedBlog.populate("user", {
        username: 1,
        name: 1,
    }); //returns info about user as well

    user.blogs = user.blogs.concat(savedBlog._id); //adds to the user blogs list the id of the blog just created
    await user.save();

    response.status(201).json(populatedBlog);
});

module.exports = blogRouter;
