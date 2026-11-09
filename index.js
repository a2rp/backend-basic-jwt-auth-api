const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const startServer = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be set before the API can start");
    }

    if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET, "utf8") < 32) {
        throw new Error("JWT_SECRET must contain at least 32 random bytes");
    }

    const port = Number(process.env.PORT || 1198);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT must be an integer between 1 and 65535");
    }

    await connectDB();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});
