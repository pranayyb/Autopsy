import groq from "../config/groq.js";
import { projectRiskPrompt } from "../prompts/projectRisk.prompt.js";

export const generateProjectInsight = async ({ projectName, risks }) => {
    if (risks.length === 0) {
        return "Project is healthy. No significant execution risks detected.";
    }

    const prompt = projectRiskPrompt({
        projectName,
        risks,
    });

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
    });

    if (!completion || !completion.choices) {
        throw new Error("Invalid Groq response");
    }
    // console.log("LLM Completion:", completion);

    return completion.choices[0].message.content;
};
