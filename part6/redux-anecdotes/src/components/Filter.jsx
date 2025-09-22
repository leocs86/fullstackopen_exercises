import { useDispatch } from "react-redux";
import { changeFilterActionCreator } from "../reducers/filterReducer";

const Filter = () => {
    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(changeFilterActionCreator(e.target.value));
    };
    const style = {
        marginBottom: 10,
    };

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    );
};

export default Filter;
