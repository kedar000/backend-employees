import bcrypt from "bcrypt";

import { readDB, writeDB } from "../config/db.js";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} from "../utils/jwt.js";

export async function login(req, res) {
    const { username, password } = req.body;

    const db = await readDB();

    const user = db.users.find((u) => u.username === username);

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    db.refreshTokens.push(refreshToken);

    await writeDB(db);
    // id: string;
    // username:string;
    // email:string;
    // firstName:string;
    // lastName:string;
    // image:string;

    res.json({
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
            email : user.email,
            firstName : user.firstName,
            lastName:user.lastName,
            image : user.image
        },
    });
}

export async function refresh(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token required",
        });
    }

    const db = await readDB();

    if (!db.refreshTokens.includes(refreshToken)) {
        return res.status(401).json({
            message: "Invalid refresh token",
        });
    }

    try {
        const payload = verifyToken(refreshToken);

        const user = db.users.find((u) => u.id === payload.id);

        const accessToken = generateAccessToken(user);

        res.json({
            accessToken,
        });
    } catch {
        res.status(401).json({
            message: "Refresh token expired",
        });
    }
}

export async function me(req, res) {
    const db = await readDB();

    const user = db.users.find((u) => u.id === req.user.id);

    res.json({
        id: user.id,
        username: user.username,
        role: user.role,
    });
}