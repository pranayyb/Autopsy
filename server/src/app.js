import express from "express";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import authRouter from "./routes/auth.routes.js";
import riskRouter from "./routes/risk.routes.js";
import insightRouter from "./routes/insight.routes.js";
import cors from "cors";
import { healthCheck } from "./controllers/healthCheck.controller.js";
import { ApiResponse } from "./utils/api-response.js";
import connectDB from "./config/db.js";

const app = express();

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Database connection failed:", err);
        res.status(500).json(
            new ApiResponse(500, null, "Database connection failed"),
        );
    }
});

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", healthCheck);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/auth", authRouter);
app.use("/api/risks", riskRouter);
app.use("/api/insights", insightRouter);

app.get("/", (req, res) => {
    res.status(200).json(new ApiResponse(200, {}, "Welcome to Autopsy!"));
});

export default app;
