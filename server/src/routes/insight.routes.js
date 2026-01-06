import express from "express";
import { getProjectInsight } from "../controllers/insight.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:projectId", protect, getProjectInsight);

export default router;
