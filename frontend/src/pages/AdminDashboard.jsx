import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();
    const [menuCount, setMenuCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [menuRes, orderRes] = await Promise.allSettled([
                api.get("/menu"),
                api.get("/orders"),
            ]);

            if (menuRes.status === "fulfilled") {
                const data = menuRes.value.data;
                const total =
                    data?.count ??
                    (Array.isArray(data?.data) ? data.data.length : 0);
                setMenuCount(total);
            }

            if (orderRes.status === "fulfilled") {
                const data = orderRes.value.data;
                const total =
                    data?.count ??
                    (Array.isArray(data?.data) ? data.data.length : 0);
                setOrderCount(total);
            }

            if (
                menuRes.status === "rejected" &&
                orderRes.status === "rejected"
            ) {
                setError(
                    "Unable to reach the backend server. Displaying offline dashboard view."
                );
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load dashboard information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    if (loading) {
        return (
            <div className="admin-container">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div
                className="admin-heading"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "15px",
                }}
            >
                <div>
                    <p className="admin-subtitle">CAFE MANAGEMENT</p>
                    <h1>Admin Dashboard</h1>
                    <p>Manage your cafe menu and customer orders in real time.</p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <Link
                        to="/"
                        style={{
                            padding: "9px 16px",
                            border: "1px solid #c9b99a",
                            background: "#fff",
                            borderRadius: "5px",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        View Menu
                    </Link>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "9px 16px",
                            background: "#a33",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-stats">
                <div className="admin-stat-card">
                    <span>Total Menu Items</span>
                    <h2>{menuCount}</h2>
                </div>

                <div className="admin-stat-card">
                    <span>Total Orders</span>
                    <h2>{orderCount}</h2>
                </div>
            </div>

            <div className="admin-actions">
                <Link to="/admin/menu" className="admin-action-card">
                    <h3>Manage Menu</h3>
                    <p>Add, edit, delete and toggle availability of cafe items.</p>
                    <span>Manage Menu →</span>
                </Link>

                <Link to="/admin/orders" className="admin-action-card">
                    <h3>Manage Orders</h3>
                    <p>View live customer orders and update preparation status.</p>
                    <span>Manage Orders →</span>
                </Link>
            </div>
        </div>
    );
}

export default AdminDashboard;
