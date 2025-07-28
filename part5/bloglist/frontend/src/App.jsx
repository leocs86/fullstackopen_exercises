import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogService";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [notification, setNotification] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const result = await blogService.getAll();
            setBlogs(result);
        };

        fetchBlogs();
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("user");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        window.localStorage.removeItem("user");
    };

    const blogList = () => {
        return (
            <div>
                <h2>blogs</h2>
                <p>
                    <strong>{user.name}</strong> logged in
                    <button onClick={handleLogout}>logout</button>
                </p>
                <CreateBlogForm
                    token={user.token}
                    setNotification={setNotification}
                    blogs={blogs}
                    setBlogs={setBlogs}
                />
                {blogs.map((blog) => (
                    <Blog key={blog.id} blog={blog} />
                ))}
            </div>
        );
    };

    return (
        <>
            {notification.msg ? (
                <Notification msg={notification.msg} type={notification.type} />
            ) : (
                ""
            )}
            {user === null ? (
                <LoginForm
                    setNotification={setNotification}
                    setUser={setUser}
                />
            ) : (
                blogList()
            )}
        </>
    );
};

export default App;
