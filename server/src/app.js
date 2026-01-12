import express from "express";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import authRouter from "./routes/auth.routes.js";
import riskRouter from "./routes/risk.routes.js";
import insightRouter from "./routes/insight.routes.js";
import cors from "cors";
import { healthCheck } from "./controllers/healthCheck.controller.js";
import { ApiResponse } from "./utils/api-response.js";

const app = express();

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN === "*" 
    ? "*" 
    : process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"];

app.use(
    cors({
        origin: corsOrigin,
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

app.get("/", (req, res) => {
    res.status(200).json(new ApiResponse(200, {}, "Welcome to Autopsy!"));
});

export default app;
