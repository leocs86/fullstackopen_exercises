import { useState } from "react";

const Anectode = ({ anecdote, vote }) => {
    return (
        <>
            <h1>Anecdote of the day</h1>
            <p>{anecdote}</p>
            <p>has {vote} votes</p>
        </>
    );
};

const MostVoted = ({ anecdotes, votes }) => {
    let n = 0;

    votes.forEach((v, i) => {
        if (votes[i] > votes[n]) {
            n = i;
        }
    });

    console.log("MostVoted", n, votes[n], anecdotes[n]);

    return (
        <>
            <h1>Anectode with most votes</h1>
            <p>{anecdotes[n]}</p>
            <p>has {votes[n]} votes</p>
        </>
    );
};

const App = () => {
    const randomInteger = (min, max) => {
        //[min, max]
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const randomAnectode = () => {
        const randint = randomInteger(0, anecdotes.length - 1);
        setSelected(randint);
        console.log("New random anectode", randint, anecdotes[randint]);
    };

    const voteAnectode = (n) => {
        const copy = [...votes];
        copy[n] += 1;
        console.log(copy);
        setVotes(copy);
    };

    const anecdotes = [
        "If it hurts, do it more often.",
        "Adding manpower to a late software project makes it later!",
        "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "Premature optimization is the root of all evil.",
        "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
        "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
        "The only way to go fast, is to go well.",
    ];

    const [selected, setSelected] = useState(0);
    const [votes, setVotes] = useState(Array(anecdotes.length).fill(0)); //votes is not a state element?

    return (
        <div>
            <Anectode anecdote={anecdotes[selected]} vote={votes[selected]} />
            <button onClick={() => voteAnectode(selected)}>vote</button>
            <button onClick={() => randomAnectode()}>next anectode</button>
            <MostVoted anecdotes={anecdotes} votes={votes} />
        </div>
    );
};

export default App;
