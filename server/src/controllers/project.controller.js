import Project from '../models/Project.model.js';

export const createProject = async (req, res) => {
  try {
    const { name, description, deadline } = req.body;

    const project = await Project.create({
      name,
      description,
      deadline,
      members: [req.user.id]
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
