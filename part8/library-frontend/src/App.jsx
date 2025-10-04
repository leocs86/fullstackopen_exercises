import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommended from "./components/Recommended";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from "./queries";
import { useApolloClient } from "@apollo/client/react";
import { BOOK_ADDED } from "./subscriptions";
import { useSubscription } from "@apollo/client/react";

const Navigator = ({ currentUser, logout }) => {
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
            {currentUser ? (
                <button>
                    <Link
                        to="/add"
                        style={{ color: "black", textDecoration: "none" }}
                    >
                        add book
                    </Link>
                </button>
            ) : (
                <></>
            )}
            {currentUser ? (
                <button>
                    <Link
                        to="/recommended"
                        style={{ color: "black", textDecoration: "none" }}
                    >
                        recommended
                    </Link>
                </button>
            ) : (
                <></>
            )}
            {currentUser ? <button onClick={logout}>logout</button> : <></>}
            {!currentUser ? (
                <button>
                    <Link
                        to="/login"
                        style={{ color: "black", textDecoration: "none" }}
                    >
                        login
                    </Link>
                </button>
            ) : (
                <></>
            )}
            {currentUser ? (
                <span style={{ marginLeft: ".5rem" }}>
                    Logged in as <b>{currentUser.username}</b>
                </span>
            ) : (
                <></>
            )}
        </div>
    );
};

const App = () => {
    console.log("APP MOUNTED");
    const [currentUser, setCurrentUser] = useState(null);
    const meQuery = useQuery(ME);
    const client = useApolloClient();

    useEffect(() => {
        console.log("USE EFFECT CALLED", meQuery);
        if (!meQuery.loading) {
            meQuery.data?.me
                ? setCurrentUser(meQuery.data.me)
                : setCurrentUser(null);
        }
        console.log("currentUser:", currentUser);
    }, [meQuery]);

    useSubscription(BOOK_ADDED, {
        onError: (error) => {
            console.log("SUBSCRIPTION ERROR", error);
        },
        onData: ({ data }) => {
            console.log("SUBSCRIPTION", data);

            window.alert(
                `New book added: ${data.data.bookAdded.title} by ${data.data.bookAdded.author.name}`
            );

            client.cache.updateQuery(
                { query: ALL_BOOKS, variables: { genre: null } },
                (q) => {
                    if (
                        q && //query is already cached
                        !q.allBooks.find((b) => b.id === data.data.bookAdded.id) //query does not already contain the added book
                    ) {
                        console.log(
                            "updating ALL_BOOKS(genre) with: ",
                            q.allBooks.concat(data.data.bookAdded)
                        );
                        return {
                            allBooks: q.allBooks.concat(data.data.bookAdded),
                        };
                    }
                    return q;
                }
            );
            //also updating quert without genre, to cover genres filter button selection
            client.cache.updateQuery({ query: ALL_BOOKS }, (q) => {
                if (
                    q && //query is already cached
                    !q.allBooks.find((b) => b.id === data.data.bookAdded.id) //query does not already contain the added book
                ) {
                    console.log(
                        "updating ALL_BOOKS with: ",
                        q.allBooks.concat(data.data.bookAdded)
                    );
                    return {
                        allBooks: q.allBooks.concat(data.data.bookAdded),
                    };
                }
                return q;
            });
        },
    });

    const logout = () => {
        window.localStorage.removeItem("token");
        client.resetStore();
    };

    return (
        <>
            <Navigator currentUser={currentUser} logout={logout} />
            <Routes>
                <Route path="/" element={<p>home page</p>} />
                <Route
                    path="/authors"
                    element={<Authors currentUser={currentUser} />}
                />
                <Route path="/books" element={<Books />} />
                <Route path="/add" element={<NewBook />} />
                <Route
                    path="/recommended"
                    element={
                        <Recommended
                            favGenre={
                                currentUser ? currentUser.favoriteGenre : null
                            }
                        />
                    }
                />
                <Route path="/login" element={<Login client={client} />} />
            </Routes>
        </>
    );
};

export default App;
