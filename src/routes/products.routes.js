// src/routes/products.routes.js
import { Router } from "express";
import { PRODUCTS } from "../data/db.js";

const router = Router();

// 🔹 GET all products
router.get("/", (req, res) => {
    res.json(PRODUCTS);
});

export default router;
