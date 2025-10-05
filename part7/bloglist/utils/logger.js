const info = (...args) => {
    if (process.env.NODE_ENV !== "test") {
        console.log(...args);
    } //doesn't print anything if in test mode
};

const error = (...args) => {
    if (process.env.NODE_ENV !== "test") {
        console.error(...args);
    } //doesn't print anything if in test mode
};

module.exports = { info, error };
