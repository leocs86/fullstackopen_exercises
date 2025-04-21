const express = require("express");
const app = express();
const morgan = require("morgan");

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

/*
let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];*/

let persons = [];

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1><p>Phonebook Backend</p>");
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find((obj) => obj.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).json({ error: "person doesn't exist" });
    }
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
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({ error: "content missing" });
    }

    if (persons.find((obj) => obj.name === request.body.name)) {
        return response
            .status(409)
            .json({ error: "person.name already exists" });
    }

    const person = request.body;
    person.id = String(getRandomInt(1000));
    response.status(201).json(person);

    persons = persons.concat(person);
});

app.get("/info", (request, response) => {
    const now = new Date();
    response.send(
        `<p>Phonebook has info for ${
            persons.length
        } persons</p><p>${now.toString()}</p>`
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
