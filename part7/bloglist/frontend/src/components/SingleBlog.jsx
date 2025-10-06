import blogService from "../services/blogService";
import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";
import { useNavigate } from "react-router-dom";

import CommentForm from "./CommentForm";

const SingleBlog = ({ id }) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    //const [blog, setBlog] = useState(null);
    const navigate = useNavigate();

    //mutations
    const likeMutation = useMutation({
        mutationFn: blogService.increaseLikes,
        onSuccess: (updBlog) => {
            setBlog({ ...blog, likes: updBlog.likes }); //update local state
            //we don't need to update the whole blogs list in cache because we are on single blog page
            // const blogs = queryClient.getQueryData(["blogs"]);
            // const newBlogs = blogs.map((b) =>
            //     b.id === updBlog.id ? {...b, likes:updBlog.likes} : b
            // );
            // queryClient.setQueryData(["blogs"], newBlogs);

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
            console.log(`[-] ${delBlog.id} deleted`);
            dispatch(setNotification("blog successfully deleted", "info"));
            navigate("/blogs"); //redirect to bloglist after deletion
        },
        onError: (err, req) => {
            //already deleted 404
            if (err.response?.status === 404) {
                /*                 const blogs = queryClient.getQueryData(["blogs"]);
                const newBlogs = blogs.filter((b) => b.id !== req.blogId);
                queryClient.setQueryData(["blogs"], newBlogs); */
                setNotification("blog doesn't exist", "error");
                navigate("/blogs");
            } else {
                dispatch(
                    setNotification("error in deleting the blog", "error")
                );
            }
        },
    });

    //using useState and useEffect because no other component needs this
    /*     useEffect(() => {
        const fetchBlog = async () => {
            try {
                const result = await blogService.getOne(id);
                setBlog(result);
            } catch (error) {
                dispatch(setNotification("invalid blog id", "error"));
                setBlog("error");
            }
        };
        fetchBlog();
    }, []);

    if (!blog) {
        return <p>loading data...</p>;
    }

    if (blog === "error") {
        return <p>malformatted id...</p>;
    } */

    const blog_result = useQuery({
        queryKey: ["blog", id],
        queryFn: () => blogService.getOne(id),
        enabled: !!id,
    });

    if (blog_result.isError) {
        return <p>err loading data...</p>;
    }

    if (blog_result.isLoading) {
        return <p>loading...</p>;
    }

    const blog = blog_result.data;

    const handleLike = () => {
        likeMutation.mutate({ blogId: blog.id, currentLikes: blog.likes });
    };

    const handleDelete = () => {
        if (!window.confirm("confirm?")) {
            return;
        }
        deleteMutation.mutate({ blogId: blog.id, token: user.token });
    };

    return (
        <>
            <h2>{blog.title}</h2>
            <p>
                by <b>{blog.author}</b>
            </p>
            <a href={blog.url}>{blog.url}</a>
            <p>
                {blog.likes} likes{" "}
                <button style={{ cursor: "pointer" }} onClick={handleLike}>
                    like
                </button>
            </p>
            <p>added by {blog.user.username}</p>
            {user.id === blog.user.id && (
                <button
                    onClick={handleDelete}
                    style={{ color: "red", cursor: "pointer" }}
                >
                    delete
                </button>
            )}
            <h3>Comments ({blog.comments.length})</h3>
            <CommentForm blogId={blog.id} />
            <ul>
                {blog.comments.map((c, i) => (
                    <li key={i}>{c}</li>
                ))}
            </ul>
        </>
    );
};

export default SingleBlog;
