export const projectRiskPrompt = ({ projectName, risks = [] }) => {
    return `
            You are an expert engineering project auditor.

            Project: ${projectName}

            Detected risk signals:
            ${
                risks.length === 0
                    ? "- No risks detected"
                    : risks
                          .map(
                              (r) =>
                                  `- ${r.type}: ${r.message} (severity ${r.severity})`,
                          )
                          .join("\n")
            }

            Tasks:
            1. Summarize the overall project health in 2–3 sentences.
            2. Explain the root causes of risk.
            3. Suggest 3 concrete corrective actions.

            Rules:
            - Be direct
            - No motivational fluff
            - Focus on execution and decision quality
            `;
};
