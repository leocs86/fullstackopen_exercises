//apollo server imports
const { ApolloServer } = require("@apollo/server");

const { expressMiddleware } = require("@as-integrations/express5");
const {
    ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer"); //recommended by apollo
const express = require("express");
const cors = require("cors");
const http = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/use/ws");

//MONGOOSE
const resolvers = require("./resolvers.js");
const typeDefs = require("./typeDefs.js");

//DataLoader
const bookCountLoader = require("./loader.js");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connection to MongoDB:", error.message);
    });

mongoose.set("debug", true);

//user verification
const User = require("./models/user");
const jwt = require("jsonwebtoken");

//websocket + http
const start = async () => {
    //using async function because we cannot await at top level in CommonJS
    const app = express();
    const httpServer = http.createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/",
    });
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const serverCleanup = useServer({ schema }, wsServer); //closes the WebSocket connection on server shutdown

    const server = new ApolloServer({
        schema,
        introspection: true,
        playground: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(
        "/",
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                let currentUser = null;
                try {
                    const auth = req ? req.headers.authorization : null;
                    if (auth && auth.startsWith("Bearer ")) {
                        const decodedToken = jwt.verify(
                            auth.substring(7),
                            process.env.SECRET
                        );
                        currentUser = await User.findById(decodedToken.id);
                    }
                } catch (err) {
                    //if jwt can't decode token
                    currentUser = null;
                }
                return {
                    currentUser,
                    loaders: { bookCountLoader: bookCountLoader() },
                };
            },
        })
    );

    const PORT = 4000;

    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}`)
    );
};

start();
