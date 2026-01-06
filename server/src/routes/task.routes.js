import express from "express";
import {
  createTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.patch("/:id/status", protect, updateTaskStatus);

export default router;
