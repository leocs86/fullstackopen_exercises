const Header = (props) => {
    return <h1>{props.course.name}</h1>;
};

const Content = ({ parts }) => {
    parts = parts.map((value, i) => (
        <p key={i}>
            {value.name} {value.exercises}
        </p>
    ));

    console.log(parts);
    return <>{parts}</>;
};

const Total = ({ parts }) => {
    let sum = 0;
    parts.forEach((value) => (sum += value.exercises));
    return <p>Number of exercises {sum}</p>;
};

const App = () => {
    const course = {
        name: "Half Stack application development",
        parts: [
            {
                name: "Fundamentals of React",
                exercises: 10,
            },
            {
                name: "Using props to pass data",
                exercises: 7,
            },
            {
                name: "State of a component",
                exercises: 14,
            },
        ],
    };

    return (
        <>
            <Header course={course} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    );
};

export default App;
