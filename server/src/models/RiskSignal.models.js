import mongoose from "mongoose";

const RiskSignalSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    },
    type: {
        type: String,
        enum: ["STAGNATION", "FAKE_PROGRESS", "STATUS_FLAPPING"],
        required: true,
    },
    severity: {
        type: Number, // 1–5
        required: true,
    },
    confidence: {
        type: Number, // 0–1
        default: 0.7,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "acknowledged", "resolved"],
        default: "open",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("RiskSignal", RiskSignalSchema);
