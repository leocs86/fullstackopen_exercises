import CreateBlogForm from "./CreateBlogForm";
import Blog from "./Blog";
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogService";

import { Typography, Box, Button } from "@mui/material";

const BlogList = () => {
    const blog_result = useQuery({
        queryKey: ["blogs"],
        queryFn: blogService.getAll,
        refetchOnWindowFocus: false,
    });

    const [dialogOpen, setDialogOpen] = useState(false);

    const onDialogClose = () => setDialogOpen(false);
    const onDialogOpen = () => setDialogOpen(true);

    if (blog_result.isError) {
        return <Typography>err loading data...</Typography>;
    }
    if (blog_result.isLoading) {
        return <Typography>loading data...</Typography>;
    }

    const blogs = blog_result.data;

    return (
        <Box>
            <Typography variant="h2">blogs</Typography>
            <Button
                variant="contained"
                onClick={onDialogOpen}
                size="small"
                sx={{ mt: 1, mb: 2 }}
            >
                Create New Blog
            </Button>
            <CreateBlogForm open={dialogOpen} onClose={onDialogClose} />
            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Blog blog={blog} key={blog.id} />
                ))}
        </Box>
    );
    /* 
    return (
        <Box>
            <Typography variant="h2">blogs</Typography>
            <Togglable buttonLabel="add blog" ref={childRef}>
                <CreateBlogForm
                    open={dialogOpen}
                    onClose={dialogOnClose}
                    hideBlogForm={() => childRef.current.toggleVisibility()}
                />
            </Togglable>
            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Blog blog={blog} key={blog.id} />
                ))}
        </Box>
    ); */
};

export default BlogList;
