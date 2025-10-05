import { createSlice } from "@reduxjs/toolkit";

const initialState = { message: null, type: null };

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        showInfo(state, action) {
            const message = action.payload;
            return { message: message, type: "info" };
        },
        showError(state, action) {
            const message = action.payload;
            return { message: message, type: "error" };
        },
        hideNotification(state, action) {
            return initialState;
        },
    },
});

//thunk that automatically hides notification after timeoutInSeconds
export const setNotification = (message, type, timeoutInSeconds = 5) => {
    return (dispatch) => {
        if (type === "info") {
            dispatch(showInfo(message));
        } else {
            dispatch(showError(message));
        }

        setTimeout(() => {
            dispatch(hideNotification());
        }, timeoutInSeconds * 1000);
    };
};

export const { showInfo, showError, hideNotification } =
    notificationSlice.actions;
export default notificationSlice.reducer;
