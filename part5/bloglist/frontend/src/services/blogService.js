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
                Authorization: `Bearer ${token}`, // replace `token` with your actual token string
            },
        }
    );

    return response.data;
};

export default { getAll, createNew };
