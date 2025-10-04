import { useState } from "react";
import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client/react";

const Filter = ({ setGenreFilter }) => {
    const resp = useQuery(ALL_BOOKS); //AllBooks
    if (resp.loading) {
        return <p>loading...</p>;
    }

    const books = resp.data.allBooks;

    let genres = ["all"];
    books.forEach((b) => {
        b.genres.forEach((g) => {
            if (!genres.includes(g)) {
                genres.push(g);
            }
        });
    });

    const handleSetGenreFilter = (g) => {
        if (g === "all") {
            setGenreFilter(null);
        } else {
            setGenreFilter(g);
        }
    };

    return (
        <div>
            {genres.map((g) => (
                <button
                    style={g === "all" ? { fontWeight: "bolder" } : {}}
                    onClick={() => {
                        handleSetGenreFilter(g);
                    }}
                    key={g}
                >
                    {g}
                </button>
            ))}
        </div>
    );
};

const Books = () => {
    const [genreFilter, setGenreFilter] = useState(null);

    const resp = useQuery(ALL_BOOKS, { variables: { genre: genreFilter } }); //AllBooks filtered
    if (resp.loading) {
        return <p>loading...</p>;
    }

    const books = resp.data.allBooks;

    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.map((b) => (
                        <tr key={b.id}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Filter setGenreFilter={setGenreFilter} />
        </div>
    );
};

export default Books;
