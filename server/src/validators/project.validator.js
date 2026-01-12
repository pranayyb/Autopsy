import { body } from "express-validator";

const createProjectValidator = [
    body("name").notEmpty().withMessage("Project name is required"),
    body("description").optional().isString(),
    body("deadline").optional().isISO8601().toDate(),
    body("status").optional().isIn(["Todo", "In Progress", "Completed"]),
];

const updateProjectValidator = [
    body("name")
        .optional()
        .notEmpty()
        .withMessage("Project name cannot be empty"),
    body("description").optional().isString(),
    body("deadline").optional().isISO8601().toDate(),
    body("status").optional().isIn(["Todo", "In Progress", "Completed"]),
];

const addMemberValidator = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("role")
        .isIn(["admin", "editor", "viewer"])
        .withMessage("Role must be admin, editor, or viewer"),
];

const updateMemberValidator = [
    body("role")
        .isIn(["admin", "editor", "viewer"])
        .withMessage("Role must be admin, editor, or viewer"),
];

export {
    createProjectValidator,
    updateProjectValidator,
    addMemberValidator,
    updateMemberValidator,
};
