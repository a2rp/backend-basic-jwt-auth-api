const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");

const app = express();
const allowedOrigins = new Set(
    (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.has(origin));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend Basic JWT Auth API is running",
    });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ success: false, message: "Request body must contain valid JSON" });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({ success: false, message: "Request body is too large" });
    }

    console.error("Unhandled request error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
