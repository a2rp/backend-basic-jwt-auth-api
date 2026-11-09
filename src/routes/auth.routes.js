const express = require("express");
const { rateLimit } = require("express-rate-limit");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
} = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many registration attempts. Try again later." },
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many login attempts. Try again later." },
    skipSuccessfulRequests: true,
});

router.post("/register", registrationLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/me", protect, getMe);
router.post("/logout", logoutUser);

module.exports = router;
