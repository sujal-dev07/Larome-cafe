const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const adminEmail = (process.env.ADMIN_EMAIL || "admin@larome.com").toLowerCase().trim();

        if (email.toLowerCase().trim() !== adminEmail) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Validate CafeAdmin@2026 directly or via bcrypt hash
        let isPasswordValid = password === "CafeAdmin@2026";

        if (!isPasswordValid && process.env.ADMIN_PASSWORD_HASH) {
            try {
                isPasswordValid = await bcrypt.compare(
                    password,
                    process.env.ADMIN_PASSWORD_HASH
                );
            } catch (err) {
                isPasswordValid = false;
            }
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = jwt.sign(
            {
                role: "admin",
                email: adminEmail,
            },
            process.env.JWT_SECRET || "larome_jwt_secret_2026_change_this_to_a_long_random_value",
            { expiresIn: "8h" }
        );

        res.status(200).json({
            success: true,
            message: "Admin login successful.",
            token,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { adminLogin };
