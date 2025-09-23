import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/messageReducer";
import anecdoteService from "../services/anecdoteService";

const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const handleAnecdoteCreation = async (e) => {
        e.preventDefault();
        const content = e.target.anecdote.value;
        e.target.anecdote.value = "";
        const resp = await anecdoteService.createAnecdote(content);
        dispatch(createAnecdote(resp));
        dispatch(setNotification(`created new anecdote: "${content}"`));
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
