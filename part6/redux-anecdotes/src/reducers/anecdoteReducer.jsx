import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const anecdoteSlice = createSlice({
    name: "anecdote", //type will be based on this
    initialState,
    reducers: {
        voteAnecdote(state, action) {
            const anecdote = state.find((a) => a.id === action.payload);
            if (anecdote) {
                anecdote.votes += 1;
            }
        },
        createAnecdote(state, action) {
            state.push(action.payload);
        },
        initializeAnecdotes(state, action) {
            return action.payload;
        },
    },
});

export const { voteAnecdote, createAnecdote, initializeAnecdotes } =
    anecdoteSlice.actions;
export default anecdoteSlice.reducer;

/*
export const voteActionCreator = (id) => {
    return {
        type: "INCREMENT",
        payload: id,
    };
};

export const createActionCreator = (content) => {
    return {
        type: "CREATE",
        payload: content,
    };
};

const anecdoteReducer = (state = initialState, action) => {
    switch (action.type) {
        case "INCREMENT":
            return state.map((a) => {
                return a.id === action.payload
                    ? { ...a, votes: a.votes + 1 }
                    : a;
            });
        case "CREATE":
            return state.concat(asObject(action.payload));
        default:
            return state;
    }
};
export default anecdoteReducer;
*/
