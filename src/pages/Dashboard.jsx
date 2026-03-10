import { useAuth } from "../context/authContext/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Transactions from "./Transactions.jsx";

const Dashboard = () => {
    const { logout, cookies } = useAuth();

    const nav = useNavigate();

    const [user, setUser] = useState(null);

    const [transaction, setTransactions] = useState([]);

    const [errors, setErrors] = useState(null);


    // fetch user and transactions on load
    useEffect(() => {
        fetchUser();
        fetchTransactions();
    }, []);

    async function fetchUser() {
        try {
            const res = await axios.get("http://localhost:3000/api/auth", {
                headers: { "x-auth-token": cookies.token },
            });
            setUser(res.data);
        } catch (err) {
            console.error(err.message);
        }
    }

    async function fetchTransactions() {
        try {
            const res = await axios.get("http://localhost:3000/api/transactions", {
                headers: { "x-auth-token": cookies.token },
            });
            setTransactions(res.data);
        } catch (err) {
            setErrors(err.response?.data?.errors[0]?.msg || "Failed to fetch transactions");
        }
    }

    function handleLogout() {
        logout();
        nav("/auth");
    }


    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    //get 5 most recent transactions for preview 
    const recentTransactions = transactions.slice(0, 5);

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

        <div className="dashboard-container">
{/* Welcome */}
<div className="dashboard-header">
<h1>Welcome Back!{user ? `, ${user.name}` : ""}!</h1>
<button onClick={handleLogout}>Logout</button>
</div>
{errors && <p className="error">{errors}</p>}

{/* SUMMARY CARDS */}
<div className="summary-cards">
<div className="card balance">
    <h3>Balance</h3>
    <p className={balance >= 0 ? "positive" : "negative"}>
        ${balance.toFixed(2)}</p>
</div>
<div className="card income">
    <h3>Total Income</h3>
    <p className="positive">=${totalIncome.toFixed(2)}</p>
</div>
<div className="card expenses">
<h3>Totale Expenses</h3>
<p className="negative">-${totalExpenses.toFixed(2)}</p>
</div>
</div>
{/* Recent Transactions Preview */}
<div className="recent-transactions">
    <div className="recent-header">
        <h2>Recent Transactions</h2>
        <Link to="/transactions">View All</Link>
    </div>
    {recentTransactions.length === 0 ? (
        <p>No transactions yet. 
            <Link to="/transactions">Add Transaction!</Link>
        </p>
    ) : (
        <ul className="transaction-list">
            {recentTransactions.map((t) => (
                <li key={t._id} className={`transaction-item ${t.type}`}>
                    <div className="transaction-info">
                        <span className="transaction-category">{t.category}</span>
                        <span className="transaction-description">{t.description}</span>
                        <span className="transaction-date">
                            {new Date(t.date).toLocaleDateString()}</span>
                    </div>
                    <div className="transaction-right">
                        <span className="transaction-amount">
                            {t.type === "expense" ? "-" : "+"}${t.amount}</span>
                    </div>
                </li>
            ))}
        </ul>
    )}
</div>
        </div>
        
    );
};

export default Dashboard;