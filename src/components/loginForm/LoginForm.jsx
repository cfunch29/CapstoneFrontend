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
                <label htmlFor="email">Email: </label>
                <input 
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email} />
                <label htmlFor="password">Password: </label>
                <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}/>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <button onClick={handleClick}>Sign Up</button></p>
            {errors}
        </div>
    );
};

export default LoginForm;