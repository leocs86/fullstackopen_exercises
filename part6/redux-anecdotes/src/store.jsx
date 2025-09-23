import { configureStore } from "@reduxjs/toolkit";

import filterReducer from "./reducers/filterReducer";
import anecdoteReducer from "./reducers/anecdoteReducer";
import messageReducer from "./reducers/messageReducer";

const store = configureStore({
    reducer: {
        filter: filterReducer,
        anecdote: anecdoteReducer,
        message: messageReducer,
    },
});

export default store;
