import { useSelector, useDispatch } from "react-redux";
import { createActionCreator } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const handleAnecdoteCreation = (e) => {
        e.preventDefault();
        const content = e.target.anecdote.value;
        e.target.anecdote.value = "";
        dispatch(createActionCreator(content));
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
