import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { projectsAPI } from "../../services/api";
import {
    Plus,
    Search,
    Filter,
    FolderKanban,
    Calendar,
    Users,
    MoreVertical,
    Loader2,
    Trash2,
    Edit,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [openMenu, setOpenMenu] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data.data.projects || []);
        } catch {
            toast.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await projectsAPI.delete(projectId);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch {
            toast.error("Failed to delete project");
        }
        setOpenMenu(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-500/20 text-green-400 border-green-500/30";
            case "completed":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "pending":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "archived":
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <p className="text-slate-400 mt-1">
                        Manage and organize your projects
                    </p>
                </div>
                <Link
                    to="/projects/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    New Project
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-slate-400 w-5 h-5" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                    <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                        {searchQuery || statusFilter !== "all"
                            ? "No projects found"
                            : "No projects yet"}
                    </h3>
                    <p className="text-slate-400 mb-4">
                        {searchQuery || statusFilter !== "all"
                            ? "Try adjusting your filters"
                            : "Create your first project to get started"}
                    </p>
                    {!searchQuery && statusFilter === "all" && (
                        <Link
                            to="/projects/new"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Create Project
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProjects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/70 transition-all card-hover overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <FolderKanban className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <Link
                                                to={`/projects/${project._id}`}
                                                className="text-white font-semibold hover:text-blue-400 transition-colors"
                                            >
                                                {project.name}
                                            </Link>
                                            <span
                                                className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                                                    project.status,
                                                )}`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenu(
                                                    openMenu === project._id
                                                        ? null
                                                        : project._id,
                                                )
                                            }
                                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                        {openMenu === project._id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() =>
                                                        setOpenMenu(null)
                                                    }
                                                />
                                                <div className="absolute right-0 top-8 w-40 bg-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl z-20 py-1 border border-slate-600/50">
                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                `/projects/${project._id}/edit`,
                                                            );
                                                            setOpenMenu(null);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteProject(
                                                                project._id,
                                                            )
                                                        }
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:bg-gray-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {project.description || "No description"}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {project.deadline
                                                ? format(
                                                      new Date(
                                                          project.deadline,
                                                      ),
                                                      "MMM d, yyyy",
                                                  )
                                                : "No deadline"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Users className="w-4 h-4" />
                                        <span>
                                            {project.members?.length || 1}{" "}
                                            members
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to={`/projects/${project._id}`}
                                className="block px-5 py-3 bg-gray-700/50 text-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                                View Project
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;
