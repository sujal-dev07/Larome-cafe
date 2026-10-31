const validateOrder = (req, res, next) => {
    const { customerName, phone, items } = req.body;

    if (
        typeof customerName !== "string" ||
        !customerName.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Customer name is required",
        });
    }

    if (!/^\+?[0-9]{10,15}$/.test(phone || "")) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid phone number",
        });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one order item is required",
        });
    }

    if (items.length > 50) {
        return res.status(400).json({
            success: false,
            message: "Too many different items in one order",
        });
    }

    for (const item of items) {
        if (
            !item ||
            typeof item.menuItem !== "string" ||
            !/^[a-f\d]{24}$/i.test(item.menuItem)
        ) {
            return res.status(400).json({
                success: false,
                message: "Each item must have a valid menu item ID",
            });
        }

        if (
            !Number.isInteger(item.quantity) ||
            item.quantity < 1 ||
            item.quantity > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be between 1 and 100",
            });
        }
    }

    next();
};

module.exports = validateOrder;