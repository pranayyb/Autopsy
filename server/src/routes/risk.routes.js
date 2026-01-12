import express from "express";
import { getProjectRisk } from "../controllers/risk.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:projectId", verifyJWT, getProjectRisk);
export default router;
