import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Profile from "./components/Profile";
import UserList from "./components/UserList";
import SingleBlog from "./components/SingleBlog";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "./reduxStore/userSlice";
import {
    Routes,
    Route,
    Navigate,
    useMatch,
    Link as RouterLink,
} from "react-router-dom";

import {
    Breadcrumbs,
    Button,
    Link,
    Container,
    Typography,
    Stack,
    Divider,
} from "@mui/material";

const Navbar = ({ user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        window.localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <Stack direction="row" sx={{ mb: 2 }} spacing={2} alignItems="baseline">
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/blogs"
                >
                    bloglist
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to={`/users/${user.id}`}
                >
                    profile
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/users"
                >
                    users
                </Link>
                <Button
                    onClick={handleLogout}
                    variant="contained"
                    size="small"
                    color="secondary"
                >
                    logout
                </Button>
            </Breadcrumbs>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                logged in as <strong>{user.name}</strong>
            </Typography>
        </Stack>
    );
};

const App = () => {
    const user = useSelector((state) => state.user);

    const matchUser = useMatch("/users/:id");
    const userId = matchUser ? matchUser.params.id : null;

    const matchBlog = useMatch("/blogs/:id");
    const blogId = matchBlog ? matchBlog.params.id : null;

    return (
        <Container sx={{ mt: 2 }}>
            <Notification />
            {user ? <Navbar user={user} /> : null}

            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route
                    path="/"
                    element={
                        user ? (
                            <Typography>
                                there's nothing here...
                                <br /> try to use the navbar
                            </Typography>
                        ) : (
                            <Navigate replace to="/login" />
                        )
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
        </Container>
    );
};

export default App;
