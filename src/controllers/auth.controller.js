const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invalidCredentials = { success: false, message: "Invalid credentials" };

const isPasswordWithinBcryptLimit = (password) =>
    typeof password === "string" &&
    !password.includes("\0") &&
    Buffer.byteLength(password, "utf8") <= 72;

const registerUser = async (req, res) => {
    try {
        const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
        const { name, email, password } = body;

        if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
            return res.status(400).json({
                success: false,
                message: "Name is required and must be 80 characters or fewer",
            });
        }

        if (typeof email !== "string" || email.trim().length > 254 || !emailPattern.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "A valid email address is required",
            });
        }

        if (typeof password !== "string" || [...password].length < 8 || !isPasswordWithinBcryptLimit(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and no more than 72 UTF-8 bytes",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        console.error("Registration failed:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
        const { email, password } = body;

        if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail) || !isPasswordWithinBcryptLimit(password)) {
            return res.status(401).json(invalidCredentials);
        }

        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!user) {
            return res.status(401).json(invalidCredentials);
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json(invalidCredentials);
        }

        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: process.env.JWT_EXPIRES_IN || "1h",
            },
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Profile lookup failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile",
        });
    }
};

const logoutUser = (req, res) => res.status(200).json({
    success: true,
    message: "Logout successful. Delete the token from the client; this endpoint does not revoke it.",
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
};
