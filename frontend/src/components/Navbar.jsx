import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Coffee, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(Boolean(localStorage.getItem("adminToken")));
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
        navigate("/admin/login");
    };

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <Coffee size={26} />
                <span>L'Arôme.</span>
            </Link>

            <div className="nav-links">
                <Link to="/">Menu</Link>
                <Link to="/admin">Admin</Link>

                <Link to="/cart" className="cart-link">
                    <ShoppingBag size={20} />
                    Cart ({cartCount})
                </Link>

                {isAdmin && (
                    <button
                        onClick={handleLogout}
                        title="Sign out of admin"
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#777",
                            fontSize: "14px",
                        }}
                    >
                        <LogOut size={16} />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
