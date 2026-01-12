import RiskSignal from "../models/RiskSignal.models.js";

export const getProjectRisk = async (req, res) => {
    try {
        const risks = await RiskSignal.find({
            project: req.params.projectId,
        });

        const score = risks.reduce((sum, r) => sum + r.severity, 0);

        res.json({
            totalSignals: risks.length,
            riskScore: score,
            risks,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
