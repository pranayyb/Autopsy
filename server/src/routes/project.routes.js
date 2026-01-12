import express from "express";
import {
    createProject,
    getProjects,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createProject);
router.get("/", verifyJWT, getProjects);

export default router;
