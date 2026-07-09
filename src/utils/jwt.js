import "dotenv/config";
import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
        }
    );
}

export function generateRefreshToken(user) {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
        }
    );
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}