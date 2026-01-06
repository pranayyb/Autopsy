import express from "express";
import {
    createProject,
    getProjects,
} from "../controllers/project.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);

export default router;
