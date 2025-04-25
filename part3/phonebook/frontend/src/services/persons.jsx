import axios from "axios";

const baseUrl = "/api/persons"; //changed to relative url

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
};

const createPerson = (person) => {
    const request = axios.post(baseUrl, person);
    return request.then((response) => response.data);
};

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then((response) => response.data);
};

const updatePerson = (person) => {
    const request = axios.put(`${baseUrl}/${person.id}`, person);
    return request.then((response) => response.data);
};

export default { getAll, createPerson, deletePerson, updatePerson };
