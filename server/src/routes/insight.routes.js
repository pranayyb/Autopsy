import express from "express";
import { getProjectInsight } from "../controllers/insight.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { insightLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.get("/:projectId", protect, insightLimiter, getProjectInsight);

export default router;
