import { useState, useEffect } from "react";
import servicePerson from "./services/persons";

const Person = ({ person, handleDeletePerson }) => {
    return (
        <p>
            {person.name} {person.number}
            <button
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDeletePerson(person)}
            >
                delete
            </button>
        </p>
    );
};

const Numbers = ({ persons, filter, handleDeletePerson }) => {
    const result = persons.map((person) => {
        if (person.name.toLowerCase().includes(filter.toLowerCase())) {
            return (
                <Person
                    key={person.id}
                    person={person}
                    handleDeletePerson={handleDeletePerson}
                />
            );
        }
    });

    return (
        <>
            <h2>Numbers</h2>
            {result}
        </>
    );
};

const FilterForm = ({ filter, handleFilterChange, setFilter }) => {
    return (
        <>
            <input
                placeholder="filter"
                value={filter}
                onChange={handleFilterChange}
            />
            <button onClick={() => setFilter("")}>clear</button>
        </>
    );
};

const AddNumberForm = ({
    handleSubmit,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange,
}) => {
    return (
        <>
            <h2>New Number</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    name: <input value={newName} onChange={handleNameChange} />
                </div>
                <div>
                    number:{" "}
                    <input value={newNumber} onChange={handleNumberChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </>
    );
};

const Notification = ({ notification }) => {
    if (!notification) {
        return;
    }

    let colorStyle;
    if (notification.mode == "success") {
        colorStyle = {
            padding: ".5rem 2rem",
            border: "2px solid green",
            color: "green",
            backgroundColor: "#c4ffc4",
        };
    } else {
        colorStyle = {
            padding: ".5rem 2rem",
            border: "2px solid red",
            color: "red",
            backgroundColor: "#dda4a4",
        };
    }

    return (
        <div
            style={{
                display: "flex",
                alignContent: "center",
                width: "100%",
                justifyContent: "center",
                position: "fixed",
                top: 0,
            }}
        >
            <p style={colorStyle}>{notification.msg}</p>
        </div>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filter, setFilter] = useState("");
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        console.log("useEffect");
        servicePerson
            .getAll()
            .then((data) => {
                console.log("POST fulfilled", data);
                setPersons(data);
            })
            .catch((err) => {
                newNotification(err.response.data.error, "error");
            });
    }, []);

    const handleNameChange = (event) => {
        //console.log(event.target.value);
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        //console.log(event.target.value);
        setNewNumber(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const newNotification = (msg, mode) => {
        setNotification({
            msg: msg,
            mode: mode,
        });
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const handleDeletePerson = (person) => {
        console.log("handleDeletePerson");
        if (window.confirm(`Do you want to delete ${person.name}?`)) {
            servicePerson
                .deletePerson(person.id)
                .then((data) => {
                    console.log("DELETE fulfilled", data);
                    setPersons(persons.filter((obj) => obj !== person));
                    newNotification(
                        `${person.name} succesfully deleted`,
                        "success"
                    );
                })
                .catch((err) => {
                    if (err.status == 404) {
                        newNotification(
                            `${person.name} is not in the phonebook`,
                            "error"
                        );
                        setPersons(persons.filter((obj) => obj !== person));
                    } else {
                        newNotification(err.response.data.error, "error");
                    }
                });
        } else console.log("Deleting cancelled from window.confirm");
    };

    const updateNumber = (newName, newNumber) => {
        const index = persons.findIndex((obj) => obj.name === newName); //arr[index]
        const updPerson = { ...persons[index], number: newNumber }; //updPerson obj

        servicePerson
            .updatePerson(updPerson)
            .then((data) => {
                console.log("PUT fulfilled", data);
                const copy = [...persons];
                copy[index] = updPerson; //updating the obj in the copy arr
                setPersons(copy); //updating the persons arr
                newNotification(`${newName} succesfully updated`, "success");
            })
            .catch((err) => {
                if (err.status == 404) {
                    newNotification(
                        `${newName} is not in the phonebook`,
                        "error"
                    );
                } else {
                    newNotification(err.response.data.error, "error");
                }
            });
    };

    const createNewPerson = () => {
        if (newName == "" || newNumber == "") {
            //empty field check
            alert("both name and phone number are required");
        } else if (persons.some((person) => person.name === newName)) {
            if (
                window.confirm(
                    `Do you want to update ${newName}'s phone number?`
                )
            ) {
                updateNumber(newName, newNumber);
            } else {
                console.log("Updating cancelled from window.confirm");
            }
        } else {
            console.log("creating new person", newName, newNumber);
            servicePerson
                .createPerson({ name: newName, number: newNumber })
                .then((data) => {
                    console.log("fulfilled POST", data);
                    setPersons(persons.concat(data));
                    newNotification(
                        `${newName} succesfully added to the phonebook`,
                        "success"
                    );
                })
                .catch((err) => {
                    newNotification(err.response.data.error, "error");
                });
        }
        setNewName("");
        setNewNumber("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createNewPerson();
    };

    return (
        <div>
            <Notification notification={notification} />
            <h1>Phonebook</h1>
            <FilterForm
                filter={filter}
                handleFilterChange={handleFilterChange}
                setFilter={setFilter}
            />
            <Numbers
                persons={persons}
                filter={filter}
                handleDeletePerson={handleDeletePerson}
            />
            <AddNumberForm //I think it makes more sense to have it at the bottom
                handleSubmit={handleSubmit}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
        </div>
    );
};

export default App;
