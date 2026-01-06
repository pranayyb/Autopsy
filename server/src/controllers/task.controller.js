import Task from "../models/Task.model.js";

export const createTask = async (req, res) => {
    try {
        const { projectId, title, description } = req.body;

        const task = await Task.create({
            project: projectId,
            title,
            description,
            owner: req.user._id,
        });

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.statusChanges += task.status !== status ? 1 : 0;
        task.status = status;
        task.updatedAt = new Date();

        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
