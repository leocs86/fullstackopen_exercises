import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client/react";

const Books = () => {
    const resp = useQuery(ALL_BOOKS);
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
                    {books.map((a) => (
                        <tr key={a.id}>
                            <td>{a.title}</td>
                            <td>{a.author}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Books;
