// src/middleware/auth.js
import { getUserBySessionToken } from "../data/db.js";

export function authRequired(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (!token)
    {
        return res.status(401).json({ message: "Missing auth token" });
    }

    const user = getUserBySessionToken(token);
    if (!user)
    {
        return res.status(401).json({ message: "Invalid or expired session" });
    }

    req.user = user;
    next();
}
