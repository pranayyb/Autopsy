import express from "express";
import {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    getMembers,
    addMember,
    updateMemberRole,
    deleteMember,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createProjectValidator,
    updateProjectValidator,
    addMemberValidator,
    updateMemberValidator,
} from "../validators/project.validator.js";

const router = express.Router();

router.post(
    "/create-project",
    verifyJWT,
    validate,
    createProjectValidator,
    createProject,
);
router.get("/get-projects", verifyJWT, getProjects);
router.get("/:projectId/get-project", verifyJWT, getProject);
router.put("/:projectId/update-project", verifyJWT, validate, updateProject);
router.delete("/:projectId/delete-project", verifyJWT, deleteProject);
router.get("/:projectId/get-members", verifyJWT, getMembers);
router.post(
    "/:projectId/add-member",
    verifyJWT,
    validate,
    addMemberValidator,
    addMember,
);
router.patch(
    "/:projectId/update-member-role/:memberId",
    verifyJWT,
    validate,
    updateMemberValidator,
    updateMemberRole,
);
router.delete(
    "/:projectId/remove-member/:memberId",
    verifyJWT,
    validate,
    deleteMember,
);

export default router;
