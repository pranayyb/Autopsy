import express from "express";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import riskRoutes from "./routes/risk.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok hai bhai sabh!" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/risks", riskRoutes);

export default app;
