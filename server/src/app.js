import express from "express";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import riskRoutes from "./routes/risk.routes.js";
import insightRoutes from "./routes/insight.routes.js";
import riskTimelineRoutes from "./routes/riskTimeline.routes.js";
import cors from "cors";
import { healthCheck } from "./controllers/healthCheck.controller.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type"],
    }),
);
app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", healthCheck);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/risks", riskRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/risks", riskTimelineRoutes);

app.post("/", (req, res) => {
    res.send("Welcome to Autopsy!");
});

export default app;
