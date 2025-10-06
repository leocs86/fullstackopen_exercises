const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minLength: 3 },
    name: { type: String, required: true },
    password: { type: String, required: true },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); //returns a string instead of an object
        delete returnedObject._id; //does not return _id
        delete returnedObject.__v; //does not return __v
        delete returnedObject.password; //no pswd hash
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
