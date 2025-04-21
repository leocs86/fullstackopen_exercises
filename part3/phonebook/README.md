# part3/phonebook

Updated version of `/services/person.jsx` of the phonebook **frontend** in the deployed app

```jsx
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
```

-   deployed app via render -> https://fso-phonebook-aukw.onrender.com
    -   note: after a period of inactivity it might take up to 1m to load the app [spinning-down-on-idle](https://render.com/docs/free#spinning-down-on-idle)
