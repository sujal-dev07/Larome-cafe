const validateMenuItem = (req, res, next) => {
    const { name, price, category, description, image, isAvailable } =
        req.body;

    if (
        typeof name !== "string" ||
        !name.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Menu item name is required",
        });
    }

    if (
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Price must be a valid non-negative number",
        });
    }

    if (
        typeof category !== "string" ||
        !category.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Category is required",
        });
    }

    if (
        description !== undefined &&
        typeof description !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Description must be a string",
        });
    }

    if (
        image !== undefined &&
        typeof image !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Image must be a string",
        });
    }

    if (
        isAvailable !== undefined &&
        typeof isAvailable !== "boolean"
    ) {
        return res.status(400).json({
            success: false,
            message: "Availability must be true or false",
        });
    }

    next();
};

module.exports = validateMenuItem;