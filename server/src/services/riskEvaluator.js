import RiskSignal from "../models/RiskSignal.model.js";

export const evaluateTaskRisk = async (task) => {
    const now = new Date();
    const daysSinceUpdate = (now - task.updatedAt) / (1000 * 60 * 60 * 24);

    // STAGNATION
    if (task.status !== "Done" && daysSinceUpdate > 3) {
        await RiskSignal.create({
            project: task.project,
            task: task._id,
            type: "STAGNATION",
            severity: 3,
            message: "Task has not been updated for more than 3 days",
        });
    }

    // STATUS FLAPPING
    if (task.statusChanges >= 3) {
        await RiskSignal.create({
            project: task.project,
            task: task._id,
            type: "STATUS_FLAPPING",
            severity: 4,
            message: "Task status changed too frequently",
        });
    }
};
