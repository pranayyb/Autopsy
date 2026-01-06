import InsightCache from "../models/InsightCache.model.js";
import { generateProjectInsight } from "./llm.service.js";

export const getOrGenerateInsight = async ({ project, risks }) => {
    const riskCount = risks.length;

    const cached = await InsightCache.findOne({
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
    await InsightCache.findOneAndUpdate(
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
