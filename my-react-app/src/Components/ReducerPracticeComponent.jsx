import {useReducer} from "react";


export default function RedComponent() {

    function reducer(state, action) {
        switch(action.type) {
            case 'Increment':
                return {
                    size: state.size + 1,
                }
        }
    }

    const [state, dispatch] = useReducer(reducer, {size: 12});


    function handleClick() {
        dispatch({ type: 'Increment' })
    }


    return (
        <>
            <button onClick={handleClick}> increase { state.size } </button>
        </>
    )
}