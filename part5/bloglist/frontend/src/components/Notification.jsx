const Notification = ({ msg, type }) => {
    let color;
    type == "error" ? (color = "red") : (color = "green");

    return (
        <div style={{ border: "1px solid", borderColor: color, color: color }}>
            {msg}
        </div>
    );
};

export default Notification;
