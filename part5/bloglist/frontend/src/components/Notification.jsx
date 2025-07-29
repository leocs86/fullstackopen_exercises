const Notification = ({ msg, type }) => {
    let color;
    type == "error" ? (color = "red") : (color = "green");

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
            {msg}
        </div>
    );
};

export default Notification;
