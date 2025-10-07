import { useSelector } from "react-redux";
import userService from "../services/userService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";
import { Link as RouterLink } from "react-router-dom";

import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Link,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Profile = ({ id }) => {
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    //using useState and useEffect because no other component needs this

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await userService.getOne(id);
                setUser(result);
            } catch (error) {
                dispatch(setNotification("invalid user id", "error"));
                setUser("error");
            }
        };
        fetchUser();
    }, []);

    if (!user) {
        return <Typography>loading...</Typography>;
    }

    if (user === "error") {
        return <Typography>error loading user data</Typography>;
    }

    return (
        <Box>
            <Typography variant="h2">profile</Typography>
            <Typography>name: {user.name}</Typography>
            <Typography>username: {user.username}</Typography>
            <Typography>blogs: {user.blogs.length}</Typography>
            <Typography variant="h4" sx={{ mt: 2 }}>
                Added Blogs
            </Typography>
            <List>
                {user.blogs.map((b) => (
                    <ListItem key={b.id} sx={{ pl: 0, pb: 0, pt: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                            <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Link
                                    component={RouterLink}
                                    to={`/blogs/${b.id}`}
                                    underline="hover"
                                    color="primary"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {b.title} by {b.author}
                                </Link>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Profile;
