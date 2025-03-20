import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [ cartCnt, setCartCnt ] = useState(0);

    return (
        <AppContext.Provider value={{ cartCnt, setCartCnt }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);