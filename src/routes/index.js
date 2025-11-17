import express from "express";
const router = express.Router();
import homeController from "../controllers/home.controller.js";


router.get("/", homeController);

export default router;