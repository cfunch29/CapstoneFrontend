import { AuthProvider } from "./authContext/AuthContext.jsx";
import { CookiesProvider } from "react-cookie";

export default function ContextProvider({ children }) {
    return (
        <CookiesProvider>
            <AuthProvider>{children}</AuthProvider>
        </CookiesProvider>
    );
}