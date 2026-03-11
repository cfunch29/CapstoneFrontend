import { useState } from "react";
import { useAuth } from "../../context/authContext/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setNewUser }) => {
    const { login } = useAuth();
    const nav = useNavigate();

    const [errors, setErrors] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await login(formData);

            nav("/dashboard");
        } catch (error) {
            setErrors(error.response.data.errors.map((err) => <p>{err.msg}</p>));
        }
    }

    const handleClick = () => {
        setNewUser(true);
    };

    return (
        <div>
            <h2>Login</h2>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <div>
                <label htmlFor="email">Email: </label>
                <input 
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email} />
                </div>
                <label htmlFor="password" style={{ marginTop: "1.25rem" }} >Password: </label>
                <div>
                <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}/>
                </div>
                <button type="submit" style={{ marginTop: "1.25rem" }}>Login</button>
            </form>
            <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.85rem" }}>Don't have an account? <button onClick={handleClick} style={{ marginLeft: "1.25rem" }}>Sign Up</button></p>
            {errors}
        </div>
    );
};

export default LoginForm;