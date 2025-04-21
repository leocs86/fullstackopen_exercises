import { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ weather }) => {
    console.log("weather", weather);
    return (
        <>
            <h2>Weather</h2>
            <p>
                {weather.desc} {weather.emoji}
            </p>
            <p>Temperature: {weather.temp} °C</p>
            <p>Wind: {weather.wind} km/h</p>
            <p>Moon: {weather.moon}</p>
        </>
    );
};

const Country = ({ country }) => {
    const [weather, setWeather] = useState({});

    useEffect(() => {
        let copy = { ...weather }; //used to avoid async delay and setState delay
        //NOTE: with the API that i've used, no API KEY is required
        axios
            .get(`https://wttr.in/${country.name.common}?format=j1`)
            .then((response) => {
                const temp = response.data["current_condition"][0]["temp_C"];
                const wind =
                    response.data["current_condition"][0]["windspeedKmph"];
                const desc =
                    response.data["current_condition"][0]["weatherDesc"][0][
                        "value"
                    ];
                copy = { ...copy, temp: temp, wind: wind, desc: desc };
                setWeather(copy);
                console.log("finished 1");
            })
            .catch((err) => console.error(err));

        axios
            .get(`https://wttr.in/${country.name.common}?format=%c%m`)
            .then((response) => {
                const data = response.data.split(" ");
                copy = {
                    ...copy,
                    emoji: data[0],
                    moon: data[data.length - 1],
                };
                setWeather(copy);
                console.log("finished 2");
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital}</p>
            <p>
                Area: {country.area} km<sup>2</sup>
            </p>
            <p>Region: {country.region}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map((lang) => (
                    <li key={lang}>{lang}</li>
                ))}
            </ul>
            <p style={{ fontSize: "10rem", margin: "0" }}>{country.flag}</p>
            <Weather weather={weather} />
        </>
    );
};

const Countries = ({ search, countries, handleViewButton }) => {
    const result = countries.filter((obj) =>
        obj.name.common.toLowerCase().includes(search.toLowerCase())
    );

    if (result.length > 10) {
        return <p>Too many matches, please be more specific</p>;
    } else if (result.length == 1) {
        return <Country country={result[0]} />;
    }

    return (
        <>
            {result.map((country) => (
                <p key={country.cca3}>
                    {country.name.common}
                    <button
                        onClick={() => handleViewButton(country.name.common)}
                    >
                        view
                    </button>
                </p>
            ))}
        </>
    );
};

const SearchField = ({ search, handleSearchChange, handleClearBtn }) => {
    return (
        <p>
            find countries{" "}
            <input value={search} onChange={handleSearchChange} />
            <button onClick={handleClearBtn}>clear</button>
        </p>
    );
};

const App = () => {
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios
            .get("https://studies.cs.helsinki.fi/restcountries/api/all")
            .then((response) => {
                setCountries(response.data);
                console.log(response.data);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleViewButton = (name) => {
        setSearch(name);
    };

    const handleClearBtn = () => {
        setSearch("");
    };

    return (
        <>
            <SearchField
                search={search}
                handleSearchChange={handleSearchChange}
                handleClearBtn={handleClearBtn}
            />
            <Countries
                search={search}
                countries={countries}
                handleViewButton={handleViewButton}
            />
        </>
    );
};

export default App;
