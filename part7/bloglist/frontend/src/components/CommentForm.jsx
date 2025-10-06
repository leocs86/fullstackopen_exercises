import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import blogService from "../services/blogService";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";

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
        <form onSubmit={handleSubmit}>
            {" "}
            <input
                type="text"
                value={comment}
                name="Comment"
                data-testid="comment"
                onChange={({ target }) => setComment(target.value)}
            />
            <button type="submit">create</button>
        </form>
    );
};

export default CommentForm;
