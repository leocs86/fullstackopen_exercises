import { useState } from "react";
import { ADD_BOOK } from "../mutations";
import { ALL_AUTHORS, ALL_BOOKS } from "../queries";
import { useMutation } from "@apollo/client/react";

const NewBook = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [published, setPublished] = useState("");
    const [genre, setGenre] = useState("");
    const [genres, setGenres] = useState([]);

    const [addBook, result] = useMutation(ADD_BOOK, {
        onError: (e) => {
            console.log(e);
        },
        refetchQueries: [
            { query: ALL_AUTHORS },
            { query: ALL_BOOKS },
            { query: ALL_BOOKS, variables: { genre: null } }, //default view of books
        ], //refetching after adding a book
    });

    const submit = async (event) => {
        event.preventDefault();

        const publishedN = Number(published);

        const book = { title, author, published: publishedN, genres };

        addBook({ variables: book });
        console.log("[+] added book...", book);

        setTitle("");
        setPublished("");
        setAuthor("");
        setGenres([]);
        setGenre("");
    };

    const addGenre = () => {
        setGenres(genres.concat(genre));
        setGenre("");
    };

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        required={true}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        required={true}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type="number"
                        required={true}
                        value={published}
                        onChange={({ target }) => setPublished(target.value)}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">
                        add genre
                    </button>
                </div>
                <div>genres: {genres.join(" ")}</div>
                <button type="submit">create book</button>
            </form>
        </div>
    );
};

export default NewBook;
