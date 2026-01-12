import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    status: {
        type: String,
        enum: ["Todo", "In Progress", "Done"],
        default: "Todo",
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium",
    },
    dueDate: {
        type: Date,
    },
    statusChanges: {
        type: Number,
        default: 0,
    },
    lastActivityAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Task", TaskSchema);
