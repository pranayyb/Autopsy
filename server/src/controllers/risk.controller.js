import RiskSignal from "../models/RiskSignal.models.js";
import Task from "../models/Task.models.js";
import asyncHandler from "../utils/async-handler.js";

export const getRiskTimeline = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const { from, to } = req.query;

        const query = { project: projectId };

        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const risks = await RiskSignal.find(query)
            .sort({ createdAt: 1 })
            .select("type severity message createdAt task");

        res.json({
            projectId,
            totalEvents: risks.length,
            timeline: risks,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const getProjectRisks = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const { taskId, type } = req.query;

        const query = { project: projectId };
        if (taskId) query.task = taskId;
        if (type) query.type = type;

        const risks = await RiskSignal.find(query).sort({ createdAt: -1 });

        res.json({ totalRisks: risks.length, risks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const getTaskRisks = asyncHandler(async (req, res) => {
    try {
        const { taskId } = req.params;
        const risks = await RiskSignal.find({ task: taskId }).sort({
            createdAt: -1,
        });
        res.json({ totalRisks: risks.length, risks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const resolveRisk = asyncHandler(async (req, res) => {
    try {
        const { riskId } = req.params;
        const risk = await RiskSignal.findById(riskId);
        if (!risk) return res.status(404).json({ message: "Risk not found" });

        risk.status = "resolved";
        await risk.save();

        res.json({ message: "Risk resolved", risk });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const getTopRiskTasks = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const topN = parseInt(req.query.top || 5);

        const risks = await RiskSignal.find({
            project: projectId,
            status: "open",
        });

        const taskScores = {};
        risks.forEach((r) => {
            if (!r.task) return;
            taskScores[r.task] = (taskScores[r.task] || 0) + r.severity;
        });

        const sortedTasks = Object.entries(taskScores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, topN);

        const topTasks = [];
        for (const [taskId, score] of sortedTasks) {
            const task = await Task.findById(taskId);
            if (task) topTasks.push({ task, cumulativeRisk: score });
        }

        res.json({ topTasks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export const evaluateProjectRisk = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const risks = await RiskSignal.find({ project: projectId });
    if (!risks) {
        return res
            .status(404)
            .json({ message: "No risk signals found for this project" });
    }
    const totalTasks = (await Task.countDocuments({ project: projectId })) || 1;
    if (!totalTasks) {
        return res
            .status(404)
            .json({ message: "No tasks found for this project" });
    }
    const activeRisks = risks.filter((r) => r.status === "open");
    const typeWeights = {
        STAGNATION: 1.2,
        FAKE_PROGRESS: 1.5,
        STATUS_FLAPPING: 1.0,
        OVERDUE: 1.5,
    };

    let rawScore = activeRisks.reduce((sum, r) => {
        const weight = typeWeights[r.type] || 1;
        return sum + r.severity * weight;
    }, 0);

    let normalizedScore = rawScore / totalTasks;

    const projectHealthScore = Math.min(Math.round(normalizedScore * 20), 100);

    const typeBreakdown = activeRisks.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
    }, {});

    let insightMessage = "Project is healthy";
    if (projectHealthScore > 80) {
        insightMessage = "High risk of silent project failure!";
    } else if (projectHealthScore > 50) {
        insightMessage =
            "Project at moderate risk — monitor critical tasks closely.";
    } else if (projectHealthScore > 30) {
        insightMessage = "Minor risks detected — minor attention recommended.";
    }

    res.json({
        totalSignals: risks.length,
        activeSignals: activeRisks.length,
        projectHealthScore,
        typeBreakdown,
        insightMessage,
    });
});
