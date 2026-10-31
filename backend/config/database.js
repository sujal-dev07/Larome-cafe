const mongoose = require("mongoose");
const dns = require("dns");

// Use public DNS servers for resolving MongoDB Atlas SRV records
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    console.warn("Could not set custom DNS servers:", e.message);
}

// Allow normal Mongoose buffering with a safe 15s timeout
mongoose.set("bufferTimeoutMS", 15000);

// Direct replica set fallback URI if SRV lookup fails
const DIRECT_URI =
    "mongodb://cafe_admin:Suzzi77@ac-obgbg3b-shard-00-00.d6ahxq2.mongodb.net:27017,ac-obgbg3b-shard-00-01.d6ahxq2.mongodb.net:27017,ac-obgbg3b-shard-00-02.d6ahxq2.mongodb.net:27017/cafe_ordering?ssl=true&replicaSet=atlas-2ygl4p-shard-0&authSource=admin&retryWrites=true&w=majority";

let isConnecting = false;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return true;
    }

    if (isConnecting) {
        return false;
    }

    isConnecting = true;

    const uri = process.env.MONGODB_URI || DIRECT_URI;

    const options = {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
    };

    try {
        await mongoose.connect(uri, options);
        console.log("MongoDB connected successfully");
        isConnecting = false;
        return true;
    } catch (primaryError) {
        console.warn("Primary MongoDB connection attempt failed:", primaryError.message);

        // Fallback: Try direct replica set connection without SRV
        if (uri.startsWith("mongodb+srv://")) {
            try {
                console.log("Attempting direct MongoDB replica set connection...");
                await mongoose.connect(DIRECT_URI, options);
                console.log("MongoDB connected successfully via direct replica set");
                isConnecting = false;
                return true;
            } catch (fallbackError) {
                console.error("Direct connection also failed:", fallbackError.message);
            }
        }

        isConnecting = false;
        return false;
    }
};

// Auto-reconnect in the background if disconnected
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected. Reconnecting in 5s...");
    setTimeout(() => {
        connectDB();
    }, 5000);
});

module.exports = connectDB;
