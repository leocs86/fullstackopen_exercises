import loginService from "../services/loginService";
import { useState } from "react";
import { login } from "../reduxStore/userSlice";
import { useDispatch } from "react-redux";
import { setNotification } from "../reduxStore/notificationSlice";
import { useNavigate } from "react-router-dom";

import {
    Button,
    TextField,
    Stack,
    Card,
    CardContent,
    Typography,
    Box,
} from "@mui/material";

// components/LoginForm.jsx
const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            //setUser(user);
            dispatch(login(user));
            window.localStorage.setItem("user", JSON.stringify(user)); //saving user to brawser storage
            setPassword("");
            setUsername("");
            navigate("/");
        } catch (err) {
            console.log(err);
            dispatch(setNotification("Wrong Credentials", "error"));
        }
    };

    return (
        <Card sx={{ maxWidth: 300, margin: "0 auto", mt: 10 }}>
            <Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>
                LOGIN
            </Typography>
            <CardContent>
                <Stack
                    component="form"
                    onSubmit={handleLogin}
                    data-testid="login-form"
                    spacing={3}
                >
                    <TextField
                        id="standard-basic"
                        label="Username"
                        variant="standard"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <TextField
                        id="standard-basic"
                        label="Password"
                        variant="standard"
                        value={password}
                        type="password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    <Box sx={{ pt: 2, textAlign: "center", width: "100%" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 4, width: "100%" }}
                        >
                            Login
                        </Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default LoginForm;
