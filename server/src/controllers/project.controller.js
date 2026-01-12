import Project from "../models/Project.models.js";
import asyncHandler from "../utils/async-handler.js";

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
                role: "admin",
            },
        ],
    });

    res.status(201).json(project);
});

export const getProjects = asyncHandler(async (req, res) => {
    try {
        const projects = await Project.find({
            "members.user": req.user._id,
        });

        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const getProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            "members.user": req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
                        role: { $in: ["admin", "editor"] },
                    },
                },
            },
            { name, description, deadline, status },
            { new: true },
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
                    role: "admin",
                },
            },
        });

        if (!project) {
            return res.status(403).json({
                message: "Only admins can delete this project",
            });
        }

        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const getMembers = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({
            _id: projectId,
            members: req.user._id,
        }).populate("members.user", "username email");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({
            members: project.members,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const addMember = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const { memberId } = req.body;

        const project = await Project.findOneAndUpdate(
            {
                _id: projectId,
                members: {
                    $elemMatch: {
                        user: req.user._id,
                        role: "admin",
                    },
                },
            },
            {
                $addToSet: {
                    members: {
                        user: memberId,
                        role: "viewer",
                    },
                },
            },
            { new: true },
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        return res.status(404).json({ message: "Project not found" });
    }

    if (memberId === req.user._id.toString()) {
        return res.status(400).json({
            message: "You cannot change your own role",
        });
    }

    const requester = project.members.find(
        (m) => m.user.toString() === req.user._id.toString(),
    );

    if (!requester || requester.role !== "admin") {
        return res.status(403).json({
            message: "Only admins can change member roles",
        });
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
        return res.status(404).json({ message: "Member not found" });
    }

    res.json(updatedProject);
});

export const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params;

    const project = await Project.findOne({
        _id: projectId,
        "members.user": req.user._id,
    });

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    if (memberId === req.user._id.toString()) {
        return res.status(400).json({
            message: "You cannot remove yourself from the project",
        });
    }

    const requester = project.members.find(
        (m) => m.user.toString() === req.user._id.toString(),
    );

    if (!requester || requester.role !== "admin") {
        return res.status(403).json({
            message: "Only admins can remove members",
        });
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

    res.json(updatedProject);
});
