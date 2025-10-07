import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import blogService from "../services/blogService";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";

import { TextField, Button, Stack } from "@mui/material";

const CommentForm = ({ blogId }) => {
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const addCommentMutation = useMutation({
        mutationFn: blogService.addComment,
        onSuccess: (updBlog, variables) => {
            queryClient.setQueryData(["blog", blogId], updBlog);
            dispatch(
                setNotification(`added comment "${variables.comment}"`, "info")
            );
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        addCommentMutation.mutate({ blogId, comment });
        setComment("");
    };

    return (
        <Stack
            component="form"
            onSubmit={handleSubmit}
            direction="row"
            spacing={2}
            sx={{ maxHeight: "fit" }}
            alignItems="center"
        >
            {" "}
            <TextField
                id="standard-basic"
                label="Comment"
                variant="standard"
                type="text"
                value={comment}
                onChange={({ target }) => setComment(target.value)}
                size="small"
            />
            <Button type="submit" variant="contained" size="small">
                Create
            </Button>
        </Stack>
    );
};

export default CommentForm;
