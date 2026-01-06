import "dotenv/config";
import "../config/db.js";

import Project from "../models/Project.model.js";
import Task from "../models/Task.model.js";
import mongoose from "mongoose";

const test = async () => {
    const project = await Project.create({
        name: "Test Project",
        description: "Testing ES module models",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        members: [],
    });

    const task = await Task.create({
        project: project._id,
        title: "Initial Setup",
        description: "Set up backend",
        owner: new mongoose.Types.ObjectId(),
    });

    console.log("Project saved:", project._id);
    console.log("Task saved:", task._id);

    process.exit();
};

test();
