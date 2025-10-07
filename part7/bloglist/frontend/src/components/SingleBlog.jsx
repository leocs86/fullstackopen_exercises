import blogService from "../services/blogService";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import {
    Typography,
    Box,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Stack,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DeleteIcon from "@mui/icons-material/Delete";

import CommentForm from "./CommentForm";

const SingleBlog = ({ id }) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const navigate = useNavigate();

    //mutations
    const likeMutation = useMutation({
        mutationFn: blogService.increaseLikes,
        onSuccess: (updBlog) => {
            queryClient.setQueryData(["blog", id], (oldBlog) => ({
                ...oldBlog,
                likes: updBlog.likes,
            }));

            console.log(`[^] ${updBlog.id} liked`);
            dispatch(setNotification("blog successfully liked", "info"));
        },
        onError: (err) => {
            console.log("err in liking", err);
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
            console.log("err in delete", err);
            //already deleted 404
            if (err.response?.status === 404) {
                setNotification("blog doesn't exist", "error");
                navigate("/blogs");
            } else {
                dispatch(
                    setNotification("error in deleting the blog", "error")
                );
            }
        },
    });

    const blog_result = useQuery({
        queryKey: ["blog", id],
        queryFn: () => blogService.getOne(id),
        enabled: !!id,
    });

    if (blog_result.isError) {
        return <Typography>err loading data...</Typography>;
    }

    if (blog_result.isLoading) {
        return <Typography>loading...</Typography>;
    }

    const blog = blog_result.data;
    console.log(blog);

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
        <Box>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h2">{blog.title}</Typography>
                {user.id === blog.user.id && (
                    <IconButton
                        onClick={handleDelete}
                        size="small"
                        color="secondary"
                    >
                        <DeleteIcon sx={{ maxHeight: 30, maxWidth: 30 }} />
                    </IconButton>
                )}
            </Stack>
            <Typography>by "{blog.author}"</Typography>
            <Link href={blog.url}>{blog.url}</Link>
            <Typography>
                {blog.likes} likes{" "}
                <IconButton onClick={handleLike} size="small">
                    <ThumbUpIcon sx={{ maxHeight: 16, maxWidth: 16 }} />
                </IconButton>
            </Typography>
            <Typography>
                added by{" "}
                <Link component={RouterLink} to={`/users/${blog.user.id}`}>
                    {blog.user.username}
                </Link>
            </Typography>
            <Typography variant="h4" sx={{ mt: 4, mb: 0 }}>
                Comments ({blog.comments.length})
            </Typography>
            <CommentForm blogId={blog.id} />
            <List>
                {blog.comments.map((c, i) => (
                    //<li key={i}>{c}</li>
                    <ListItem key={i} sx={{ pl: 0, pb: 0, pt: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                            <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                        </ListItemIcon>
                        <ListItemText primary={c} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SingleBlog;
