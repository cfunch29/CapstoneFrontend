import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext/AuthContext.jsx";

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
                formData, {
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
//DELETE - delete transaction
    async function handleDelete(id) {

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


    // get unique categories from transactions for filter dropdown
    const categories = useMemo(() => {
        const unique = [...new Set(transactions.map((t) => t.category))];
        return unique.sort();
    }, [transactions]);

    // apply filters and sorting - runs anytime transactions, filterType, filterCategory, or softBy changes
    const filteredAndSorted = useMemo(() => {
        let result = [...transactions];

        //filter by type
        if (filterType !== "all")
            result = result.filter((t) => t.type === filterType);

        //filter by category
        if (filterCategory !== "all")
            result = result.filter((t) => t.category === filterCategory);

        //sort 
        result.sort((a, b) => {
            //descending date sort
            if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
            //ascending date sort 
            if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
            //amount descending
            if (sortBy === "amount-desc") return b.amount - a.amount;
            //amount ascending
            if (sortBy === "amount-asc") return a.amount - b.amount;
            return 0;
        });

        return result;

    }, [transactions, filterType, filterCategory, sortBy]);

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

                {/* Description */}
                <input
                    type="text"
                    name="description"
                    placeholder="Description (optional)"
                    value={formData.description}
                    onChange={handleChange}
                    />
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

            {/* Filter & Sort */}
            <div className="filter-sort-controls">
                {/* filter by type */}
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                {/* filter by category */}
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {/* Date descending */}
                    <option value="date-desc">Newest First</option>
                    {/* Date ascending */}
                    <option value="date-asc">Oldest First</option>
                    {/* Amount Descending  */}
                    <option value="amount-desc">Amount:  High to Low</option>
                    {/* Amount Ascending */}
                    <option value="amount-asc">Amount:  Low to High</option>
                </select>

                {/* Reset filters */}
                <button onClick={() =>{
                    setFilterType("all");
                    setFilterCategory("all");
                    setSortBy("date-desc");
                }}>Reset</button>
            </div>

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
                                <span className="transaction-amount">
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
