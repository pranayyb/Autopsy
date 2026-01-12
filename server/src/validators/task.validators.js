import { body } from "express-validator";

const createTaskValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("dueDate")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Due date must be a valid date"),
];

const updateTaskStatusValidator = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Status must be one of: pending, in-progress, completed"),
];

const updateTaskValidator = [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().isString(),
    body("dueDate")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Due date must be a valid date"),
    body("status")
        .optional()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Status must be one of: pending, in-progress, completed"),
];

export { createTaskValidator, updateTaskStatusValidator, updateTaskValidator };
