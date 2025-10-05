import { useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Toggable";
import blogService from "./services/blogService";
import { useQuery } from "@tanstack/react-query";
import { logout } from "./reduxStore/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useMatch } from "react-router-dom";

//TODO: REDUX WITH NOTIFICATION

const App = () => {
    //const [notification, setNotification] = useState({});
    //const [user, setUser] = useState(null);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const childRef = useRef();

    /*
 useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("user");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
        }
    }, []);

       useEffect(() => {
        const fetchBlogs = async () => {
            const result = await blogService.getAll();
            setBlogs(result);
            console.log(result);
        };

        fetchBlogs();
    }, []); */

    const blog_result = useQuery({
        queryKey: ["blogs"],
        queryFn: blogService.getAll,
        refetchOnWindowFocus: false,
    });

    if (blog_result.isError) {
        return <p>err loading data...</p>;
    }
    if (blog_result.isLoading) {
        return <p>loading data...</p>;
    }

    const blogs = blog_result.data;

    const handleLogout = () => {
        dispatch(logout());
        window.localStorage.removeItem("user");
    };

    const blogList = () => {
        return (
            <div data-testid="blogList">
                <h2>blogs</h2>
                <p>
                    <strong>{user.name}</strong> logged in
                    <button onClick={handleLogout}>logout</button>
                </p>
                <Togglable buttonLabel="add blog" ref={childRef}>
                    <CreateBlogForm
                        hideBlogForm={() => childRef.current.toggleVisibility()}
                    />
                </Togglable>
                {blogs
                    .sort((a, b) => b.likes - a.likes)
                    .map((blog) => (
                        <Blog key={blog.id} blog={blog} />
                    ))}
            </div>
        );
    };

    return (
        <>
            <Notification />
            {user === null ? <LoginForm /> : blogList()}
        </>
    );
};

export default App;
