import { createContext } from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const value = {
        // Add any values or functions you want to provide here
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
