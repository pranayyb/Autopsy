import RiskSignal from "../models/RiskSignal.models.js";
import InsightCache from "../models/InsightCache.models.js";
import Task from "../models/Task.models.js";

export const evaluateTaskRisk = async (task) => {
    const now = new Date();

    const daysSinceUpdate = (now - task.updatedAt) / (1000 * 60 * 60 * 24);
    const daysOverdue = task.dueDate
        ? (now - task.dueDate) / (1000 * 60 * 60 * 24)
        : 0;

    const ownerTasks = await Task.countDocuments({
        owner: task.owner,
        status: { $ne: "Done" },
    });
    const loadMultiplier = ownerTasks > 5 ? 1.2 : 1;

    if (task.status !== "Done" && daysSinceUpdate > 3) {
        const existing = await RiskSignal.findOne({
            task: task._id,
            type: "STAGNATION",
            status: "open",
        });

        if (!existing) {
            let severity = task.priority === "Critical" ? 4 : 3;
            severity += Math.floor(daysSinceUpdate / 2);
            severity *= loadMultiplier;
            severity = Math.min(5, severity);

            await RiskSignal.create({
                project: task.project,
                task: task._id,
                type: "STAGNATION",
                severity,
                message: `Task "${
                    task.title
                }" has not been updated for ${daysSinceUpdate.toFixed(1)} days`,
            });

            await InsightCache.findOneAndDelete({ project: task.project });
        }
    }

    if (task.statusChanges >= 3) {
        const existing = await RiskSignal.findOne({
            task: task._id,
            type: "STATUS_FLAPPING",
            status: "open",
        });

        if (!existing) {
            let severity = task.priority === "Critical" ? 5 : 4;
            severity *= loadMultiplier;
            severity = Math.min(5, severity);

            await RiskSignal.create({
                project: task.project,
                task: task._id,
                type: "STATUS_FLAPPING",
                severity,
                message: `Task "${task.title}" status changed too frequently (${task.statusChanges} times)`,
            });

            await InsightCache.findOneAndDelete({ project: task.project });
        }
    }

    if (task.dueDate && daysOverdue > 0 && task.status !== "Done") {
        const existing = await RiskSignal.findOne({
            task: task._id,
            type: "OVERDUE",
            status: "open",
        });

        if (!existing) {
            let severity = Math.min(5, 3 + Math.floor(daysOverdue / 2));
            severity *= loadMultiplier;

            await RiskSignal.create({
                project: task.project,
                task: task._id,
                type: "OVERDUE",
                severity,
                message: `Task "${
                    task.title
                }" is overdue by ${daysOverdue.toFixed(1)} days`,
            });

            await InsightCache.findOneAndDelete({ project: task.project });
        }
    }

    const openRisks = await RiskSignal.find({
        task: task._id,
        status: "open",
    });
    if (openRisks.length > 1) {
        // boost severity of all existing open risks
        for (const risk of openRisks) {
            const newSeverity = Math.min(
                5,
                risk.severity + openRisks.length - 1,
            );
            if (newSeverity !== risk.severity) {
                risk.severity = newSeverity;
                await risk.save();
            }
        }
    }
};
