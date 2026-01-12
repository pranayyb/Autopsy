import Project from "../models/Project.models.js";
import RiskSignal from "../models/RiskSignal.models.js";
import { getOrGenerateInsight } from "../services/insight.service.js";
import { ApiResponse } from "../utils/api-response.js";

export const getProjectInsight = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json(new ApiResponse(404, null, "Project not found"));
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

        res.status(200).json(new ApiResponse(200, {
            project: project.name,
            insight,
            signals: risks.length,
        }, "Project insight generated successfully"));
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, err.message));
    }
};
