import { useState } from "react";
import blogService from "../services/blogService";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

const CreateBlogForm = ({ hideBlogForm, onClose, open }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const newBlogMutation = useMutation({
        mutationFn: blogService.createNew,
        onSuccess: (newBlog) => {
            const blogs = queryClient.getQueryData(["blogs"]);
            queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
            console.log(`[+] ${newBlog.id} created`);
        },
    });

    const handleCreation = async (e) => {
        e.preventDefault();
        try {
            /*  const result = await blogService.createNew({
                title,
                author,
                url,
                token,
            }); */

            newBlogMutation.mutate({
                title,
                author,
                url,
                token: user.token,
            });

            setTitle("");
            setAuthor("");
            setUrl("");

            dispatch(setNotification(`new blog created: ${title}`, "info"));
            onClose();
        } catch (exception) {
            console.log("[!] err creating new blog:", exception);
            dispatch(setNotification("error in creating new blog", "error"));
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>CREATE NEW BLOG</DialogTitle>
            <DialogContent>
                <Stack component="form" onSubmit={handleCreation} spacing={2}>
                    <TextField
                        id="standard-basic"
                        label="Title"
                        variant="standard"
                        value={title}
                        size="small"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                    <TextField
                        id="standard-basic"
                        label="Author"
                        variant="standard"
                        value={author}
                        size="small"
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                    <TextField
                        id="standard-basic"
                        label="Url"
                        variant="standard"
                        value={url}
                        size="small"
                        onChange={({ target }) => setUrl(target.value)}
                    />
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </Stack>
            </DialogContent>
        </Dialog>
    );
    /* 
    return (
        <Stack component="form" onSubmit={handleCreation}>
            <TextField
                id="standard-basic"
                label="Title"
                variant="standard"
                value={title}
                size="small"
                onChange={({ target }) => setTitle(target.value)}
            />
            <TextField
                id="standard-basic"
                label="Author"
                variant="standard"
                value={author}
                size="small"
                onChange={({ target }) => setAuthor(target.value)}
            />
            <TextField
                id="standard-basic"
                label="Url"
                variant="standard"
                value={url}
                size="small"
                onChange={({ target }) => setUrl(target.value)}
            />
            <Button
                variant="contained"
                size="small"
                type="submit"
                data-testid="submitBtn"
            >
                create
            </Button>
        </Stack>
    ); */
};
/* 
CreateBlogForm.propTypes = {
    hideBlogForm: PropTypes.func.isRequired,
}; */

export default CreateBlogForm;
