import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
    const [value, setValue] = useState("");

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const reset = (event) => {
        setValue("");
    };

    return {
        inputProp: {
            type,
            value,
            onChange,
        },
        reset,
    };
};

const useResource = (baseUrl) => {
    const [resources, setResources] = useState([]);

    const getAll = async () => {
        const resp = await axios.get(baseUrl);
        setResources(resp.data);
    };

    const create = async (resource) => {
        const resp = await axios.post(baseUrl, resource);
        setResources(resources.concat(resp.data));
    };

    const service = {
        create,
        getAll,
    };

    return [resources, service];
};

const App = () => {
    const content = useField("text");
    const name = useField("text");
    const number = useField("text");

    const [notes, noteService] = useResource("http://localhost:3005/notes");
    const [persons, personService] = useResource(
        "http://localhost:3005/persons"
    );

    useEffect(() => {
        noteService.getAll();
        personService.getAll();
    }, []);

    const handleNoteSubmit = (event) => {
        event.preventDefault();
        noteService.create({ content: content.inputProp.value });
        content.reset();
    };

    const handlePersonSubmit = (event) => {
        event.preventDefault();
        personService.create({
            name: name.inputProp.value,
            number: number.inputProp.value,
        });
        name.reset();
        number.reset();
    };

    return (
        <div>
            <h2>notes</h2>
            <form onSubmit={handleNoteSubmit}>
                <input {...content.inputProp} />
                <button>create</button>
            </form>
            {notes.map((n) => (
                <p key={n.id}>{n.content}</p>
            ))}

            <h2>persons</h2>
            <form onSubmit={handlePersonSubmit}>
                name <input {...name.inputProp} /> <br />
                number <input {...number.inputProp} />
                <button>create</button>
            </form>
            {persons.map((n) => (
                <p key={n.id}>
                    {n.name} {n.number}
                </p>
            ))}
        </div>
    );
};

export default App;
