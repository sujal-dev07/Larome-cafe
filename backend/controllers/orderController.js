const mongoose = require("mongoose");
const Order = require("../models/Order");
const calculateOrderTotal = require("../utils/calculateOrderTotal");
const connectDB = require("../config/database");

let inMemoryOrders = [];

// CREATE ORDER
const createOrder = async (req, res, next) => {
    try {
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

        const calculatedOrder = await calculateOrderTotal(items);

        if (mongoose.connection.readyState === 1) {
            const order = await Order.create({
                customerName: customerName.trim(),
                phone,
                items: calculatedOrder.items,
                totalAmount: calculatedOrder.totalAmount,
            });

            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                data: order,
            });
        }

        // Resilient fallback: Save to in-memory orders
        const newOrder = {
            _id: new mongoose.Types.ObjectId().toString(),
            customerName: customerName.trim(),
            phone,
            items: calculatedOrder.items,
            totalAmount: calculatedOrder.totalAmount,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        inMemoryOrders.unshift(newOrder);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: newOrder,
        });
    } catch (error) {
        if (
            error.message.startsWith("Invalid") ||
            error.message.startsWith("Quantity") ||
            error.message.startsWith("Your order") ||
            error.message.includes("was not found") ||
            error.message.includes("unavailable")
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        next(error);
    }
};

// GET ALL ORDERS
const getOrders = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const orders = await Order.find().sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders,
            });
        }

        res.status(200).json({
            success: true,
            count: inMemoryOrders.length,
            data: inMemoryOrders,
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            count: inMemoryOrders.length,
            data: inMemoryOrders,
        });
    }
};

// GET SINGLE ORDER
const getOrderById = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: order,
            });
        }

        const fallbackOrder = inMemoryOrders.find(
            (o) => o._id === req.params.id
        );

        if (!fallbackOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            data: fallbackOrder,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res, next) => {
    try {
        const allowedStatuses = [
            "pending",
            "confirmed",
            "preparing",
            "ready",
            "completed",
            "cancelled",
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
        }

        if (mongoose.connection.readyState === 1) {
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true, runValidators: true }
            );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Order status updated successfully",
                data: order,
            });
        }

        const index = inMemoryOrders.findIndex(
            (o) => o._id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        inMemoryOrders[index] = {
            ...inMemoryOrders[index],
            status,
            updatedAt: new Date().toISOString(),
        };

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: inMemoryOrders[index],
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
};
