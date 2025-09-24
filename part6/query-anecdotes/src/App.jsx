import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAll, increaseVote } from "./requests";
import { useContext } from "react";
import NotificationContext from "./NotificationContext";

const App = () => {
    const queryClient = useQueryClient();
    const [notification, dispatch] = useContext(NotificationContext);

    const voteAnecdoteMutation = useMutation({
        mutationFn: increaseVote,
        onSuccess: (data, props) => {
            queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
            dispatch({
                type: "SHOW",
                payload: `successfully voted: "${data.content}"`,
            });
            setTimeout(() => dispatch({ type: "HIDE" }), 5000);
        },
    });

    const handleVote = (id) => {
        console.log(`vote ${id}`);
        voteAnecdoteMutation.mutate(id);
    };

    const result = useQuery({
        queryKey: ["anecdotes"],
        queryFn: getAll,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    if (result.isLoading) {
        return <p>Loading...</p>;
    }
    if (result.isError) {
        return <p>Server Error</p>;
    }
    const anecdotes = result.data;

    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification />
            <AnecdoteForm />

            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote.id)}>
                            vote
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default App;
