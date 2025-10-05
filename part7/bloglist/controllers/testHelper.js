const tHRouter = require("express").Router();
require("express-async-errors");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

const User = require("../models/user");
const Blog = require("../models/blog");

tHRouter.get("/reset", async (request, response, next) => {
    //both users and blogs need to be deleted to avoid problems
    await User.deleteMany({});
    await Blog.deleteMany({});
    response.sendStatus(200);
});

tHRouter.get("/createBobby", async (request, response, next) => {
    const passwordHash = await bcrypt.hash("Password123", 10);

    const user = new User({
        username: "bobby",
        name: "Boborious",
        password: passwordHash,
    });

    result = await user.save();
    response.sendStatus(200);
});

tHRouter.get("/createAndrea", async (request, response, next) => {
    const passwordHash = await bcrypt.hash("Password123", 10);

    const user = new User({
        username: "andrea",
        name: "Andreorius",
        password: passwordHash,
    });

    result = await user.save();
    response.sendStatus(200);
});

module.exports = tHRouter;
