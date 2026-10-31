const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");
const connectDB = require("../config/database");

let defaultMenuItems = [
    {
        _id: "672200000000000000000001",
        name: "Espresso",
        description: "Rich, concentrated shot of freshly roasted espresso.",
        price: 90,
        category: "Coffee",
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
    },
    {
        _id: "672200000000000000000002",
        name: "Cappuccino",
        description: "Classic espresso topped with steamed milk and velvety foam.",
        price: 140,
        category: "Coffee",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
    },
    {
        _id: "672200000000000000000003",
        name: "Vanilla Latte",
        description: "Smooth espresso and steamed milk flavored with aromatic vanilla.",
        price: 160,
        category: "Coffee",
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
    },
    {
        _id: "672200000000000000000004",
        name: "Cold Brew",
        description: "Slow-steeped for 18 hours for an ultra-smooth, refreshing finish.",
        price: 150,
        category: "Coffee",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
    },
    {
        _id: "672200000000000000000005",
        name: "Butter Croissant",
        description: "Flaky, golden-brown French pastry baked fresh daily.",
        price: 110,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
    },
    {
        _id: "672200000000000000000006",
        name: "Veg Sandwich",
        description: "Fresh vegetable sandwich with cheese on toasted artisan bread.",
        price: 120,
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
    },
    {
        _id: "672200000000000000000007",
        name: "Blueberry Muffin",
        description: "Moist vanilla muffin bursting with fresh wild blueberries.",
        price: 120,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
    },
    {
        _id: "672200000000000000000008",
        name: "Iced Caramel Macchiato",
        description: "Chilled milk marked with espresso and drizzled with sweet caramel.",
        price: 180,
        category: "Coffee",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
    },
];

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

const filterMemoryItems = (items, { category, search, sort }) => {
    let result = [...items];

    if (category && category !== "All") {
        result = result.filter(
            (item) => item.category?.toLowerCase() === category.toLowerCase()
        );
    }

    if (search) {
        const regex = new RegExp(search, "i");
        result = result.filter((item) => regex.test(item.name));
    }

    if (sort === "price_asc") {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
        result.sort((a, b) => b.price - a.price);
    }

    return result;
};

// GET all menu items
const getMenuItems = async (req, res, next) => {
    try {
        const { category, search, sort } = req.query;

        if (mongoose.connection.readyState === 1) {
            const count = await MenuItem.countDocuments();
            if (count === 0) {
                await MenuItem.insertMany(
                    defaultMenuItems.map(({ _id, ...rest }) => rest)
                );
            }

            // Silently normalize any lowercase categories in the collection
            try {
                await MenuItem.updateMany(
                    { category: { $regex: /^snacks$/i, $ne: "Snacks" } },
                    { $set: { category: "Snacks" } }
                );
            } catch (_) {}

            // Always retrieve and deduplicate all distinct categories across the full collection
            const allDistinctCategories = await MenuItem.distinct("category");
            const categoryList = dedupeCategories(allDistinctCategories);

            const filter = {};

            if (category && category !== "All") {
                filter.category = {
                    $regex: new RegExp(`^${category}$`, "i"),
                };
            }

            if (search) {
                filter.name = {
                    $regex: search,
                    $options: "i",
                };
            }

            let query = MenuItem.find(filter);

            if (sort === "price_asc") {
                query = query.sort({ price: 1 });
            } else if (sort === "price_desc") {
                query = query.sort({ price: -1 });
            }

            const items = await query;

            return res.status(200).json({
                success: true,
                count: items.length,
                categories: categoryList,
                data: items,
            });
        }

        const fallbackItems = filterMemoryItems(defaultMenuItems, {
            category,
            search,
            sort,
        });

        const fallbackCategories = dedupeCategories(
            defaultMenuItems.map((i) => i.category).filter(Boolean)
        );

        return res.status(200).json({
            success: true,
            count: fallbackItems.length,
            categories: fallbackCategories,
            data: fallbackItems,
        });
    } catch (error) {
        const fallbackItems = filterMemoryItems(defaultMenuItems, req.query);
        const fallbackCategories = dedupeCategories(
            defaultMenuItems.map((i) => i.category).filter(Boolean)
        );

        res.status(200).json({
            success: true,
            count: fallbackItems.length,
            categories: fallbackCategories,
            data: fallbackItems,
        });
    }
};

// GET a single menu item
const getMenuItemById = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const item = await MenuItem.findById(req.params.id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Menu item not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: item,
            });
        }

        const fallbackItem = defaultMenuItems.find(
            (i) => i._id === req.params.id
        );
        if (!fallbackItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found",
            });
        }

        res.status(200).json({
            success: true,
            data: fallbackItem,
        });
    } catch (error) {
        next(error);
    }
};

// CREATE a menu item
const createMenuItem = async (req, res, next) => {
    try {
        const { name, description, price, category, image, isAvailable } =
            req.body;

        const normalizedCategory = formatCategory(category);

        if (mongoose.connection.readyState === 1) {
            const item = await MenuItem.create({
                name,
                description,
                price,
                category: normalizedCategory,
                image,
                isAvailable,
            });

            return res.status(201).json({
                success: true,
                message: "Menu item created successfully",
                data: item,
            });
        }

        // Resilient fallback: Add to in-memory menu
        const newItem = {
            _id: new mongoose.Types.ObjectId().toString(),
            name,
            description: description || "",
            price: Number(price),
            category: normalizedCategory,
            image: image || "",
            isAvailable: isAvailable ?? true,
        };

        defaultMenuItems.unshift(newItem);

        res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: newItem,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE a menu item
const updateMenuItem = async (req, res, next) => {
    try {
        const updateData = { ...req.body };
        if (updateData.category) {
            updateData.category = formatCategory(updateData.category);
        }

        if (mongoose.connection.readyState === 1) {
            const item = await MenuItem.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Menu item not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Menu item updated successfully",
                data: item,
            });
        }

        // Resilient fallback: Update in-memory menu
        const index = defaultMenuItems.findIndex(
            (i) => i._id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found",
            });
        }

        defaultMenuItems[index] = {
            ...defaultMenuItems[index],
            ...updateData,
        };

        res.status(200).json({
            success: true,
            message: "Menu item updated successfully",
            data: defaultMenuItems[index],
        });
    } catch (error) {
        next(error);
    }
};

// DELETE a menu item
const deleteMenuItem = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const item = await MenuItem.findByIdAndDelete(req.params.id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Menu item not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Menu item deleted successfully",
            });
        }

        // Resilient fallback: Delete from in-memory menu
        const initialLength = defaultMenuItems.length;
        defaultMenuItems = defaultMenuItems.filter(
            (i) => i._id !== req.params.id
        );

        if (defaultMenuItems.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
};
