import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post("/auth/login", {
                email: email.trim(),
                password,
            });

            localStorage.setItem("adminToken", response.data.token);
            navigate("/admin");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-form">
                <h2>Admin Sign In</h2>
                <p>Sign in to manage the cafe menu, view orders, and update statuses.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <label htmlFor="adminEmail">Email Address</label>
                    <input
                        id="adminEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@larome.com"
                        required
                    />

                    <label htmlFor="adminPassword">Password</label>
                    <input
                        id="adminPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Login to Admin Dashboard"}
                    </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <Link to="/" style={{ color: "#777", fontSize: "14px" }}>
                        ← Back to Customer Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
