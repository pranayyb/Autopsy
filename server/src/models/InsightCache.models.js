import mongoose from "mongoose";

const InsightCacheSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        unique: true,
        required: true,
    },
    insight: {
        type: String,
        required: true,
    },
    lastRiskCount: {
        type: Number,
        required: true,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("InsightCache", InsightCacheSchema);
