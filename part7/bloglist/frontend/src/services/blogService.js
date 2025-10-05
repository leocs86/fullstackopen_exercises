import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const createNew = async ({ title, author, url, token }) => {
    const response = await axios.post(
        baseUrl,
        {
            title: title,
            author: author,
            url: url,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

const increaseLikes = async ({ blogId, currentLikes }) => {
    const response = await axios.put(`${baseUrl}/${blogId}`, {
        likes: currentLikes + 1,
    });

    return response.data;
};

const deleteBlog = async ({ blogId, token }) => {
    const response = await axios.delete(`${baseUrl}/${blogId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.data === "") {
        return { id: blogId }; //returning id of deleted blog if successful
    }

    return response.data;
};

export default { getAll, createNew, increaseLikes, deleteBlog };
