import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Profile from "./components/Profile";
import UserList from "./components/UserList";
import SingleBlog from "./components/SingleBlog";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "./reduxStore/userSlice";
import { Routes, Route, Link, Navigate, useMatch } from "react-router-dom";

const Navbar = ({ user }) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        window.localStorage.removeItem("user");
    };

    return (
        <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/blogs">
                <button style={{ cursor: "pointer" }}>bloglist</button>
            </Link>
            <Link to={`/users/${user.id}`}>
                <button style={{ cursor: "pointer" }}>profile</button>
            </Link>
            <Link to="/users">
                <button style={{ cursor: "pointer" }}>users</button>
            </Link>
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
                logout
            </button>
            <p style={{ marginLeft: ".5rem", margin: "0" }}>
                logged in as <strong>{user.name}</strong>
            </p>
        </div>
    );
};

const App = () => {
    const user = useSelector((state) => state.user);

    const matchUser = useMatch("/users/:id");
    const userId = matchUser ? matchUser.params.id : null;

    const matchBlog = useMatch("/blogs/:id");
    const blogId = matchBlog ? matchBlog.params.id : null;

    return (
        <>
            <Notification />
            {user ? <Navbar user={user} /> : <></>}

            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route
                    path="/"
                    element={
                        user ? <>home</> : <Navigate replace to="/login" />
                    }
                />
                <Route
                    path="/blogs"
                    element={
                        user ? <BlogList /> : <Navigate replace to="/login" />
                    }
                />
                <Route
                    path="/users"
                    element={
                        user ? <UserList /> : <Navigate replace to="/login" />
                    }
                />
                <Route path="/users/:id" element={<Profile id={userId} />} />
                <Route path="/blogs/:id" element={<SingleBlog id={blogId} />} />
            </Routes>
        </>
    );
};

export default App;
