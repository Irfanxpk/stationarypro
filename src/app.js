// src/app.js
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

app.use(
    cors({
        origin: "https://stationarypro-web.vercel.app", // Nuxt/Next frontend
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "ok", app: "StationeryPro API" });
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);

export default app;
