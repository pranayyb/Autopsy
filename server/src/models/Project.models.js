import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                role: {
                    type: String,
                    enum: ["admin", "project_admin", "member"],
                    default: "member",
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
                _id: false,
            },
        ],
        status: {
            type: String,
            enum: ["pending", "active", "completed", "archived"],
            default: "pending",
        },
        deadline: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Project", ProjectSchema);
