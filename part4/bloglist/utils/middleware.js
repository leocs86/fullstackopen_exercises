const morgan = require("morgan");
const logger = require("./logger");

//morgan token for body
morgan.token("body", (req, res) => {
    return JSON.stringify(req.body);
});

const errorHandler = (error, request, response, next) => {
    logger.error(error.name, "->", error.message);

    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "NotFoundError") {
        return response.status(404).send({ error: error.message });
    } else if (error.name === "MongoServerError") {
        return response.status(409).send({ error: "Username already exists" });
    }

    next(error);
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

module.exports = { morgan, errorHandler, unknownEndpoint };
