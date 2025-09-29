import { useState } from "react";
import { EDIT_AUTHOR } from "../mutations";
import { ALL_AUTHORS } from "../queries";
import { useMutation } from "@apollo/client/react";

const EditAuthor = ({ authors }) => {
    const [name, setName] = useState(authors[0].name);
    const [born, setBorn] = useState("");

    const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
        onError: (e) => {
            console.log(e);
        },
        refetchQueries: [{ query: ALL_AUTHORS }], //refetching after adding a book
    });

    const submit = async (event) => {
        event.preventDefault();

        const setBornTo = Number(born);

        const updAuthor = { name: name, setBornTo: setBornTo };
        console.log("edit author...", updAuthor);

        editAuthor({ variables: updAuthor });

        setName("");
        setBorn("");
    };

    return (
        <div>
            <h3 style={{ marginTop: "4rem" }}>Edit Author</h3>
            <form onSubmit={submit}>
                <select onChange={({ target }) => setName(target.value)}>
                    {authors.map((a) => (
                        <option value={a.name} key={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>
                <div>
                    born
                    <input
                        value={born}
                        required={true}
                        type="number"
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>

                <button type="submit">edit author</button>
            </form>
        </div>
    );
};

export default EditAuthor;
