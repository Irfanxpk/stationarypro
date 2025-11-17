// src/routes/auth.routes.js
import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
    findOrCreateUserByPhone,
    createSession,
} from "../data/db.js";

const router = Router();

// 🔹 Step 1 — send OTP
router.post("/send-otp", (req, res) => {
    const { mobile } = req.body;

    if (!mobile)
    {
        return res.status(400).json({ error: "Mobile number required" });
    }

    // In real life you'd send SMS. Here it's static for demo.
    res.json({
        success: true,
        otp: "123456",
        message: "OTP sent (demo: always 123456)",
    });
});

// 🔹 Step 2 — verify OTP
router.post("/verify-otp", (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp)
    {
        return res.status(400).json({ error: "Mobile and OTP are required" });
    }

    if (otp !== "123456")
    {
        return res.status(401).json({ error: "Invalid OTP" });
    }

    const user = findOrCreateUserByPhone(mobile);
    const token = createSession(user.id);

    res.json({
        success: true,
        user,
        token,
    });
});

// 🔹 (Optional) get current user from token
router.get("/me", authRequired, (req, res) => {
    res.json({ user: req.user });
});

export default router;
