import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/dashboardController.js";

const dashboardRoute = express.Router();

dashboardRoute.get("/", protect, getDashboard);

export default dashboardRoute;
