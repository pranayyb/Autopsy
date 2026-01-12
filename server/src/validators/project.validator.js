import { body } from "express-validator";
import { AvailableUserRole, AvailableTaskStatus } from "../utils/constants.js";

const createProjectValidator = [
    body("name").notEmpty().withMessage("Project name is required"),
    body("description").optional().isString(),
    body("deadline").optional().isISO8601().toDate(),
    body("status").optional().isIn(AvailableTaskStatus),
];

const updateProjectValidator = [
    body("name")
        .optional()
        .notEmpty()
        .withMessage("Project name cannot be empty"),
    body("description").optional().isString(),
    body("deadline").optional().isISO8601().toDate(),
    body("status").optional().isIn(AvailableTaskStatus),
];

const addMemberValidator = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("role")
        .isIn(AvailableUserRole)
        .withMessage(`Role must be one of: ${AvailableUserRole.join(", ")}`),
];

const updateMemberValidator = [
    body("role")
        .isIn(AvailableUserRole)
        .withMessage(`Role must be one of: ${AvailableUserRole.join(", ")}`),
];

export {
    createProjectValidator,
    updateProjectValidator,
    addMemberValidator,
    updateMemberValidator,
};
