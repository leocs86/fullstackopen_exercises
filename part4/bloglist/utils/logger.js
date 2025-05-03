const info = (msg) => {
    if (process.env.NODE_ENV !== "test") {
        console.log(msg);
    } //doesn't print anything if in test mode
};

const error = (msg) => {
    if (process.env.NODE_ENV === "test") {
        console.error(msg);
    } //doesn't print anything if in test mode
};

module.exports = { info, error };
