import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="order-success">
                <h1>No Order Found</h1>
                <h2>It looks like you haven't placed an order recently.</h2>
                <Link to="/" className="continue-shopping">
                    Explore Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="order-success">
            <div className="success-icon">✓</div>
            <h1>Thank You!</h1>
            <h2>Your order has been placed successfully.</h2>

            <div className="success-details">
                <p>
                    <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                    <strong>Customer:</strong> {order.customerName}
                </p>
                {order.phone && (
                    <p>
                        <strong>Phone:</strong> {order.phone}
                    </p>
                )}
                {order.items && order.items.length > 0 && (
                    <div>
                        <strong>Items:</strong>
                        <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.name} × {item.quantity} (₹{item.subtotal || item.price * item.quantity})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p style={{ marginTop: "10px" }}>
                    <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>
                <p>
                    <strong>Status:</strong>{" "}
                    <span style={{ textTransform: "capitalize" }}>{order.status}</span>
                </p>
            </div>

            <Link to="/" className="continue-shopping">
                Back to Menu
            </Link>
        </div>
    );
}

export default OrderSuccess;
