import { createContext, useContext, useMemo } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
    const [cookies, setCookies, removeCookie] = useCookies();

async function login(formData) {
    let res = await axios.post("http://localhost:3000/api/auth", formData);

    setCookies("token", res.data.token);
}

async function signUp(formData) {
    let res = await axios.post("http://localhost:3000/api/user", formData);

    setCookies("token", res.data.token);
}

function logout() {
    ["token"].forEach((token) => removeCookie(token));
}

// use memo ---> stores a value from computationally functions and will not return those functions as long as the value doesn't change

const value = useMemo(() => ({
    cookies, 
    login, 
    logout,
    signUp,
    
}),
[cookies],);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Prevent excessive imports 
export function useAuth() {
    return useContext(AuthContext);
}