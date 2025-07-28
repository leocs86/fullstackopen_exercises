import loginService from "../services/loginService";
import { useState } from "react";

// components/LoginForm.jsx
const LoginForm = ({ setNotification, setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            setUser(user);
            window.localStorage.setItem("user", JSON.stringify(user)); //saving user to brawser storage
            setPassword("");
            setUsername("");
        } catch (exception) {
            setNotification({ msg: "Wrong Credentials", type: "error" });
            setTimeout(() => {
                setNotification({});
            }, 5000);
        }
    };

    return (
        <form onSubmit={handleLogin}>
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
