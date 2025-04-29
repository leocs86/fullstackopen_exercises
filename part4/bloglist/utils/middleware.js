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
    }

    next(error);
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

module.exports = { morgan, errorHandler, unknownEndpoint };
