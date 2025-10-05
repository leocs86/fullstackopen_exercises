import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "module",
            globals: { ...globals.node },
            ecmaVersion: "latest",
        },
        rules: {
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            indent: ["error", 4], // puoi cambiare in "off" se vuoi libertà totale
            quotes: ["error", "double"], // <-- doppie virgolette
            semi: ["error", "always"], // <-- richiede il punto e virgola
            "linebreak-style": "off", // <-- disattiva errore su CRLF
            eqeqeq: "error",
            "no-trailing-spaces": "error",
            "object-curly-spacing": ["error", "always"],
            "arrow-spacing": ["error", { before: true, after: true }],
            "no-console": "off",
        },
    },
    {
        ignores: ["dist/**"],
    },
];
