import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Routes, Route, Link } from "react-router-dom";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
    link: new HttpLink({ uri: "/graphql" }),
    cache: new InMemoryCache(),
});

const Navigator = () => {
    return (
        <div>
            <button>
                <Link
                    to="/authors"
                    style={{ color: "black", textDecoration: "none" }}
                >
                    authors
                </Link>
            </button>
            <button>
                <Link
                    to="/books"
                    style={{ color: "black", textDecoration: "none" }}
                >
                    books
                </Link>
            </button>
            <button>
                <Link
                    to="/add"
                    style={{ color: "black", textDecoration: "none" }}
                >
                    add book
                </Link>
            </button>
        </div>
    );
};

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Navigator />
            <Routes>
                <Route path="/" element={<p>home page</p>} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/books" element={<Books />} />
                <Route path="/add" element={<NewBook />} />
            </Routes>
        </ApolloProvider>
    );
};

export default App;
