import { useState } from "react";
import blogService from "../services/blogService";

const CreateBlogForm = ({ token, setNotification, blogs, setBlogs }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const handleCreation = async (e) => {
        e.preventDefault();
        try {
            const result = await blogService.createNew({
                title,
                author,
                url,
                token,
            });
            const oldBlogs = blogs;
            setBlogs([...oldBlogs, result]);
            setTitle("");
            setAuthor("");
            setUrl("");
            setNotification({
                msg: `new blog created: ${title}`,
                type: "info",
            });
            setTimeout(() => {
                setNotification({});
            }, 5000);
        } catch (exception) {
            setNotification({
                msg: "Error in creating new note",
                type: "error",
            });
            setTimeout(() => {
                setNotification({});
            }, 5000);
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
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author
                <input
                    type="author"
                    value={author}
                    name="Author"
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url
                <input
                    type="text"
                    value={url}
                    name="Url"
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">create</button>
        </form>
    );
};

export default CreateBlogForm;
