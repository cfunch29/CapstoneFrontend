import { useState } from "react";
import { useAuth } from "../../context/authContext/AuthContext.jsx";
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const handleClick = () => {
        setNewUser(false);
    };

    return (
        <div className="forms">
            <h2>SignUp</h2>
            <form autoComplete="off" onSubmit={handleSubmit}>

                {/* name input */}
                <label htmlFor="name1">Name: </label>
                <input
                    type="text"
                    name="name"
                    id="name1"
                    placeholder="First and Last Name"
                    onChange={handleChange}
                    value={formData.name} />

                {/* Email input */}
                <label htmlFor="email">Email: </label>
                <input
                    type="email"
                    name="email"
                    id="email1"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email} />

                {/* password input  */}
                <label htmlFor="password1">Password: </label>
                <input 
                type="password" 
                name="password" 
                id="password1"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                minLength={6} />

                 {/* confirm password input  */}
                <input 
                type="password" 
                name="password2" 
                id="password2"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={formData.password2}
                minLength={6} />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <button onClick={handleClick}>Sign In</button></p>
            {errors}
        </div>
    );
};

export default SignUp;