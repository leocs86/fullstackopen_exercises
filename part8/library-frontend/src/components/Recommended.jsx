import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client/react";

const Recommended = ({ favGenre }) => {
    const resp = useQuery(ALL_BOOKS, {
        variables: { genre: favGenre },
    }); //AllBooks filtered
    if (resp.loading) {
        return <p>loading...</p>;
    }
    const books = resp.data.allBooks;

    return (
        <div>
            <h2>recommended books</h2>
            <p>
                books in your favorite genre <b>{favGenre}</b>
            </p>

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
        </div>
    );
};

export default Recommended;
