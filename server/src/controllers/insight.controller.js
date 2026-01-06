import Project from "../models/Project.model.js";
import RiskSignal from "../models/RiskSignal.model.js";
import { getOrGenerateInsight } from "../services/insightCache.service.js";

export const getProjectInsight = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const risks = await RiskSignal.find({
            project: project._id,
        });

        // const insight = await generateProjectInsight({
        //     projectName: project.name,
        //     risks,
        // });

        const insight = await getOrGenerateInsight({
            project,
            risks,
        });

        res.json({
            project: project.name,
            insight,
            signals: risks.length,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
