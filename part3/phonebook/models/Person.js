const mongoose = require("mongoose");
require("dotenv").config();

//DO NOT SAVE YOUR PASSWORD
const uri = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(uri);

const personSchema = new mongoose.Schema({
    name: { type: String, minLength: 3, required: true },
    number: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: (props) => {
                return `${props.value} is not a valid phone number`;
            },
        },
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); //returns a string instead of an object
        delete returnedObject._id; //does not return _id
        delete returnedObject.__v; //does not return __v
    },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
