import RiskSignal from '../models/RiskSignal.model.js';

export const getRiskTimeline = async (req, res) => {
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
      .select('type severity message createdAt task');

    res.json({
      projectId,
      totalEvents: risks.length,
      timeline: risks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
