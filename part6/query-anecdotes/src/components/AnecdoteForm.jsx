import { useMutation } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const AnecdoteForm = () => {
    const [notification, dispatch] = useContext(NotificationContext);

    const queryClient = useQueryClient();
    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (data, props) => {
            queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
            dispatch({
                type: "SHOW",
                payload: `successfully created new anecdote: "${props}"`,
            });
            setTimeout(() => dispatch({ type: "HIDE" }), 5000);
        },
        onError: () => {
            dispatch({
                type: "SHOW",
                payload: `[ERROR]: anecdote must be at least 5 chars long`,
            });
            setTimeout(() => dispatch({ type: "HIDE" }), 5000);
        },
    });

    const onCreate = (event) => {
        event.preventDefault();
        console.log("new anecdote");
        const content = event.target.anecdote.value;
        event.target.anecdote.value = "";
        newAnecdoteMutation.mutate(content);
    };

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={onCreate}>
                <input name="anecdote" />
                <button type="submit">create</button>
            </form>
        </div>
    );
};

export default AnecdoteForm;
