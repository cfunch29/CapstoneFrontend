import { useState } from "react";
import { useAuth } from "../context/authContext/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const SignUp = ({ setNewUser }) => {
    const [errors, setErrors] = useState(null);
    const { signUp } = useAuth();
    const nav = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
    });

    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            //handle errors if password verification does not match and send an alert to re-enter matching passwords
            if (formData.password !== formData.password2) {
                alert("Passwords don't match");
            } else {
                await signUp(formData);

                // navigate to the dashboard page
                nav("/dashboard");
            }
        } catch (error) {
            setErrors(error.response.data.errors.map((err) => <p>{err.msg}</p>));
        }
    }
    
}