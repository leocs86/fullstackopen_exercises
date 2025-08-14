// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    /* Run tests in files in parallel */
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: "html",
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        trace: "on-first-retry",
        baseURL: "http://localhost:5173/",
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },

        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },

        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
    ],
});
