// src/routes/admin.routes.js
import { Router } from "express";
import { ORDERS } from "../data/db.js";

const router = Router();

// 🔹 GET all orders (with optional status + search filter)
router.get("/orders", (req, res) => {
    const { status, q } = req.query;

    let result = [...ORDERS];

    if (status)
    {
        result = result.filter((o) => o.status === status);
    }

    if (q)
    {
        const query = String(q).toLowerCase();
        result = result.filter((o) => {
            const idMatch = o.id.toLowerCase().includes(query);
            const phoneMatch = (o.customer?.phone || "")
                .toLowerCase()
                .includes(query);
            const streetMatch = (o.deliveryAddress?.street || "")
                .toLowerCase()
                .includes(query);
            return idMatch || phoneMatch || streetMatch;
        });
    }

    res.json(result);
});

// 🔹 GET single order by id
router.get("/orders/:id", (req, res) => {
    const { id } = req.params;
    const order = ORDERS.find((o) => o.id === id);

    if (!order)
    {
        return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
});

// 🔹 UPDATE order status
router.patch("/orders/:id/status", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
        "Placed",
        "Confirmed",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
    ];

    if (!allowedStatuses.includes(status))
    {
        return res.status(400).json({
            error:
                "Invalid status. Allowed: " +
                allowedStatuses.join(", "),
        });
    }

    const order = ORDERS.find((o) => o.id === id);
    if (!order)
    {
        return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;

    res.json(order);
});

export default router;
