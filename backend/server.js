require("dotenv").config();

const dns = require("dns");
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (_) { }

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/database");

const app = express();

// 1. Middleware
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

// Parse JSON request bodies BEFORE API routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// 3. Swagger Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 4. Home Route
app.get("/", (req, res) => {
    res.send("Cafe Ordering System Backend");
});

// 5. Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Cafe Ordering API is running!",
    });
});

// 6. Error Handling (must be last)
app.use(errorHandler);

// 7. Start Server and Connect Database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger Docs: http://localhost:${PORT}/api/docs`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
