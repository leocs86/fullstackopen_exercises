import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const containerStyle = visible
        ? {
              border: "1px solid gray",
              padding: "2rem",
              width: "fit-content",
          }
        : {};

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    useImperativeHandle(ref, () => ({
        toggleVisibility: toggleVisibility,
    }));

    return (
        <div style={containerStyle}>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>hide</button>
            </div>
        </div>
    );
});

export default Togglable;
