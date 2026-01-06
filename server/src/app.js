import express from "express";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok hai bhai sabh!" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
