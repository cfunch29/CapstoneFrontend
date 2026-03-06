import { createContext, useContext, useMemo } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const AppContext = createContext();

export const UserProvider = ({ children }) => {
    const [cookies, setCookies, removeCookie] = useCookies();





    
    return <AppContext.Provider>{children}</AppContext.Provider>;
};