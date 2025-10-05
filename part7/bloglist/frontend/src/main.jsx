import ReactDOM from "react-dom/client";
import App from "./App";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./reduxStore/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </Provider>
        </QueryClientProvider>
    </BrowserRouter>
);
