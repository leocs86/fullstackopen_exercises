import { useDispatch } from "react-redux";
import { createAnecdoteThunk } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/messageReducer";

const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const handleAnecdoteCreation = async (e) => {
        e.preventDefault();
        const content = e.target.anecdote.value;
        e.target.anecdote.value = "";
        dispatch(createAnecdoteThunk(content));
    };

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleAnecdoteCreation}>
                <input name="anecdote" />
                <button type="submit">create</button>
            </form>
        </div>
    );
};

export default AnecdoteForm;
