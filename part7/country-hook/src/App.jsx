import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
    const [value, setValue] = useState("");

    const onChange = (event) => {
        console.log("chiamate useField");
        setValue(event.target.value);
    };

    return {
        type,
        value,
        onChange,
    };
};

const useCountry = (name) => {
    const [country, setCountry] = useState(null);

    useEffect(() => {
        const getAll = async () => {
            if (name === "") {
                return null;
            }
            console.log("chiamata useEffect");
            try {
                const result = await axios.get(
                    `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
                );
                setCountry({ ...result, found: true });
            } catch (err) {
                if (err.status === 404) {
                    setCountry({ found: false });
                }
            }
        };
        getAll();
    }, [name]);

    return country;
};

const Country = ({ country }) => {
    console.log("Country: ", country);
    if (!country) {
        return null;
    }

    if (!country.found) {
        return <div>not found...</div>;
    }

    return (
        <div>
            <h3>{country.data.name.common}</h3>
            <div>capital {country.data.capital[0]} </div>
            <div>population {country.data.population}</div>
            <img
                src={country.data.flags.png}
                height="100"
                alt={`flag of ${country.data.name.common}`}
            />
        </div>
    );
};

const App = () => {
    const nameInput = useField("text");
    const [name, setName] = useState("");
    const country = useCountry(name);

    const fetch = (e) => {
        e.preventDefault();
        setName(nameInput.value);
    };

    return (
        <div>
            <form onSubmit={fetch}>
                <input {...nameInput} />
                <button>find</button>
            </form>

            <Country country={country} />
        </div>
    );
};

export default App;
