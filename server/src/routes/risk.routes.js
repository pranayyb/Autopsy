import express from "express";
import { getProjectRisk } from "../controllers/risk.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:projectId", protect, getProjectRisk);

export default router;
