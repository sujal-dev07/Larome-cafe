const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

const defaultMenuItems = [
    {
        _id: "672200000000000000000001",
        name: "Espresso",
        price: 90,
        isAvailable: true,
    },
    {
        _id: "672200000000000000000002",
        name: "Cappuccino",
        price: 140,
        isAvailable: true,
    },
    {
        _id: "672200000000000000000003",
        name: "Vanilla Latte",
        price: 160,
        isAvailable: true,
    },
    {
        _id: "672200000000000000000004",
        name: "Cold Brew",
        price: 150,
        isAvailable: true,
    },
    {
        _id: "672200000000000000000005",
        name: "Butter Croissant",
        price: 110,
        isAvailable: true,
    },
    {
        _id: "672200000000000000000006",
        name: "Avocado Toast",
        price: 210,
        isAvailable: true,
    },
    {
        _id: "672200000000000000000007",
        name: "Blueberry Muffin",
        price: 120,
        isAvailable: true,
    },
    {
        _id: "672200000000000000000008",
        name: "Iced Caramel Macchiato",
        price: 180,
        isAvailable: true,
    },
];

const calculateOrderTotal = async (requestedItems) => {
    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
        throw new Error("Your order must contain at least one item");
    }

    const items = [];
    let totalAmount = 0;

    for (const requestedItem of requestedItems) {
        const { menuItem, quantity } = requestedItem;

        if (
            typeof menuItem !== "string" ||
            !mongooseObjectIdIsValid(menuItem)
        ) {
            throw new Error("Invalid menu item ID");
        }

        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 100
        ) {
            throw new Error("Quantity must be an integer between 1 and 100");
        }

        let item = null;

        if (mongoose.connection.readyState === 1) {
            try {
                item = await MenuItem.findById(menuItem);
            } catch (_) {}
        }

        if (!item) {
            item = defaultMenuItems.find((i) => i._id === menuItem);
        }

        if (!item) {
            throw new Error(`Menu item ${menuItem} was not found`);
        }

        if (!item.isAvailable) {
            throw new Error(`${item.name} is currently unavailable`);
        }

        const subtotal = item.price * quantity;

        items.push({
            menuItem: item._id,
            name: item.name,
            quantity,
            price: item.price,
            subtotal,
        });

        totalAmount += subtotal;
    }

    return { items, totalAmount };
};

function mongooseObjectIdIsValid(id) {
    return /^[a-f\d]{24}$/i.test(id);
}

module.exports = calculateOrderTotal;
