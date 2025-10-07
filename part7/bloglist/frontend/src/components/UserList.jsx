import { useQuery } from "@tanstack/react-query";
import userService from "../services/userService";
import { Link as RouterLink } from "react-router-dom";

import {
    Typography,
    Box,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Table,
    Link,
} from "@mui/material";

const UserList = () => {
    const users_result = useQuery({
        queryKey: ["users"],
        queryFn: userService.getAll,
        refetchOnWindowFocus: false,
    });

    if (users_result.isError) {
        return <Typography>err loading data...</Typography>;
    }
    if (users_result.isLoading) {
        return <Typography>loading data...</Typography>;
    }

    const users = users_result.data;

    return (
        <Box>
            <Typography variant="h2">users</Typography>
            <TableContainer sx={{ maxWidth: 500 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>username</TableCell>
                            <TableCell>blogs</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell>
                                    <Link
                                        component={RouterLink}
                                        to={`/users/${u.id}`}
                                    >
                                        {u.username}
                                    </Link>
                                </TableCell>
                                <TableCell>{u.blogs.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserList;
