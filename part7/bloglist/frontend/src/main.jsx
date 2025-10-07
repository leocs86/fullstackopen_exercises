import ReactDOM from "react-dom/client";
import App from "./App";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./reduxStore/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <React.StrictMode>
                    <ThemeProvider theme={theme}>
                        <CssBaseline>
                            <App />
                        </CssBaseline>
                    </ThemeProvider>
                </React.StrictMode>
            </Provider>
        </QueryClientProvider>
    </BrowserRouter>
);
