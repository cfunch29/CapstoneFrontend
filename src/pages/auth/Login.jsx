import React, { useState } from "react";
import LoginForm from "../../components/loginForm/LoginForm.jsx";
import SignUp from "../../components/signUpForm/SignUp.jsx";

const Auth = () => {
    const [newUser, setNewUser] = useState(false);
    return (
        <>
        {newUser ? (
            <SignUp setNewUser={setNewUser}/> ) :
            ( <LoginForm setNewUser={setNewUser} />
            )}
            </>
    );
};

export default Auth;