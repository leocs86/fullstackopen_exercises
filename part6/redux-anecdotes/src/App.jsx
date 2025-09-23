import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification";
import Filter from "./components/Filter";
import { useEffect } from "react";
import anecdoteService from "./services/anecdoteService";
import { useDispatch } from "react-redux";
import { initializeAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const getInitialList = async () => {
            const resp = await anecdoteService.getAll();
            dispatch(initializeAnecdotes(resp));
        };
        getInitialList();
    }, []);

    return (
        <div>
            <Notification />
            <h2>Anecdotes</h2>
            <Filter />
            <AnecdoteList />
            <AnecdoteForm />
        </div>
    );
};

export default App;
