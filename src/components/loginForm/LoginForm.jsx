import { useState } from "react";
import { useAuth } from "../context/authContext/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setNewUser }) => {
    const { login } = useAuth();
    const nav = useNavigate();

    const [errors, setErrors] = useState(null);

}