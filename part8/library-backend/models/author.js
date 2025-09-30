const mongoose = require("mongoose");

//const uniqueValidator = require("mongoose-unique-validator");
/*DROPPED BECAUSE:
mongoose-unique-validator@4.0.1 declares a peer dependency on Mongoose ^7.0.0, i'm on Mongoose 8.18.3
Mongoose 8 already handles uniqueness errors fine with { unique: true } in your schema and a proper try/catch around saves
*/

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
    },
    born: {
        type: Number,
        default: null,
    },
});

schema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Author", schema);
