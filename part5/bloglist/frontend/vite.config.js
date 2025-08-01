import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3003",
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq, req) => {
                        console.log(`[VITE-PROXY] ${req.method} ${req.url}`);
                    });
                },
            },
        },
    },
    test: {
        environment: "jsdom",
        globals: true, //no need to import some keywords (expect, render...) in each file
        setupFiles: "./testSetup.js",
    },
});
