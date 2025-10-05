const morgan = require("morgan");
const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
    } else if (error.name === "JsonWebTokenError") {
        return response
            .status(401)
            .send({ error: "invalid Authorization token" });
    } else if (error.name === "AuthorizationError") {
        return response.status(401).send({ error: error.message });
    } else if (error.name === "ForbiddenError") {
        return response.status(403).send({ error: error.message });
    }

    next(error);
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const getToken = (request, response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "");
    }
    next();
};

const getUser = async (request, response, next) => {
    if (request.token) {
        //only if token in Authorization Header
        const decodedToken = jwt.verify(request.token, process.env.SECRET); //check if token is valid / JsonWebTokenError
        if (!decodedToken.id) {
            //token is valid but doesn't have an id
            const err = new Error("missing id in Authorization token");
            err.name = "AuthorizationError";
            throw err;
        }
        const user = await User.findById(decodedToken.id);
        if (!user) {
            //user doesn't exist anymore
            const err = new Error(
                "user not found for given Authorization token"
            );
            err.name = "AuthorizationError";
            throw err;
        }

        request.user = user;
    }

    next();
};

module.exports = { morgan, errorHandler, unknownEndpoint, getToken, getUser };
