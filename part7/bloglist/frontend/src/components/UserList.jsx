import { useQuery } from "@tanstack/react-query";
import userService from "../services/userService";
import { Link } from "react-router-dom";

const UserList = () => {
    const users_result = useQuery({
        queryKey: ["users"],
        queryFn: userService.getAll,
        refetchOnWindowFocus: false,
    });

    if (users_result.isError) {
        return <p>err loading data...</p>;
    }
    if (users_result.isLoading) {
        return <p>loading data...</p>;
    }

    const users = users_result.data;

    return (
        <>
            <h2>Users</h2>
            <table>
                <tbody>
                    <tr>
                        <th>username</th>
                        <th>blogs</th>
                    </tr>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>
                                <Link to={`/users/${u.id}`}>{u.username}</Link>
                            </td>
                            <td>{u.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default UserList;
