import Project from "../models/Project.models.js";
import { User } from "../models/User.models.js";
import asyncHandler from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserRolesEnum } from "../utils/constants.js";

export const createProject = asyncHandler(async (req, res) => {
    const { name, description, deadline } = req.body;

    const project = await Project.create({
        name,
        description,
        owner: req.user._id,
        deadline,
        members: [
            {
                user: req.user._id,
                role: UserRolesEnum.ADMIN,
            },
        ],
    });

    res.status(201).json(
        new ApiResponse(201, project, "Project created successfully"),
    );
});

export const getProjects = asyncHandler(async (req, res) => {
    try {
        const projects = await Project.find({
            "members.user": req.user._id,
        });

        res.status(200).json(
            new ApiResponse(200, { projects }, "Projects fetched successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const getProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            "members.user": req.user._id,
        }).populate("members.user", "username email fullName avatar");

        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        res.status(200).json(
            new ApiResponse(200, project, "Project fetched successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const updateProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description, deadline, status } = req.body;

        const project = await Project.findOneAndUpdate(
            {
                _id: projectId,
                members: {
                    $elemMatch: {
                        user: req.user._id,
                        role: { $in: [UserRolesEnum.ADMIN, "editor"] },
                    },
                },
            },
            { name, description, deadline, status },
            { new: true },
        );

        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        res.status(200).json(
            new ApiResponse(200, project, "Project updated successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const deleteProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOneAndDelete({
            _id: projectId,
            members: {
                $elemMatch: {
                    user: req.user._id,
                    role: UserRolesEnum.ADMIN,
                },
            },
        });

        if (!project) {
            return res
                .status(403)
                .json(
                    new ApiResponse(
                        403,
                        null,
                        "Only admins can delete this project",
                    ),
                );
        }

        res.status(200).json(
            new ApiResponse(200, null, "Project deleted successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const getMembers = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            "members.user": req.user._id,
        }).populate("members.user", "username email fullName avatar");

        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        res.status(200).json(
            new ApiResponse(
                200,
                { members: project.members },
                "Members fetched successfully",
            ),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const addMember = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        let { memberEmail } = req.body;
        memberEmail = memberEmail?.trim().toLowerCase();

        if (!memberEmail) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Member email is required"));
        }

        const member = await User.findOne({ email: memberEmail });

        if (!member) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "User not found"));
        }

        const memberId = member._id;

        const project = await Project.findOneAndUpdate(
            {
                _id: projectId,
                members: {
                    $elemMatch: {
                        user: req.user._id,
                        role: UserRolesEnum.ADMIN,
                    },
                },
            },
            {
                $addToSet: {
                    members: {
                        user: memberId,
                        role: UserRolesEnum.MEMBER,
                    },
                },
            },
            { new: true },
        );

        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        res.status(200).json(
            new ApiResponse(200, project, "Member added successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params;
    const { role } = req.body;

    const project = await Project.findOne({
        _id: projectId,
        "members.user": req.user._id,
    });

    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    if (memberId === req.user._id.toString()) {
        return res
            .status(400)
            .json(
                new ApiResponse(400, null, "You cannot change your own role"),
            );
    }

    const requester = project.members.find(
        (m) => m.user.toString() === req.user._id.toString(),
    );

    if (!requester || requester.role !== UserRolesEnum.ADMIN) {
        return res
            .status(403)
            .json(
                new ApiResponse(
                    403,
                    null,
                    "Only admins can change member roles",
                ),
            );
    }

    const updatedProject = await Project.findOneAndUpdate(
        {
            _id: projectId,
            "members.user": memberId,
        },
        {
            $set: {
                "members.$.role": role,
            },
        },
        { new: true },
    );

    if (!updatedProject) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Member not found"));
    }

    res.status(200).json(
        new ApiResponse(
            200,
            updatedProject,
            "Member role updated successfully",
        ),
    );
});

export const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params;

    const project = await Project.findOne({
        _id: projectId,
        "members.user": req.user._id,
    });

    if (!project) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Project not found"));
    }

    if (memberId === req.user._id.toString()) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "You cannot remove yourself from the project",
                ),
            );
    }

    const requester = project.members.find(
        (m) => m.user.toString() === req.user._id.toString(),
    );

    if (!requester || requester.role !== UserRolesEnum.ADMIN) {
        return res
            .status(403)
            .json(new ApiResponse(403, null, "Only admins can remove members"));
    }

    const updatedProject = await Project.findOneAndUpdate(
        {
            _id: projectId,
        },
        {
            $pull: {
                members: { user: memberId },
            },
        },
        { new: true },
    );

    res.status(200).json(
        new ApiResponse(200, updatedProject, "Member removed successfully"),
    );
});
