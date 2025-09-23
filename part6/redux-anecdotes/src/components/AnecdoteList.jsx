import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/messageReducer";
import anecdoteService from "../services/anecdoteService";

const AnecdoteList = () => {
    const dispatch = useDispatch();

    const anecdotes = useSelector((state) => {
        return state.filter === ""
            ? state.anecdote
            : state.anecdote.filter((i) =>
                  i.content.toLowerCase().includes(state.filter.toLowerCase())
              );
    });

    const handleVote = async (id) => {
        console.log("vote", id);
        const resp = await anecdoteService.voteAnecdote(id);
        dispatch(voteAnecdote(id));
        dispatch(setNotification(`voted anecdote: "${resp.content}"`));
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
