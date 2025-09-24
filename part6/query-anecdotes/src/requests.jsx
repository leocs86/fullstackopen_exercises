import axios from "axios";

const baseUrl = "/anecdotes/";

export const getAll = async () => {
    const resp = await axios.get(baseUrl);
    return resp.data;
};

export const createAnecdote = async (content) => {
    const resp = await axios.post(baseUrl, { content: content, votes: 0 });
    return resp.data;
};

export const increaseVote = async (id) => {
    const oldVotes = (await axios.get(`${baseUrl}${id}`)).data.votes;
    const response = await axios.patch(`${baseUrl}${id}`, {
        votes: oldVotes + 1,
    });
    return response.data;
};
