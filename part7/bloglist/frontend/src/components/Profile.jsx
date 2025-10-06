import { useSelector } from "react-redux";
import userService from "../services/userService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";

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
        return <p>loading...</p>;
    }

    if (user === "error") {
        return <p>error loading user data</p>;
    }

    return (
        <>
            <h2>Profile</h2>
            <p>name: {user.name}</p>
            <p>username: {user.username}</p>
            <p>blogs: {user.blogs.length}</p>
            <h3>Added Blogs</h3>
            <ul style={{ paddingLeft: "1rem" }}>
                {user.blogs.map((b) => (
                    <li key={b.id}>
                        {b.title} by <b>{b.author}</b>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Profile;
