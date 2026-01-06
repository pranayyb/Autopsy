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
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("RiskSignal", RiskSignalSchema);
