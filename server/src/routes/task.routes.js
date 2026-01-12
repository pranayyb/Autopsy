import express from "express";
import {
    createTask,
    updateTaskStatus,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createTask);
router.patch("/:id/status", verifyJWT, updateTaskStatus);

export default router;
