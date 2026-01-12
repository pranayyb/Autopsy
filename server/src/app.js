import express from "express";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import authRouter from "./routes/auth.routes.js";
import riskRouter from "./routes/risk.routes.js";
import insightRouter from "./routes/insight.routes.js";
import riskTimelineRouter from "./routes/riskTimeline.routes.js";
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
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/auth", authRouter);
app.use("/api/risks", riskRouter);
app.use("/api/insights", insightRouter);
app.use("/api/risks", riskTimelineRouter);

app.post("/", (req, res) => {
    res.send("Welcome to Autopsy!");
});

export default app;
