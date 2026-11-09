const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        let token = null;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
        });

        if (
            !decoded ||
            typeof decoded !== "object" ||
            typeof decoded.userId !== "string" ||
            !/^[a-f\d]{24}$/i.test(decoded.userId)
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token invalid",
            });
        }

        req.user = {
            userId: decoded.userId,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token invalid",
        });
    }
};

module.exports = protect;
