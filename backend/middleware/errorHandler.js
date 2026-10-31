const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    let message = err.message || "Internal Server Error";

    // Invalid MongoDB ID
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    // MongoDB duplicate key
    if (err.code === 11000) {
        statusCode = 409;
        message = "A record with this value already exists";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;