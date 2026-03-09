import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext/AuthContext.jsx";
import { useParams } from "react-router-dom";

const Transactions = () => {
    const { cookies } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [errors, setErrors] = useState(null);
    const [editingId, setEditingId] = useState(null); //tracks which transaction is being edited 

    const emptyForm = {
        amount: "",
        type: "expense",
        category: "",
        description: "",
        date: "",
    };

    const [formData, setFormData] = useState(emptyForm);

    //GET all transactions on page load
    useEffect(() => {
        fetchTransactions();
    }, []);

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

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    //POST - add new transaction 
    async function handleSubmit(e) {
        e.preventDefault();
        setErrors(null);
        try {
            const res = await axios.post("http://localhost:3000/api/transactions", formData, {
                headers: { "x-auth-token": cookies.token },
            });

            setTransactions([res.data, ...transactions]); //prepend to list
            setFormData(emptyForm);
        } catch (err) {
            setErrors(err.response?.data?.errors[0]?.msg || "Failed to add transactions");
        }
    }

    //populate form w/ existing data for editing 
    function handleEditClick(transaction) {
        setEditingId(transaction._id);
        setFormData({
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            description: transaction.description || "",
            date: transaction.date.slice(0, 10), // formate date
        });
    }

    //PUT - update transaction
    async function handleUpdate(e) {
        e.preventDefault();
        setErrors(null);
        try {
            const res = await axios.put(`http://localhost:3000/api/transactions/${editingId}`,
                formData {
                headers: { "x-auth-token": cookies.token },
            });

            setTransactions(transactions.map((t) =>
                t._id === editingId ? res.data : t)); //prepend to list
            setEditingId(null);
            setFormData(emptyForm);
        } catch (err) {
            setErrors(err.response?.data?.errors[0]?.msg || "Failed to udpate transactions");
        }
    }

    async function handleUpdate(id) {

        try {
            await axios.delete(`http://localhost:3000/api/transactions/${id}`, {
                headers: { "x-auth-token": cookies.token },
            });

            setTransactions(transactions.filter((t) =>
                t._id !== id));
        } catch (err) {
            setErrors(err.response?.data?.errors[0]?.msg || "Failed to delete transaction");
        }
    }

    function handleCancelEdit() {
        setEditingId(null);
        setFormData(emptyForm);
    }

    return (
        <div className="transactions-container">
            <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>

            {errors && <p className="error">{errors}</p>}

            {/* ADD/EDIT FORM */}
            <form onSubmit={editingId ? handleUpdate : handleSubmit} autoComplete="off">
                {/* Amount */}
                <input type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required />
                <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                {/* Category */}
                <input
                    type="text"
                    name="category"
                    placeholder="Category (e.g. Food, Rent)"
                    value={formData.category}
                    onChange={handleChange}
                    required />

                <input
                    type="text"
                    name="category"
                    placeholder="Category (e.g. Food, Rent)"
                    value={formData.category}
                    onChange={handleChange}
                    required />
                {/* Description */}
                <input
                    type="text"
                    name="description"
                    placeholder="Description (optional)"
                    value={formData.description}
                    onChange={handleChange}
                    required />
                {/* Date */}
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required />

                <button type="submit">{editingId ? "update" : "Add Transaction"}</button>
                {editingId && (
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                )}
            </form>

            {/* Transaction List */}
            <h2>My Transactions</h2>
            {transactions.length === 0 ? (
                <p>No Transactions yet. Add one above!</p>
            ) : (
                <ul className="transaction-list">
                    {transactions.map((t) => (
                        <li key={t._id} className={`transaction-item ${t.type}`}>
                            <div className="transaction-info">
                                <span className="transaction-category">{t.category}</span>
                                <span className="transaction-description">{t.description}</span>
                                <span className="transaction-date">
                                    {new Date(t.date).toLocaleDateString()}</span>
                            </div>
                            <div className="transaction-right">
                                <span className="transaction-right">
                                    {t.type == "expense" ? "-" : "+"}${t.amount}</span>
                                    <button onClick={() => handleEditClick(t)}>Edit</button>
                                    <button onClick={() => handleDelete(t._id)}>Delete</button>
                            </div>
                        </li> 
                    ))}
                        </ul> 
        )}
        </div>
    );
};

export default Transactions;
