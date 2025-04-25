const express = require("express");
const morgan = require("morgan");
const Person = require("./models/Person");

const app = express();
app.use(express.static("dist"));
app.use(express.json());

morgan.token("data", (req, res) => {
    return JSON.stringify(req.body);
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :data"
    )
);

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

let persons = [];

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1><p>Phonebook Backend</p>");
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then((resp) => {
        response.json(resp);
    });
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then((person) => {
        //null or person
        if (person) {
            response.json(person);
        } else {
            response.status(404).json({ error: "person doesn't exist" });
        }
    });
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    if (!persons.find((obj) => obj.id === id)) {
        return response.status(404).json({ error: "person doesn't exist" });
    }
    persons = persons.filter((obj) => obj.id !== id);

    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    console.log("post");
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({ error: "content missing" });
    }

    Person.exists({ name: request.body.name }).then((resp) => {
        //check if person exists -> true
        if (resp) {
            return response
                .status(409)
                .json({ error: "person.name already exists" });
        } else {
            const person = new Person({
                name: request.body.name,
                number: request.body.number,
            });

            person.save().then((resp) => {
                response.status(201).json(person);
            });
        }
    });
});

app.get("/info", (request, response) => {
    const now = new Date();
    Person.countDocuments().then((result) => {
        response.send(
            `<p>Phonebook has info for ${result} persons</p><p>${now.toString()}</p>`
        );
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
