const mongoose = require("mongoose");
require("dotenv").config();

const password = process.env.PASSWORD;

//DO NOT SAVE YOUR PASSWORD
const url = `mongodb+srv://lcs:${password}@phonebook.afhg13q.mongodb.net/notebook?retryWrites=true&w=majority&appName=Phonebook`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
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

/*
if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then((result) => {
        console.log(`[+] ${process.argv[3]} successfully saved`);
        mongoose.connection.close(); //closing the connection
    });
} else {
    console.log("Phonebook:");
    Person.find().then((result) => {
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
            //NOTE: you can't do that outside the .then because it will be executed too soon
        });
        mongoose.connection.close(); //closing the connection
    });
}*/
