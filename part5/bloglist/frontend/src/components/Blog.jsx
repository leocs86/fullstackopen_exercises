import blogService from "../services/blogService";
import { useState } from "react";

const Blog = ({ blog, setNotification, onDelete, token, userId, onLiked }) => {
    const username = blog.user ? blog.user.username : "-";
    const [visibility, setVisibility] = useState(false);

    const handleLike = async () => {
        try {
            const resp = await blogService.increaseLikes({
                blogId: blog.id,
                currentLikes: blog.likes,
            });
            setNotification({ msg: "blog successfully liked", type: "info" });
            setTimeout(() => {
                setNotification({});
            }, 5000);
            onLiked(blog.id);
            console.log(`[^] ${blog.id} liked`);
        } catch (exception) {
            setNotification({ msg: "error in liking the blog", type: "error" });
            setTimeout(() => {
                setNotification({});
            }, 5000);
        }
    };

    const toggleVisibility = () => {
        setVisibility(!visibility);
    };

    const handleDelete = async () => {
        if (!window.confirm("confirm?")) {
            return;
        }
        try {
            await blogService.deleteBlog({
                blogId: blog.id,
                token: token,
            });
            onDelete(blog.id);
            setNotification({
                msg: "blog successfully deleted",
                type: "info",
            });
            setTimeout(() => {
                setNotification({});
            }, 5000);
            console.log(`[-] ${blog.id} deleted`);
        } catch (exception) {
            setNotification({
                msg: "error in deleting the blog",
                type: "error",
            });
            setTimeout(() => {
                setNotification({});
            }, 5000);
        }
    };

    const more = (
        <p style={{ backgroundColor: "#f1f1f1" }}>
            url: {blog.url}
            <br />
            likes: {blog.likes} <button onClick={handleLike}>like</button>
            <br />
            username: {username}
            <br />
            {userId == blog.user.id && (
                <button onClick={handleDelete} style={{ color: "red" }}>
                    remove
                </button>
            )}
        </p>
    );

    return (
        <>
            <p>
                {blog.title} (by {blog.author})
                <button
                    onClick={toggleVisibility}
                    style={{ marginLeft: ".5rem" }}
                >
                    {visibility ? "hide" : "..."}
                </button>
            </p>
            {visibility && more}
        </>
    );
};

export default Blog;
