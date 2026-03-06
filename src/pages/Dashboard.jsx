import { useAuth } from "../context/authContext/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const { logout, cookies } = useAuth;

    const nav = useNavigate();

    const [user, setUser] = useState(null);

    function handleLogout() {
        logout();
        nav("/auth");
    }

    async function handleGetData(e) {
        try {
            let res = await axios.get("http://localhost:3000/api/auth", {
                headers: { "x-auth-token": cookies.token },
            });

            setUser(res.data);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div>
            <h1>Only Users Should See this Page</h1>

            <button onClick={handleLogout}>Logout</button>
            {user ? (
                <h1>Welcome {user.name}</h1>
            ) : (
                <button onClick={handleGetData}>Get User Data</button>
            )}
        </div>
    );
};

export default Dashboard;