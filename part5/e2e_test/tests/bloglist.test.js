const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
    beforeEach(async ({ page }) => {
        await page.goto("/api/testHelper/reset");
        await page.goto("/api/testHelper/createBobby"); //bobby:Password123
        await page.goto("/");
    });

    const loginUser = async (page, username) => {
        await page.locator('input[name="Username"]').fill(username);
        await page.locator('input[name="Password"]').fill("Password123");
        await page.getByRole("button", { name: "login" }).click();
    };

    const createBlog = async (page, n = 1) => {
        await page.getByRole("button", { name: "add blog" }).click();
        await page.getByTestId("title").fill(`title${n}`);
        await page.getByTestId("author").fill(`author${n}`);
        await page.getByTestId("url").fill(`url${n}`);
        await page.getByTestId("submitBtn").click();
    };

    test("Login form is shown", async ({ page }) => {
        await expect(page.getByTestId("login-form")).toBeVisible();
    });

    describe("Login", () => {
        test("succeeds with correct credentials", async ({ page }) => {
            await page.locator('input[name="Username"]').fill("bobby");
            await page.locator('input[name="Password"]').fill("Password123");
            await page.getByRole("button", { name: "login" }).click();
            await expect(page.getByTestId("blogList")).toBeVisible();
        });

        test("fails with wrong credentials", async ({ page }) => {
            await page.locator('input[name="Username"]').fill("bobby");
            await page.locator('input[name="Password"]').fill("WrongPassword");
            await page.getByRole("button", { name: "login" }).click();
            await expect(page.getByText("Wrong Credentials")).toBeVisible();
            await expect(page.getByTestId("login-form")).toBeVisible();
        });
    });

    test("a new blog can be created", async ({ page }) => {
        await loginUser(page, "bobby");
        await page.waitForSelector('[data-testid="blogList"]');
        await page.getByRole("button", { name: "add blog" }).click();
        await page.getByTestId("title").fill("title1");
        await page.getByTestId("author").fill("author1");
        await page.getByTestId("url").fill("url1");
        await page.getByTestId("submitBtn").click();

        await expect(page.getByText("title1 (by author1)")).toBeVisible();
    });

    test("a new blog can be liked", async ({ page }) => {
        await loginUser(page, "bobby");
        await page.waitForSelector('[data-testid="blogList"]');
        await createBlog(page);
        await page.waitForSelector('[data-testid="title-author"]');

        await page.getByTestId("toggleVisibilityBtn").click();
        await page.getByTestId("likeBtn").click();

        await expect(page.getByText("likes: 1")).toBeVisible();
    });

    test("user can delete blog", async ({ page }) => {
        await loginUser(page, "bobby");
        await page.waitForSelector('[data-testid="blogList"]');
        await createBlog(page);
        await page.waitForSelector('[data-testid="title-author"]');

        await page.getByTestId("toggleVisibilityBtn").click();
        page.once("dialog", (dialog) => dialog.accept()); //accepting window.confirm
        await page.getByRole("button", { name: "remove" }).click();

        await expect(page.getByText("title1 (by author1)")).not.toBeVisible();
    });

    test("only creator can see delete btn", async ({ page }) => {
        await page.goto("/api/testHelper/createAndrea"); //bobby:Password123
        await page.goto("/");

        await loginUser(page, "bobby");
        await page.waitForSelector('[data-testid="blogList"]');
        await createBlog(page);
        await page.waitForSelector('[data-testid="title-author"]');

        await page.getByRole("button", { name: "logout" }).click();

        await loginUser(page, "andrea");
        await page.waitForSelector('[data-testid="blogList"]');

        await page.getByTestId("toggleVisibilityBtn").click();
        await expect(
            page.getByRole("button", { name: "remove" })
        ).not.toBeVisible();
    });

    test("blogs arranged based on likes", async ({ page }) => {
        await loginUser(page, "bobby");
        await page.waitForSelector('[data-testid="blogList"]');
        await createBlog(page);
        await page.waitForSelector("text=title1 (by author1)");
        await createBlog(page, 2);
        await page.waitForSelector("text=title2 (by author2)");

        let blogsTitles = await page
            .getByTestId("title-author")
            .allTextContents();
        expect(blogsTitles[0]).toBe("title1 (by author1)...");
        //now they are in order of creation (both with 0 likes)

        //toggleVisibility
        await page
            .getByRole("paragraph")
            .filter({ hasText: "title1 (by author1)" })
            .getByTestId("toggleVisibilityBtn")
            .click();
        await page
            .getByRole("paragraph")
            .filter({ hasText: "title2 (by author2)" })
            .getByTestId("toggleVisibilityBtn")
            .click();

        //1 like to the first, 2 likes to the second blog
        await page
            .getByRole("paragraph")
            .filter({ hasText: "url: url1likes: 0" })
            .getByTestId("likeBtn")
            .click();
        await page
            .getByRole("paragraph")
            .filter({ hasText: "url: url2likes: 0" })
            .getByTestId("likeBtn")
            .click();
        await page
            .getByRole("paragraph")
            .filter({ hasText: "url: url2likes: 1" })
            .getByTestId("likeBtn")
            .click();

        blogsTitles = await page.getByTestId("title-author").allTextContents();

        expect(blogsTitles[0]).toBe("title2 (by author2)hide");
        //the second blog created (2 likes) is before the first (1 like)
    });
});
