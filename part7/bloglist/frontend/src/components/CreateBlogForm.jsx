import { useState } from "react";
import blogService from "../services/blogService";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";

const CreateBlogForm = ({ hideBlogForm }) => {
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
            hideBlogForm();

            dispatch(setNotification(`new blog created: ${title}`, "info"));
        } catch (exception) {
            dispatch(setNotification("error in creating new blog", "error"));
        }
    };

    return (
        <form onSubmit={handleCreation}>
            <div>
                title
                <input
                    type="text"
                    value={title}
                    name="Title"
                    data-testid="title"
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author
                <input
                    type="text"
                    value={author}
                    name="Author"
                    data-testid="author"
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url
                <input
                    type="text"
                    value={url}
                    name="Url"
                    data-testid="url"
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit" data-testid="submitBtn">
                create
            </button>
        </form>
    );
};

CreateBlogForm.propTypes = {
    hideBlogForm: PropTypes.func.isRequired,
};

export default CreateBlogForm;
