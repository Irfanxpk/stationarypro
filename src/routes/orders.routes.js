// src/routes/orders.routes.js
import { Router } from "express";
import { randomUUID } from "crypto";
import { authRequired } from "../middleware/auth.js";
import { ORDERS, CARTS, PRODUCTS, getOrCreateCart } from "../data/db.js";

const router = Router();

// All order routes require auth
router.use(authRequired);

// 🔹 Get orders for current user
router.get("/", (req, res) => {
    const userId = req.user.id;
    const userOrders = ORDERS.filter((o) => o.userId === userId);
    res.json(userOrders);
});

// 🔹 Place order (checkout)
router.post("/", (req, res) => {
    const userId = req.user.id;
    const { deliveryAddress } = req.body;

    if (!deliveryAddress)
    {
        return res
            .status(400)
            .json({ error: "Delivery address is required" });
    }

    const cartItems = getOrCreateCart(userId);
    if (!cartItems.length)
    {
        return res.status(400).json({ error: "Cart is empty" });
    }

    const itemsWithDetails = cartItems.map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        return {
            productId: item.productId,
            quantity: item.quantity,
            product,
        };
    });

    const totalAmount = itemsWithDetails.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );

    const order = {
        id: randomUUID(),
        userId,
        customer: {
            id: req.user.id,
            phone: req.user.phone,
        },
        items: itemsWithDetails,
        totalAmount,
        deliveryAddress, // { street, city, state, zipCode, country }
        status: "Placed",
        createdAt: new Date().toISOString(),
    };

    ORDERS.push(order);

    // Clear cart after successful order
    CARTS.set(userId, []);

    res.json({
        success: true,
        order,
    });
});

export default router;
