const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

//morgan token for body
morgan.token("body", (req, res) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body);
    }
});

const errorHandler = (error, request, response, next) => {
    console.error(error.name, "->", error.message);

    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    url: { type: String, required: true },
    likes: { type: Number, required: true },
});

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); //returns a string instead of an object
        delete returnedObject._id; //does not return _id
        delete returnedObject.__v; //does not return __v
    },
});

const Blog = mongoose.model("Blog", blogSchema);

mongoose.connect(process.env.MONGODB_URL);

app.use(express.json());
app.use(morgan(":method :url :status :body - :response-time ms"));

app.get("/api/blogs", (request, response, next) => {
    Blog.find({})
        .then((blogs) => {
            response.json(blogs);
        })
        .catch((err) => next(err));
});

app.post("/api/blogs", (request, response, next) => {
    const blog = new Blog(request.body);

    blog.save()
        .then((result) => {
            response.status(201).json(result);
        })
        .catch((err) => next(err));
});

app.use(errorHandler);

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
