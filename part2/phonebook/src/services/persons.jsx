import axios from "axios";

const getAll = () => {
    const request = axios.get("http://localhost:3001/persons");
    return request.then((response) => response.data);
};

const createPerson = (person) => {
    const request = axios.post("http://localhost:3001/persons", person);
    return request.then((response) => response.data);
};

const deletePerson = (id) => {
    const request = axios.delete(`http://localhost:3001/persons/${id}`);
    return request.then((response) => response.data);
};

const updatePerson = (person) => {
    const request = axios.put(
        `http://localhost:3001/persons/${person.id}`,
        person
    );
    return request.then((response) => response.data);
};

export default { getAll, createPerson, deletePerson, updatePerson };
