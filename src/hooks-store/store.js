import { useState, useEffect } from 'react';

let globalState = {}; // global i.e. only created once on first import of useStore
let listeners = [];
let actions = {};

export const useStore = (shouldListen = true) => {
    // whenever setState function is called the component using the useStore custom hook will re-render
    const setState = useState(globalState)[1]; // only using the useState "updating" function

    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = { ...globalState, ...newState};
        for (const listener of listeners) {
            listener(globalState); // update the globalState for each "listening" component - react will re-render the component
        }
    };

    useEffect(() => {
        if (shouldListen) {
            listeners.push(setState); // add component to the listeners array when component mounts
        }
        return () => { // cleanup function
            if (shouldListen) {
                listeners = listeners.filter(li => li !== setState); // remove component from listeners array when component unmounts
            }
        };
    }, [setState, shouldListen]); // not really necessary because setState will never change

    return [globalState, dispatch]; // just like useReducer returns a state and a dispatch function
};

export const initStore = (userActions, initialState) => {
    if (initialState) {
        globalState = { ...globalState, ...initialState };
    }
    actions = { ...actions, ...userActions };
};

