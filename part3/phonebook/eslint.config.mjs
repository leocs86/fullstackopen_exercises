import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylisticJs from "@stylistic/eslint-plugin-js";

export default defineConfig([
    js.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.js"],
        languageOptions: { sourceType: "commonjs" },
        plugins: {
            "@stylistic/js": stylisticJs, //enable stylisticJs plugin
        },
        rules: {
            "@stylistic/js/indent": ["error", 2], //indent spaces
            "@stylistic/js/linebreak-style": ["error", "unix"], //sets newline to \n (LF)
            "@stylistic/js/quotes": ["error", "single"], //quotation marks
            "@stylistic/js/semi": ["error", "never"], //semicolons
            eqeqeq: "error", //equality with "==="
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-trailing-spaces": "error", //no spaces at the end of line
            "object-curly-spacing": ["error", "always"], //space before and after {}
            "arrow-spacing": ["error", { before: true, after: true }], //arrow func spacing
            "no-console": "off", //without setting it off, it will warn the user about console.log commands
        },
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: { globals: globals.node },
    },
    {
        ignores: ["dist/**", "frontend/**"], //ignore files cointained here
    },
]);
