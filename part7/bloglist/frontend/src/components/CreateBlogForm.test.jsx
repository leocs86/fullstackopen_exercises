vi.mock("../services/blogService", () => ({
    default: {
        //for import blogService from "../services/blogService";
        createNew: vi.fn().mockResolvedValue({
            id: "1",
            title: "title test",
            author: "author test",
            url: "url test",
        }),
    },
}));

import blogService from "../services/blogService";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import CreateBlogForm from "./CreateBlogForm";

describe("<CreateBlogForm />", () => {
    let container;
    const token = "mock-token";
    let user;

    const mockSetNotification = vi.fn();
    const mockOnCreate = vi.fn();
    const mockHideBlogForm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
        container = render(
            <CreateBlogForm
                token={token}
                setNotification={mockSetNotification}
                onCreate={mockOnCreate}
                HideBlogForm={mockHideBlogForm}
            />
        ).container;
    });

    test("<CreateNewBlog /> calls function with right parameters", async () => {
        const submitBtn = screen.getByTestId("submitBtn");
        const title = screen.getByTestId("title");
        const author = screen.getByTestId("author");
        const url = screen.getByTestId("url");

        await user.type(title, "title test");
        await user.type(author, "author test");
        await user.type(url, "url test");

        await user.click(submitBtn);

        expect(blogService.createNew).toHaveBeenCalledWith({
            title: "title test",
            author: "author test",
            url: "url test",
            token: "mock-token",
        });

        expect(mockOnCreate).toHaveBeenCalledWith({
            title: "title test",
            author: "author test",
            url: "url test",
            id: "1",
        });

        expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });
});
