import express from "express";
import { getProjectRisk } from "../controllers/risk.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getRiskTimeline } from "../controllers/riskTimeline.controller.js";

const router = express.Router();

router.get("/:projectId", verifyJWT, getProjectRisk);
router.get("/:projectId/timeline", verifyJWT, getRiskTimeline);
export default router;
