import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";

const Notification = () => {
    const notification = useSelector((state) => state.notification);

    if (!notification.message) {
        return null;
    }

    let type = "info";
    notification.type == "error" ? (type = "error") : (type = "success");

    return (
        <Alert
            severity={type}
            sx={{ position: "fixed", right: "1rem", top: "1rem" }}
        >
            {notification.message}
        </Alert>
    );
};

export default Notification;
