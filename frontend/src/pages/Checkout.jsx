import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

function Checkout() {
    const { cart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (cart.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        if (!customerName.trim()) {
            setError("Customer name is required.");
            return;
        }

        const trimmedPhone = phone.trim();
        if (!/^\+?[0-9]{10,15}$/.test(trimmedPhone)) {
            setError("Please enter a valid phone number (10 to 15 digits).");
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                customerName: customerName.trim(),
                phone: trimmedPhone,
                items: cart.map((item) => ({
                    menuItem: item._id,
                    quantity: item.quantity,
                })),
            };

            const response = await api.post("/orders", orderData);

            clearCart();

            navigate("/order-success", {
                state: { order: response.data.data },
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to place your order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-container">
                <div className="checkout-form" style={{ textAlign: "center" }}>
                    <h2>Your cart is empty</h2>
                    <p>Add some items before checking out.</p>
                    <Link to="/" className="continue-shopping">
                        Explore Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-form">
                <h2>Checkout</h2>
                <p>Enter your details to place your order.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="customerName">Customer Name</label>
                    <input
                        id="customerName"
                        type="text"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        minLength={2}
                        maxLength={80}
                    />

                    <label htmlFor="phone">Phone Number</label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number (e.g. 9876543210)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <div className="checkout-summary">
                        <h3>Order Summary</h3>

                        {cart.map((item) => (
                            <div className="summary-row" key={item._id} style={{ alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: "44px",
                                                height: "44px",
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                                border: "1px solid #e0d8cc",
                                                flexShrink: 0,
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    )}
                                    <span>
                                        {item.name} × {item.quantity}
                                    </span>
                                </div>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}

                        <div className="summary-total">
                            <strong>Total</strong>
                            <strong>₹{totalAmount}</strong>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Checkout;
