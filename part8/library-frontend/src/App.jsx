import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommended from "./components/Recommended";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ME } from "./queries";
import { useApolloClient } from "@apollo/client/react";

//todo: currentUser update on mounting if in localStorage
//todo: login triggers currentUser update

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
