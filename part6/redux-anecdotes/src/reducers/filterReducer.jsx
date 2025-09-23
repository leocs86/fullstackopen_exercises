import { createSlice } from "@reduxjs/toolkit";

/*export const changeFilterActionCreator = (content) => {
    return {
        type: "CHANGE",
        payload: content,
    };
};

const filterReducer = (state = "", action) => {
    switch (action.type) {
        case "CHANGE":
            return action.payload;
        default:
            return state;
    }
};

export default filterReducer;*/

const initialState = "";

const filterSlice = createSlice({
    name: "filter", //type will be based on this
    initialState,
    reducers: {
        changeFilter(state, action) {
            return action.payload;
        },
    },
});

export const { changeFilter } = filterSlice.actions;
export default filterSlice.reducer;
