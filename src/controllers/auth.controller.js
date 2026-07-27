import bcrypt from "bcrypt";
import crypto from "crypto";

import { readDB, writeDB } from "../config/db.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.js";

export async function login(req, res) {
  const { username, password } = req.body;

  const db = await readDB();

  console.log(`Recived username : ${username}`);

  const user = db.users.find((u) => u.username === username);
  console.log(`users : ${user}`);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // const valid = await bcrypt.compare(password, user.password);

  if (password !== user.password) {
    console.log(`entered pass : ${password}`);
    console.log(`user pass : ${user.password}`);
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


  const csrfToken = crypto.randomBytes(32).toString("hex");

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    },
  });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies.refresh_token;

if (!refreshToken) {
    return res.status(401).json({
        message: "Refresh token missing"
    });
}
const accessToken = generateAccessToken(user);
const newRefreshToken = generateRefreshToken(user);

const db = await readDB();
if (!db.refreshTokens.includes(refreshToken)) {
  return res.status(401).json({
    message: "Invalid refresh token",
  });
}

db.refreshTokens =
    db.refreshTokens.filter(t => t !== refreshToken);

db.refreshTokens.push(newRefreshToken);

await writeDB(db);



  try {
    const payload = verifyToken(refreshToken);

    const user = db.users.find((u) => u.id === payload.id);

    const accessToken = generateAccessToken(user);

    res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
});

res.cookie("refresh_token", newRefreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

res.json({
    success: true
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
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  });
}


export async function logout(req, res) {

    const refreshToken = req.cookies.refresh_token;

    const db = await readDB();

    db.refreshTokens =
        db.refreshTokens.filter(t => t !== refreshToken);

    await writeDB(db);

    res.clearCookie("access_token");

    res.clearCookie("refresh_token", {
        path: "/api/auth/refresh"
    });

    res.clearCookie("csrf_token");

    res.json({
        message: "Logged out"
    });
}
