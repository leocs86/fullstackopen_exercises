import deepFreeze from "deep-freeze";
import counterReducer from "./reducer";

describe("unicafe reducer", () => {
    const initialState = {
        good: 0,
        ok: 0,
        bad: 0,
    };

    test("initial state when called with undefined", () => {
        const state = {};
        const action = {
            type: "DO_NOTHING",
        };

        const newState = counterReducer(undefined, action);
        expect(newState).toEqual(initialState);
    });

    test("GOOD is incremented", () => {
        const action = {
            type: "GOOD",
        };
        const state = initialState;

        deepFreeze(state);
        const newState = counterReducer(state, action);
        expect(newState).toEqual({
            good: 1,
            ok: 0,
            bad: 0,
        });
    });

    test("OK is incremented", () => {
        const action = {
            type: "OK",
        };
        const state = initialState;

        deepFreeze(state);
        const newState = counterReducer(state, action);
        expect(newState).toEqual({
            good: 0,
            ok: 1,
            bad: 0,
        });
    });

    test("BAD is incremented", () => {
        const action = {
            type: "BAD",
        };
        const state = initialState;

        deepFreeze(state);
        const newState = counterReducer(state, action);
        expect(newState).toEqual({
            good: 0,
            ok: 0,
            bad: 1,
        });
    });

    test("ZERO resets everything", () => {
        const state = initialState;

        deepFreeze(state);

        const okState = counterReducer(state, {
            type: "OK",
        });
        expect(okState).toEqual({
            good: 0,
            ok: 1,
            bad: 0,
        });

        const newState = counterReducer(state, {
            type: "ZERO",
        });
        expect(newState).toEqual({
            good: 0,
            ok: 0,
            bad: 0,
        });
    });
});
