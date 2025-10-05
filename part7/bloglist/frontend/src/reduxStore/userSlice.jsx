import { createSlice } from "@reduxjs/toolkit";

const loggedUserJSON = window.localStorage.getItem("user");
const initialState = loggedUserJSON ? JSON.parse(loggedUserJSON) : null;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action) {
            const user = action.payload;
            console.log("login reducer", user);
            return user;
        },
        logout(state, action) {
            return null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
