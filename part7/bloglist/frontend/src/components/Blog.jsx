import blogService from "../services/blogService";
import { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";

const Blog = ({ blog }) => {
    const username = blog.user ? blog.user.username : "-";
    const [visibility, setVisibility] = useState(false);

    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);

    const likeMutation = useMutation({
        mutationFn: blogService.increaseLikes,
        onSuccess: (updBlog) => {
            const blogs = queryClient.getQueryData(["blogs"]);

            const newBlogs = blogs.map((b) =>
                b.id === updBlog.id ? { ...b, likes: updBlog.likes } : b
            );
            queryClient.setQueryData(["blogs"], newBlogs);

            console.log(`[^] ${updBlog.id} liked`);
            dispatch(setNotification("blog successfully liked", "info"));
        },
        onError: (err) => {
            dispatch(setNotification("error in liking the blog", "error"));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: blogService.deleteBlog,
        onSuccess: (delBlog) => {
            const blogs = queryClient.getQueryData(["blogs"]);
            const newBlogs = blogs.filter((b) => b.id !== delBlog.id);
            queryClient.setQueryData(["blogs"], newBlogs);

            console.log(`[-] ${delBlog.id} deleted`);
            dispatch(setNotification("blog successfully deleted", "info"));
        },
        onError: (err, req) => {
            //already deleted 404
            if (err.response?.status === 404) {
                const blogs = queryClient.getQueryData(["blogs"]);
                const newBlogs = blogs.filter((b) => b.id !== req.blogId);
                queryClient.setQueryData(["blogs"], newBlogs);
                setNotification("blog doesn't exist", "error");
            } else {
                dispatch(
                    setNotification("error in deleting the blog", "error")
                );
            }
        },
    });

    const handleLike = async () => {
        likeMutation.mutate({ blogId: blog.id, currentLikes: blog.likes });
    };

    const toggleVisibility = () => {
        setVisibility(!visibility);
    };

    const handleDelete = async () => {
        if (!window.confirm("confirm?")) {
            return;
        }
        deleteMutation.mutate({ blogId: blog.id, token: user.token });
    };

    const more = (
        <p style={{ backgroundColor: "#f1f1f1" }} data-testid="more">
            url: {blog.url}
            <br />
            likes: {blog.likes}{" "}
            <button data-testid="likeBtn" onClick={handleLike}>
                like
            </button>
            <br />
            username: {username}
            <br />
            {user.id == blog.user.id && (
                <button onClick={handleDelete} style={{ color: "red" }}>
                    remove
                </button>
            )}
        </p>
    );

    return (
        <>
            <p data-testid="title-author">
                {blog.title} (by {blog.author})
                <button
                    data-testid="toggleVisibilityBtn"
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

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
};

export default Blog;
