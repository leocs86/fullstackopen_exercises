import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

let theme = createTheme({
    palette: {
        primary: { main: "#1976d2" },
        secondary: { main: "#dc004e" },
        background: { default: "#f7f7f7" },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    spacing: 8,
    components: {
        MuiButton: {
            defaultProps: {
                variant: "contained",
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 8,
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: "#3e3e3eff",
                    textDecorationColor: "#3e3e3eff",
                    "&:hover": {
                        color: "#1e1e1eff",
                        textDecorationColor: "#1e1e1eff",
                    },
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    color: "#3e3e3eff",
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);
export default theme;
