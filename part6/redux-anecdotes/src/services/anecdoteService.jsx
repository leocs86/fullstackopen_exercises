import axios from "axios";

const baseURL = "http://127.0.0.1:3000/anecdotes/";

const getAll = async () => {
    const response = await axios.get(baseURL);
    console.log(response.data);
    return response.data;
};

const createAnecdote = async (content) => {
    const response = await axios.post(baseURL, { content: content, votes: 0 });
    return response.data;
};

const voteAnecdote = async (id) => {
    const oldVotes = (await axios.get(`${baseURL}${id}`)).data.votes;
    const response = await axios.patch(`${baseURL}${id}`, {
        votes: oldVotes + 1,
    });
    return response.data;
};

export default { getAll, createAnecdote, voteAnecdote };
