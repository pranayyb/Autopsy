import { useEffect, useState } from "react";
import { getProjects } from "../api/project.api";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data));
  }, []);

  return (
    <>
      <h2>Your Projects</h2>
      {projects.map((p) => (
        <Link key={p._id} to={`/projects/${p._id}`}>
          <div>{p.name}</div>
        </Link>
      ))}
    </>
  );
}
