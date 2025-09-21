import { useSelector, useDispatch } from "react-redux";
import { voteActionCreator } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch();
    const anecdotes = useSelector((state) => state);

    const vote = (id) => {
        console.log("vote", id);
        dispatch(voteActionCreator(id));
    };

    return anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
            <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
            </div>
        ));
};

export default AnecdoteList;
