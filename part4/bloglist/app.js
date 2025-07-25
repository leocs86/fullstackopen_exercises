const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(express.json());
app.use(middleware.getToken);

if (process.env.NODE_ENV !== "test") {
    //we don't want morgan if in test mode
    app.use(
        middleware.morgan(":method :url :status :body - :response-time ms")
    );
}

app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/blogs", middleware.getUser, blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
