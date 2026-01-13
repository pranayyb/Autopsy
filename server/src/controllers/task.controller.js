import Task from "../models/Task.models.js";
import { evaluateTaskRisk } from "../services/taskRiskEvaluator.js";
import Project from "../models/Project.models.js";
import asyncHandler from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

export const createTask = asyncHandler(async (req, res) => {
    try {
        const { title, description, assignees, priority, dueDate } = req.body;
        const { id: projectId } = req.params;
        const userId = req.user._id;
        const project = await Project.findById(projectId);

        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }
        const member = project.members.find(
            (m) => m.user.toString() === userId.toString(),
        );
        if (!member || member.role !== "admin") {
            return res
                .status(403)
                .json(
                    new ApiResponse(403, null, "Only admins can create tasks"),
                );
        }
        const task = await Task.create({
            project: projectId,
            title,
            description,
            assignees,
            status: "Todo",
            priority,
            dueDate,
            owner: userId,
        });
        res.status(201).json(
            new ApiResponse(201, task, "Task created successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.user._id;
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Task not found"));
        }

        const project = await Project.findById(task.project);
        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        const isMember = project.members.some(
            (m) => m.user.toString() === userId.toString(),
        );

        if (!isMember) {
            return res
                .status(403)
                .json(
                    new ApiResponse(
                        403,
                        null,
                        "Non-members cannot update task status",
                    ),
                );
        }

        if (task.status !== status) {
            task.statusChanges += 1;
            task.status = status;
            task.updatedAt = new Date();
        }
        task.lastActivityAt = new Date();

        await task.save();
        await evaluateTaskRisk(task);

        res.status(200).json(
            new ApiResponse(200, task, "Task status updated successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const getTasks = asyncHandler(async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const userId = req.user._id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        const isMember = project.members.some(
            (m) => m.user.toString() === userId.toString(),
        );

        if (!isMember) {
            return res
                .status(403)
                .json(
                    new ApiResponse(
                        403,
                        null,
                        "Non-members cannot access tasks",
                    ),
                );
        }

        const tasks = await Task.find({ project: projectId })
            .populate("assignees", "username email fullName avatar")
            .populate("owner", "username email fullName avatar");
        res.status(200).json(
            new ApiResponse(200, { tasks }, "Tasks fetched successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const getTaskDetails = asyncHandler(async (req, res) => {
    try {
        const { id: projectId, taskId } = req.params;
        const userId = req.user._id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        const isMember = project.members.some(
            (m) => m.user.toString() === userId.toString(),
        );

        if (!isMember) {
            return res
                .status(403)
                .json(
                    new ApiResponse(
                        403,
                        null,
                        "Non-members cannot access task details",
                    ),
                );
        }

        const task = await Task.findById(taskId);
        if (!task || task.project.toString() !== projectId.toString()) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Task not found in project"));
        }

        res.status(200).json(
            new ApiResponse(200, task, "Task details fetched successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const updateTask = asyncHandler(async (req, res) => {
    try {
        const { id: projectId, taskId } = req.params;
        const { title, description, assignees, priority, dueDate } = req.body;
        const userId = req.user._id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        const member = project.members.find(
            (m) => m.user.toString() === userId.toString(),
        );
        if (!member || member.role !== "admin") {
            return res
                .status(403)
                .json(
                    new ApiResponse(403, null, "Only admins can update tasks"),
                );
        }

        const task = await Task.findById(taskId);
        if (!task || task.project.toString() !== projectId.toString()) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Task not found in project"));
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.assignees = assignees || task.assignees;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.updatedAt = new Date();
        task.lastActivityAt = new Date();

        await task.save();
        await evaluateTaskRisk(task);
        res.status(200).json(
            new ApiResponse(200, task, "Task updated successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});

export const deleteTask = asyncHandler(async (req, res) => {
    try {
        const { id: projectId, taskId } = req.params;
        const userId = req.user._id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Project not found"));
        }

        const member = project.members.find(
            (m) => m.user.toString() === userId.toString(),
        );
        if (!member || member.role !== "admin") {
            return res
                .status(403)
                .json(
                    new ApiResponse(403, null, "Only admins can delete tasks"),
                );
        }

        const task = await Task.findOneAndDelete({ _id: taskId });
        if (!task || task.project.toString() !== projectId.toString()) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Task not found in project"));
        }

        res.status(200).json(
            new ApiResponse(200, null, "Task deleted successfully"),
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
});
