import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/AuthContext.jsx";

const Navbar = () => {
    const { cookies, logout } = useAuth();
    const nav = useNavigate();

    function handleLogout() {
        logout();
        nav("/auth");
    }

    return (
        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1rem 2rem", borderBottom: "1px solid #1e1e2e" }}>
            {cookies.token ? (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/transactions">Transactions</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <Link to="/auth">Login</Link>
            
            )}
        </nav>
    );
};

export default Navbar;