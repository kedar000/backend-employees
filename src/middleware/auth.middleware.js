import { verifyToken } from "../utils/jwt.js";

export default function authenticate(req, res, next) {
  const token = req.cookies.access_token;

  console.log("Cookies:", req.cookies);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

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
