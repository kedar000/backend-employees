import { verifyToken } from "../utils/jwt.js";

export default function authenticate(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            message: "Authorization header missing",
        });
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyToken(token);

        req.user = payload;

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}