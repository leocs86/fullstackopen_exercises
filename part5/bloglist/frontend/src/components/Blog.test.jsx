vi.mock("../services/blogService", () => ({
    default: {
        increaseLikes: vi.fn().mockResolvedValue({}),
    },
}));

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
    let container;
    const blog = {
        id: "123",
        title: "test-title",
        author: "test-author",
        url: "http://example.com",
        likes: 5,
        user: {
            id: "user-1",
            username: "tester",
        },
    };

    const token = "mock-token";
    const userId = "user-1";

    let user;

    const mockSetNotification = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnLiked = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
        container = render(
            <Blog
                blog={blog}
                setNotification={mockSetNotification}
                onDelete={mockOnDelete}
                token={token}
                userId={userId}
                onLiked={mockOnLiked}
            />
        ).container;
    });

    test("<Blog /> shows title, author, doesn't show more (url/likes)", async () => {
        const title_author = screen.getByTestId("title-author");
        const more = screen.queryByTestId("more"); //contains url, likes
        expect(title_author).toBeDefined();
        expect(more).toBeNull();
    });

    test("<Blog /> shows more after clicking visibility btn", async () => {
        const visBtn = screen.getByTestId("toggleVisibilityBtn");
        await user.click(visBtn);

        const more = screen.getByTestId("more"); //contains url, likes
        const likes = screen.getByText("likes: 5", { exact: false }); //making sure (not necessary :)
        expect(more).toBeDefined();
        expect(likes).toBeDefined();
    });

    test("<Blog /> clicking like btn twice", async () => {
        //making more visible
        const visBtn = screen.getByTestId("toggleVisibilityBtn");
        await user.click(visBtn);

        const likeBtn = screen.getByTestId("likeBtn");
        await user.click(likeBtn); //1
        await user.click(likeBtn); //2

        expect(mockOnLiked).toHaveBeenCalledTimes(2);
    });
});
