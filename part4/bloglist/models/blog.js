const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    url: { type: String, required: true },
    likes: { type: Number, default: 0 },
});

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); //returns a string instead of an object
        delete returnedObject._id; //does not return _id
        delete returnedObject.__v; //does not return __v
    },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
