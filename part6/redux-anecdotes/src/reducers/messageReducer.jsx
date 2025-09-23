import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        showMessage(state, action) {
            return action.payload;
        },
        hideMessage(state, action) {
            return "";
        },
    },
});

export const { showMessage, hideMessage } = messageSlice.actions;

// thunk for showing a message that disappears after 5s
export const setNotification = (message, time = 5) => {
    return (dispatch) => {
        dispatch(showMessage(message));
        setTimeout(() => {
            dispatch(hideMessage());
        }, time * 1000);
    };
};

export default messageSlice.reducer;
