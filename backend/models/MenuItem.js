const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);