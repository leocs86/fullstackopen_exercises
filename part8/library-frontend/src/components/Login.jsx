import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { LOGIN } from "../mutations";
import { ME } from "../queries";
import { useNavigate } from "react-router-dom";

const Login = ({ client }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [login] = useMutation(LOGIN, {
        onError: (e) => {
            console.log(e);
        },
        refetchQueries: [{ query: ME }], //maybe manually updating cache?
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resp = await login({
            variables: { username: username, password: password },
        });

        window.localStorage.setItem("token", resp.data.login.value);
        console.log("[+] saved token: ", window.localStorage.getItem("token"));

        client.resetStore(); //to avoid timing problems when refetching ME

        setUsername("");
        setPassword("");

        navigate("/");
    };

    return (
        <div>
            <h2></h2>
            <form onSubmit={handleSubmit}>
                <div>
                    username
                    <input
                        type="string"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
