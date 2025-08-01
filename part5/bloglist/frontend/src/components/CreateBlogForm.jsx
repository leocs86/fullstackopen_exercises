import { useState } from "react";
import blogService from "../services/blogService";

const CreateBlogForm = ({ token, setNotification, onCreate, hideBlogForm }) => {
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
            onCreate(result);
            setTitle("");
            setAuthor("");
            setUrl("");
            hideBlogForm();
            setNotification({
                msg: `new blog created: ${title}`,
                type: "info",
            });
            setTimeout(() => {
                setNotification({});
            }, 5000);
            console.log(`[+] ${result.id} created`);
        } catch (exception) {
            setNotification({
                msg: "Error in creating new blog",
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

export default CreateBlogForm;
