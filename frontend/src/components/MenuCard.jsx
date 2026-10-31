import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

const MenuCard = ({ item }) => {
    const { addToCart } = useCart();

    return (
        <div className="menu-card">
            <div className="menu-image">
                <img
                    src={item.image || "https://placehold.co/600x400?text=Cafe+Item"}
                    alt={item.name}
                />
            </div>

            <div className="menu-details">
                <span className="category">{item.category}</span>

                <h3>{item.name}</h3>

                <p>{item.description}</p>

                <div className="menu-bottom">
                    <strong>₹{item.price}</strong>

                    <button
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                    >
                        <Plus size={16} />
                        {item.isAvailable ? "Add" : "Unavailable"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;