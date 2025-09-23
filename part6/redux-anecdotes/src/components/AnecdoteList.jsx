import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/messageReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch();

    const anecdotes = useSelector((state) => {
        return state.filter === ""
            ? state.anecdote
            : state.anecdote.filter((i) =>
                  i.content.toLowerCase().includes(state.filter.toLowerCase())
              );
    });

    const handleVote = (id) => {
        console.log("vote", id);
        dispatch(voteAnecdote(id));
        const anecdote = anecdotes.find((i) => i.id === id).content;
        dispatch(setNotification(`voted anecdote: "${anecdote}"`));
    };

    return [...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
            <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => handleVote(anecdote.id)}>
                        vote
                    </button>
                </div>
            </div>
        ));
};

export default AnecdoteList;
