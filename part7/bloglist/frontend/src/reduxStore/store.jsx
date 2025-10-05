//store.jsx
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
//someReducer
const store = configureStore({
    //instead of createStore and combineReducers
    reducer: {
        user: userReducer,
        notification: notificationReducer,
    },
});

export default store;
