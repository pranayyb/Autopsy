import express from "express";
import { getProjectInsight } from "../controllers/insight.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { insightLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.get("/:projectId", verifyJWT, insightLimiter, getProjectInsight);

export default router;
