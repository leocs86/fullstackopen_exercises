import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/graphql": {
                target: "http://localhost:4000", //every /api request will be sent here
                changeOrigin: true,
            },
        },
    },
});
