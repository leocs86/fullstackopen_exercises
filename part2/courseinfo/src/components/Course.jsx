const Header = ({ name }) => {
    return <h2>{name}</h2>;
};

const Part = ({ name, exercises }) => {
    return (
        <p>
            {name} {exercises}
        </p>
    );
};

const Content = ({ parts }) => {
    parts = parts.map((item) => (
        <Part
            name={item.name}
            exercises={item.exercises}
            id={item.id}
            key={item.id}
        />
    ));

    return <>{parts}</>;
};

const Total = ({ parts }) => {
    let sum = parts.reduce(function (acc, obj) {
        return acc + obj.exercises;
    }, 0);
    console.log("Sum:", sum);
    return <b>Total of {sum} exercises</b>;
};

const Course = ({ course }) => {
    console.log("Course", course.name);
    return (
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    );
};

export default Course;
