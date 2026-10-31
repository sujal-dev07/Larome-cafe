import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const initialForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
};

const formatCategory = (cat) => {
    if (!cat || typeof cat !== "string") return "";
    const trimmed = cat.trim();
    if (!trimmed) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

function ManageMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const response = await api.get("/menu");
            setMenuItems(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load menu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            setSaving(true);

            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                category: formatCategory(form.category),
                image: form.image.trim(),
                isAvailable: Boolean(form.isAvailable),
            };

            if (editingId) {
                await api.put(`/menu/${editingId}`, payload);
                setMessage("Menu item updated successfully.");
            } else {
                await api.post("/menu", payload);
                setMessage("Menu item added successfully.");
            }

            resetForm();
            await fetchMenu();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to save menu item.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setForm({
            name: item.name || "",
            description: item.description || "",
            price: String(item.price ?? ""),
            category: item.category || "",
            image: item.image || "",
            isAvailable: item.isAvailable ?? true,
        });

        setMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this menu item?"
        );
        if (!confirmed) return;

        try {
            setError("");
            setMessage("");

            await api.delete(`/menu/${id}`);

            setMessage("Menu item deleted successfully.");
            await fetchMenu();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to delete menu item.");
        }
    };

    const handleAvailability = async (item) => {
        try {
            setError("");
            setMessage("");

            await api.put(`/menu/${item._id}`, {
                name: item.name,
                price: item.price,
                category: item.category,
                description: item.description || "",
                image: item.image || "",
                isAvailable: !item.isAvailable,
            });

            setMessage("Availability updated successfully.");
            await fetchMenu();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update availability.");
        }
    };

    if (loading) {
        return (
            <div className="admin-container">
                <p>Loading menu...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div style={{ marginBottom: "20px" }}>
                <Link to="/admin" style={{ color: "#8b713c", fontWeight: 600 }}>
                    ← Back to Dashboard
                </Link>
            </div>

            <h1 className="admin-page-title">Manage Menu</h1>
            <p>Add and manage your cafe menu items.</p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form className="menu-admin-form" onSubmit={handleSubmit}>
                <h2>{editingId ? "Edit Menu Item" : "Add New Menu Item"}</h2>

                <label>Item Name</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Enter item name"
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={500}
                    placeholder="Enter description"
                />

                <label>Price (₹)</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                />

                <label>Category</label>
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    placeholder="Example: Coffee, Snacks, Desserts"
                />

                <label>Image URL</label>
                <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />

                <label className="availability-label">
                    <input
                        type="checkbox"
                        name="isAvailable"
                        checked={form.isAvailable}
                        onChange={handleChange}
                    />
                    Available for customers
                </label>

                <div className="form-buttons">
                    <button type="submit" disabled={saving}>
                        {saving
                            ? "Saving..."
                            : editingId
                                ? "Update Item"
                                : "Add Item"}
                    </button>

                    {editingId && (
                        <button type="button" className="cancel-btn" onClick={resetForm}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <h2 className="menu-list-heading">Existing Menu Items</h2>

            {menuItems.length === 0 ? (
                <p>No menu items available.</p>
            ) : (
                <div className="admin-menu-list">
                    {menuItems.map((item) => (
                        <div className="admin-menu-item" key={item._id}>
                            <div>
                                <h3>{item.name}</h3>
                                <p>{item.category} · ₹{item.price}</p>
                                <span>
                                    {item.isAvailable ? "Available" : "Unavailable"}
                                </span>
                            </div>

                            <div className="admin-menu-actions">
                                <button onClick={() => handleEdit(item)}>Edit</button>

                                <button
                                    onClick={() => handleAvailability(item)}
                                    className="availability-btn"
                                >
                                    {item.isAvailable ? "Disable" : "Enable"}
                                </button>

                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageMenu;
