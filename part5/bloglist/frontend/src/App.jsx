import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Toggable";
import blogService from "./services/blogService";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [notification, setNotification] = useState({});
    const [user, setUser] = useState(null);

    const childRef = useRef();

    useEffect(() => {
        const fetchBlogs = async () => {
            const result = await blogService.getAll();
            setBlogs(result);
            console.log(result);
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

    const onCreate = (newBlog) => {
        setBlogs(blogs.concat(newBlog));
    };

    const onDelete = (blogId) => {
        setBlogs(blogs.filter((b) => b.id !== blogId));
    };

    const onLiked = (blogId) => {
        setBlogs(
            blogs.map((blog) =>
                blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
            )
        );
    };

    const blogList = () => {
        return (
            <div>
                <h2>blogs</h2>
                <p>
                    <strong>{user.name}</strong> logged in
                    <button onClick={handleLogout}>logout</button>
                </p>
                <Togglable buttonLabel="add blog" ref={childRef}>
                    <CreateBlogForm
                        token={user.token}
                        setNotification={setNotification}
                        blogs={blogs}
                        setBlogs={setBlogs}
                        onCreate={onCreate}
                        hideBlogForm={() => childRef.current.toggleVisibility()}
                    />
                </Togglable>
                {blogs
                    .sort((a, b) => b.likes - a.likes)
                    .map((blog) => (
                        <Blog
                            key={blog.id}
                            blog={blog}
                            setNotification={setNotification}
                            token={user.token}
                            onDelete={onDelete}
                            userId={user.id}
                            onLiked={onLiked}
                        />
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
