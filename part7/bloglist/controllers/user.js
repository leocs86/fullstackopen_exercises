const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
require("express-async-errors");
const logger = require("../utils/logger");

const User = require("../models/user");

userRouter.get("/", async (request, response, next) => {
    const users = await User.find({}).populate("blogs", {
        title: 1,
        author: 1,
        url: 1,
    });
    response.json(users);
});

userRouter.post("/", async (request, response, next) => {
    if (request.body.password.length < 3) {
        const err = new Error("password must be at least 3 chars long");
        err.name = "ValidationError";
        throw err;
    }

    const passwordHash = await bcrypt.hash(request.body.password, 10);
    const user = new User({
        username: request.body.username,
        name: request.body.name,
        password: passwordHash,
    });

    result = await user.save();
    response.status(201).json(result);
});

module.exports = userRouter;
