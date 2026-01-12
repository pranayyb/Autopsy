import Insight from "../models/Insight.models.js";
import { generateProjectInsight } from "./llm.service.js";

export const getOrGenerateInsight = async ({ project, risks }) => {
    const riskCount = risks.length;

    const cached = await Insight.findOne({
        project: project._id,
    });

    // USE CACHE
    if (
        cached &&
        cached.lastRiskCount === riskCount &&
        Date.now() - cached.generatedAt.getTime() < 1000 * 60 * 10
    ) {
        return cached.insight;
    }

    // GENERATE NEW
    const insight = await generateProjectInsight({
        projectName: project.name,
        risks,
    });

    // UPSERT CACHE
    await Insight.findOneAndUpdate(
        { project: project._id },
        {
            insight,
            lastRiskCount: riskCount,
            generatedAt: new Date(),
        },
        { upsert: true },
    );

    return insight;
};
