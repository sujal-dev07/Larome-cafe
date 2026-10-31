const express = require("express");

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
} = require("../controllers/orderController");

const validateOrder = require("../validators/orderValidator");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a customer order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - phone
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Rahul Patel
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItem:
 *                       type: string
 *                       example: 690000000000000000000001
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid order details
 *
 *   get:
 *     summary: Get all customer orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", validateOrder, createOrder);
router.get("/", adminAuth, getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get("/:id", adminAuth, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, completed, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid order status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.patch("/:id/status", adminAuth, updateOrderStatus);

module.exports = router;
