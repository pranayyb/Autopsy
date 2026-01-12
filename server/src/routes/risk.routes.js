import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getRiskTimeline,
    getTopRiskTasks,
    getProjectRisks,
    getTaskRisks,
    resolveRisk,
    evaluateProjectRisk,
} from "../controllers/risk.controller.js";

const router = express.Router();

router.get("/:projectId/get-project-health", verifyJWT, evaluateProjectRisk);
router.get("/:projectId/get-timeline", verifyJWT, getRiskTimeline);
router.get("/:projectId/get-top-risk-tasks", verifyJWT, getTopRiskTasks);
router.get("/:projectId/get-project-risks", verifyJWT, getProjectRisks);
router.get("/tasks/:taskId/get-task-risks", verifyJWT, getTaskRisks);
router.put("/:riskId/resolve-risk", verifyJWT, resolveRisk);

export default router;
