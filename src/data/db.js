// src/data/db.js
import { randomUUID } from "crypto";

export const USERS = [];         // { id, phone }
export const SESSIONS = [];      // { token, userId }
export const CARTS = new Map();  // key: userId, value: [{ productId, quantity }]
export const ORDERS = [];        // { id, userId, items, totalAmount, deliveryAddress, status, createdAt }

export const PRODUCTS = [
    {
        id: "p1",
        name: "Ballpoint Pens",
        price: 120,
        description: "Smooth writing ballpoint pens (pack of 10).",
        image: "https://images.pexels.com/photos/9430967/pexels-photo-9430967.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: "p2",
        name: "A4 Notebook",
        price: 80,
        description: "A4 lined notebook with 100 pages.",
        image: "https://images.pexels.com/photos/4792285/pexels-photo-4792285.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: "p3",
        name: "Highlighters",
        price: 150,
        description: "Set of 5 vibrant fluorescent highlighters.",
        image: "https://images.pexels.com/photos/207742/pexels-photo-207742.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: "p4",
        name: "Sticky Notes",
        price: 60,
        description: "Multicolored sticky notes (5 pad set).",
        image: "https://images.pexels.com/photos/5598298/pexels-photo-5598298.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: "p5",
        name: "Art Markers",
        price: 550,
        description: "Dual-tip alcohol-based professional art markers.",
        image: "https://images.pexels.com/photos/414579/pexels-photo-414579.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
];

export function findOrCreateUserByPhone(phone) {
    let user = USERS.find((u) => u.phone === phone);
    if (!user)
    {
        user = { id: randomUUID(), phone };
        USERS.push(user);
    }
    return user;
}

export function createSession(userId) {
    const token = randomUUID();
    SESSIONS.push({ token, userId });
    return token;
}

export function getUserBySessionToken(token) {
    const session = SESSIONS.find((s) => s.token === token);
    if (!session) return null;
    return USERS.find((u) => u.id === session.userId) || null;
}

// Optional: shared helper for cart
export function getOrCreateCart(userId) {
    if (!CARTS.has(userId))
    {
        CARTS.set(userId, []);
    }
    return CARTS.get(userId);
}
