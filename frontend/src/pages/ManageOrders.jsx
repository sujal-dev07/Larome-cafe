import { useEffect, useState } from "react";
import api from "../services/api";

const statuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "completed",
    "cancelled",
];

function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await api.get("/orders");

            setOrders(response.data.data || []);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load customer orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            setUpdatingId(orderId);
            setError("");
            setMessage("");

            await api.patch(`/orders/${orderId}/status`, {
                status: status,
            });

            setMessage("Order status updated successfully.");

            await fetchOrders();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update order status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="admin-container">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="admin-container">

            <div className="orders-heading">
                <div>
                    <p className="admin-subtitle">CAFE MANAGEMENT</p>
                    <h1 className="admin-page-title">Manage Orders</h1>
                    <p>View customer orders and manage their status.</p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchOrders}
                >
                    Refresh Orders
                </button>
            </div>

            {error && (
                <div className="error-message">{error}</div>
            )}

            {message && (
                <div className="success-message">{message}</div>
            )}

            <div className="orders-count">
                Total Orders: <strong>{orders.length}</strong>
            </div>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <h3>No orders found</h3>
                    <p>Customer orders will appear here.</p>
                </div>
            ) : (
                <div className="orders-list">

                    {orders.map((order) => (
                        <div className="order-card" key={order._id}>

                            <div className="order-card-header">
                                <div>
                                    <h3>
                                        Order #{order._id.slice(-6).toUpperCase()}
                                    </h3>

                                    <p>
                                        {new Date(order.createdAt).toLocaleString("en-IN")}
                                    </p>
                                </div>

                                <span className={`status-badge ${order.status}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-customer">
                                <p>
                                    <strong>Customer:</strong> {order.customerName}
                                </p>

                                <p>
                                    <strong>Phone:</strong> {order.phone}
                                </p>
                            </div>

                            <div className="order-products">
                                <h4>Ordered Items</h4>

                                {order.items?.map((item, index) => (
                                    <div className="order-product-row" key={index}>
                                        <span>
                                            {item.name} × {item.quantity}
                                        </span>

                                        <span>
                                            ₹{item.subtotal ?? item.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card-footer">
                                <h3>Total: ₹{order.totalAmount}</h3>

                                <div className="status-control">
                                    <label htmlFor={`status-${order._id}`}>
                                        Update Status:
                                    </label>

                                    <select
                                        id={`status-${order._id}`}
                                        value={order.status}
                                        disabled={updatingId === order._id}
                                        onChange={(e) =>
                                            updateStatus(order._id, e.target.value)
                                        }
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() +
                                                    status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default ManageOrders;