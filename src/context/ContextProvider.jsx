import { AuthProvider } from "./authContext/authContext";
import { CookiesProvider } from "react-cookie";

export default function ContextProvider({ children }) {
    return (
        <CookiesProvider>
            <AuthProvider>{children}</AuthProvider>
        </CookiesProvider>
    );
}