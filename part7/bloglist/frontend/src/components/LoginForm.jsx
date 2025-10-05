import loginService from "../services/loginService";
import { useState } from "react";
import { login } from "../reduxStore/userSlice";
import { useDispatch } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";

// components/LoginForm.jsx
const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            //setUser(user);
            dispatch(login(user));
            window.localStorage.setItem("user", JSON.stringify(user)); //saving user to brawser storage
            setPassword("");
            setUsername("");
        } catch (err) {
            console.log(err);
            dispatch(setNotification("Wrong Credentials", "error"));
        }
    };

    return (
        <form onSubmit={handleLogin} data-testid="login-form">
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    );
};

export default LoginForm;
