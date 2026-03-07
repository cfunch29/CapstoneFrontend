import { useAuth } from "../context/authContext/AuthContext.jsx";
import { Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
    const { cookies } = useAuth();

    return cookies.token ? <Outlet /> : <h1>You are not Authorized</h1>;
}