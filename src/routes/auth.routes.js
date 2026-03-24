const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
} = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/logout", logoutUser);

module.exports = router;
