import express from "express";
import {
    createTask,
    updateTaskStatus,
    getTasks,
    getTaskDetails,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createTaskValidator,
    updateTaskStatusValidator,
    updateTaskValidator,
} from "../validators/task.validators.js";

const router = express.Router();

router.post(
    "/:id/create-task",
    verifyJWT,
    validate,
    createTaskValidator,
    createTask,
);
router.patch(
    "/:id/:taskId/update-status",
    verifyJWT,
    validate,
    updateTaskStatusValidator,
    updateTaskStatus,
);
router.get("/:id/get-tasks", verifyJWT, getTasks);
router.get("/:id/:taskId/get-task-details", verifyJWT, getTaskDetails);
router.put(
    "/:id/:taskId/update-task",
    verifyJWT,
    validate,
    updateTaskValidator,
    updateTask,
);
router.delete("/:id/:taskId/delete-task", verifyJWT, deleteTask);

export default router;
