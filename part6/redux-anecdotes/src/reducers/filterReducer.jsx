export const changeFilterActionCreator = (content) => {
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

export default filterReducer;
