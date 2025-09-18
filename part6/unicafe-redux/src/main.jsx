import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

const App = () => {
    const sendAction = (t) => {
        store.dispatch({
            type: t,
        });
    };

    return (
        <div>
            <button onClick={() => sendAction("GOOD")}>good</button>
            <button onClick={() => sendAction("OK")}>ok</button>
            <button onClick={() => sendAction("BAD")}>bad</button>
            <button onClick={() => sendAction("ZERO")}>reset stats</button>
            <div>good {store.getState().good}</div>
            <div>ok {store.getState().ok}</div>
            <div>bad {store.getState().bad}</div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
    root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
