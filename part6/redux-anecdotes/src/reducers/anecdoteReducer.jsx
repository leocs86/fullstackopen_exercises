import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";
import { setNotification } from "./messageReducer";

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
        changeAllAnecdotes(state, action) {
            return action.payload;
        },
    },
});

export const initializeAnecdotes = () => {
    return async (dispatch) => {
        const resp = await anecdoteService.getAll();
        dispatch(changeAllAnecdotes(resp));
    };
};

export const createAnecdoteThunk = (content) => {
    return async (dispatch) => {
        const resp = await anecdoteService.createAnecdote(content);
        dispatch(createAnecdote(resp));
        dispatch(setNotification(`created new anecdote: "${content}"`));
    };
};

export const voteAnecdoteThunk = (id) => {
    return async (dispatch) => {
        const resp = await anecdoteService.voteAnecdote(id);
        dispatch(voteAnecdote(id));
        dispatch(setNotification(`voted anecdote: "${resp.content}"`));
    };
};

export const { voteAnecdote, createAnecdote, changeAllAnecdotes } =
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
