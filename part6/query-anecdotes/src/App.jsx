import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAll, increaseVote } from "./requests";

const App = () => {
    const queryClient = useQueryClient();
    const voteAnecdoteMutation = useMutation({
        mutationFn: increaseVote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
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
