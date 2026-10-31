import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import MenuCard from "../components/MenuCard";

const formatCategory = (cat) => {
    if (!cat || typeof cat !== "string") return "";
    const trimmed = cat.trim();
    if (trimmed.toLowerCase() === "all") return "All";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

const dedupeCategories = (list) => {
    const seen = new Map();
    for (const c of list) {
        const formatted = formatCategory(c);
        if (formatted && formatted.toLowerCase() !== "all" && !seen.has(formatted.toLowerCase())) {
            seen.set(formatted.toLowerCase(), formatted);
        }
    }
    return ["All", ...Array.from(seen.values()).sort()];
};

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Initial fetch to discover all categories across the entire menu
    useEffect(() => {
        const fetchInitialCategories = async () => {
            try {
                const response = await api.get("/menu");
                const items = Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];

                const backendCats = Array.isArray(response.data?.categories)
                    ? response.data.categories
                    : [];

                const itemCats = items.map((i) => i.category).filter(Boolean);

                const merged = dedupeCategories([
                    ...backendCats,
                    ...itemCats,
                ]);

                if (merged.length > 1) {
                    setCategories(merged);
                }
            } catch (_) {}
        };

        fetchInitialCategories();
    }, []);

    const fetchMenu = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/menu", {
                params: {
                    search,
                    category,
                    sort,
                },
            });

            const items = Array.isArray(response.data?.data)
                ? response.data.data
                : [];
            setMenuItems(items);

            // Accumulate categories case-insensitively so dropdown never duplicates or loses options
            const backendCats = Array.isArray(response.data?.categories)
                ? response.data.categories
                : [];
            const itemCats = items.map((i) => i.category).filter(Boolean);

            setCategories((prev) =>
                dedupeCategories([...prev, ...backendCats, ...itemCats])
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to connect to the backend server. Please make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    }, [search, category, sort]);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const resetFilters = () => {
        setSearch("");
        setCategory("All");
        setSort("");
    };

    const hasActiveFilters = search || category !== "All" || sort;

    return (
        <div className="menu-page">
            <section className="hero">
                <span>WELCOME TO L'ARÔME</span>
                <h1>
                    Good Coffee.
                    <br />
                    Good Food. Good Mood.
                </h1>
                <p>Discover your favourite artisanal flavours.</p>
            </section>

            <section className="menu-section">
                <div className="menu-heading">
                    <h2>Our Menu</h2>
                    <p>Freshly prepared, just for you.</p>
                </div>

                <div className="menu-filters">
                    <input
                        type="text"
                        placeholder="Search menu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Sort by price</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            style={{
                                padding: "11px 18px",
                                background: "#fff",
                                border: "1px solid #dcd4c6",
                                borderRadius: "6px",
                                color: "#8b713c",
                                fontWeight: 500,
                                cursor: "pointer",
                                fontSize: "14px",
                            }}
                        >
                            Reset
                        </button>
                    )}
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <p>Loading menu...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message" style={{ margin: "20px 0" }}>
                        <p>{error}</p>
                        <button
                            onClick={fetchMenu}
                            style={{
                                marginTop: "10px",
                                padding: "8px 16px",
                                background: "#76602e",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && menuItems.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px", color: "#777" }}>
                        <p>No menu items found for this selection.</p>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                style={{
                                    marginTop: "12px",
                                    padding: "8px 16px",
                                    background: "#76602e",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                <div className="menu-grid">
                    {menuItems.map((item) => (
                        <MenuCard key={item._id} item={item} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Menu;
