import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&auto=format&fit=crop&q=80";

function Cart() {
    const {
        cart,
        updateQuantity,
        removeFromCart,
        totalAmount,
    } = useCart();

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add something delicious from our menu.</p>

                <Link to="/" className="continue-shopping">
                    Explore Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>

            <div className="cart-items">
                {cart.map((item) => (
                    <div className="cart-item" key={item._id}>
                        <div className="cart-item-left">
                            <img
                                src={item.image || DEFAULT_IMAGE}
                                alt={item.name}
                                className="cart-item-image"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = DEFAULT_IMAGE;
                                }}
                            />

                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p>₹{item.price} each</p>
                                <strong>
                                    ₹{item.price * item.quantity}
                                </strong>
                            </div>
                        </div>

                        <div className="cart-actions">
                            <button
                                onClick={() => {
                                    if (item.quantity === 1) {
                                        removeFromCart(item._id);
                                    } else {
                                        updateQuantity(item._id, item.quantity - 1);
                                    }
                                }}
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                onClick={() =>
                                    updateQuantity(item._id, item.quantity + 1)
                                }
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                            <button
                                className="remove-btn"
                                onClick={() => removeFromCart(item._id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <h3>Total Amount: ₹{totalAmount}</h3>

                <Link to="/checkout" className="checkout-btn">
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
}

export default Cart;
