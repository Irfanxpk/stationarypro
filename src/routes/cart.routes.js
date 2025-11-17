// src/routes/cart.routes.js
import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { CARTS, PRODUCTS, getOrCreateCart } from "../data/db.js";

const router = Router();

router.use(authRequired);

// GET /api/cart
router.get("/", (req, res) => {
    const userId = req.user.id;
    const cart = getOrCreateCart(userId).map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        return {
            ...item,
            product,
        };
    });

    const total = cart.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );

    res.json({ items: cart, total });
});

// POST /api/cart/add
router.post("/add", (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product)
    {
        return res.status(404).json({ message: "Product not found" });
    }

    const cart = getOrCreateCart(userId);
    const existing = cart.find((item) => item.productId === productId);

    if (existing)
    {
        existing.quantity += quantity;
    } else
    {
        cart.push({ productId, quantity });
    }

    res.json({ message: "Added to cart", cart });
});

// POST /api/cart/update
router.post("/update", (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = getOrCreateCart(userId);
    const item = cart.find((i) => i.productId === productId);

    if (!item)
    {
        return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0)
    {
        const idx = cart.indexOf(item);
        cart.splice(idx, 1);
    } else
    {
        item.quantity = quantity;
    }

    res.json({ message: "Cart updated", cart });
});

// POST /api/cart/remove
router.post("/remove", (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = getOrCreateCart(userId);
    const newCart = cart.filter((i) => i.productId !== productId);
    CARTS.set(userId, newCart);

    res.json({ message: "Item removed", cart: newCart });
});

export default router;
