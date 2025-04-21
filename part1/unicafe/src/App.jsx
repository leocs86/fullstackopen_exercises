import { useState } from "react";

const StatisticLine = (props) => {
    return (
        <tr>
            <td>{props.text}</td>
            <td>{props.value}</td>
        </tr>
    );
};

const Button = (props) => {
    return <button onClick={props.onClick}>{props.text}</button>;
};

const Statistics = (props) => {
    const { good, neutral, bad } = props;
    console.log("Statistics", good, neutral, bad);

    const avg = (good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad);
    const positive = (good * 100) / (good + neutral + bad);

    if (good + neutral + bad != 0) {
        return (
            <>
                <h1>Statistics</h1>
                <table>
                    <tbody>
                        <StatisticLine text="good" value={good} />
                        <StatisticLine text="neutral" value={neutral} />
                        <StatisticLine text="bad" value={bad} />
                        <StatisticLine
                            text="total"
                            value={good + neutral + bad}
                        />
                        <StatisticLine text="average" value={avg} />
                        <StatisticLine
                            text="positive"
                            value={positive + " %"}
                        />
                    </tbody>
                </table>
            </>
        );
    }
    return <p>No feedback given</p>;
};

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const handleGood = () => {
        const good_new = good + 1;
        setGood(good_new);
    };
    const handleNeutral = () => {
        const neutral_new = neutral + 1;
        setNeutral(neutral_new);
    };
    const handleBad = () => {
        const bad_new = bad + 1;
        setBad(bad_new);
    };

    return (
        <div>
            <h1>Give Feedback</h1>
            <Button onClick={() => handleGood()} text="good" />
            <Button onClick={() => handleNeutral()} text="neutral" />
            <Button onClick={() => handleBad()} text="bad" />
            <Statistics good={good} bad={bad} neutral={neutral} />
        </div>
    );
};

export default App;
