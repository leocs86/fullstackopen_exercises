import { useDispatch, useSelector } from "react-redux";

const Notification = () => {
    const dispatch = useDispatch();
    const notification = useSelector((state) => state.notification);

    if (!notification.message) {
        return <></>;
    }

    let color;
    notification.type == "error" ? (color = "red") : (color = "green");

    return (
        <div
            style={{
                border: "1px solid",
                borderColor: "white",
                backgroundColor: color,
                color: "white",
                position: "fixed",
                textAlign: "center",
                right: "1rem",
                fontSize: "20px",
                padding: ".3rem",
            }}
        >
            {notification.message}
        </div>
    );
};

export default Notification;
