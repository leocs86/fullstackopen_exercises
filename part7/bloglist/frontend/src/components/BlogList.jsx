import CreateBlogForm from "./CreateBlogForm";
import Blog from "./Blog";
import Togglable from "./Toggable";

import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogService";

import { useRef } from "react";

const BlogList = () => {
    const childRef = useRef(); //ref for togglable

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

    return (
        <div data-testid="blogList">
            <h2>blogs</h2>
            <Togglable buttonLabel="add blog" ref={childRef}>
                <CreateBlogForm
                    hideBlogForm={() => childRef.current.toggleVisibility()}
                />
            </Togglable>
            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Blog blog={blog} key={blog.id} />
                ))}
        </div>
    );
};

export default BlogList;
