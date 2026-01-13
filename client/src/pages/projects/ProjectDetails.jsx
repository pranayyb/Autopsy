import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    projectsAPI,
    tasksAPI,
    risksAPI,
    insightsAPI,
} from "../../services/api";
import {
    ArrowLeft,
    Plus,
    Calendar,
    Users,
    AlertTriangle,
    Loader2,
    Edit,
    Trash2,
    CheckCircle2,
    Clock,
    MoreVertical,
    Lightbulb,
    RefreshCw,
    Mail,
    User,
    Shield,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [projectHealth, setProjectHealth] = useState(null);
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingInsight, setLoadingInsight] = useState(false);

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [showEditRoleModal, setShowEditRoleModal] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [openTaskMenu, setOpenTaskMenu] = useState(null);
    const [openMemberMenu, setOpenMemberMenu] = useState(null);

    const [taskForm, setTaskForm] = useState({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        assignees: [],
    });

    const [memberEmail, setMemberEmail] = useState("");

    // Helper to get user info from member or assignee
    const handleUserClick = (user, role = null) => {
        setSelectedUser({ ...user, role });
        setShowUserInfoModal(true);
    };

    const fetchProjectData = useCallback(async () => {
        try {
            const [projectRes, tasksRes, healthRes] = await Promise.all([
                projectsAPI.getOne(projectId),
                tasksAPI.getAll(projectId),
                risksAPI.getProjectHealth(projectId).catch(() => null),
            ]);

            setProject(projectRes.data.data);
            setTasks(tasksRes.data.data.tasks || []);
            if (healthRes) {
                setProjectHealth(healthRes.data.data);
            }
        } catch {
            toast.error("Failed to load project");
            navigate("/projects");
        } finally {
            setLoading(false);
        }
    }, [projectId, navigate]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const fetchInsight = async () => {
        setLoadingInsight(true);
        try {
            const response = await insightsAPI.getProjectInsight(projectId);
            setInsight(response.data.data);
        } catch {
            toast.error("Failed to generate insight");
        } finally {
            setLoadingInsight(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();

        if (!taskForm.title.trim()) {
            toast.error("Task title is required");
            return;
        }

        try {
            if (editingTask) {
                await tasksAPI.update(projectId, editingTask._id, taskForm);
                toast.success("Task updated successfully");
            } else {
                await tasksAPI.create(projectId, taskForm);
                toast.success("Task created successfully");
            }

            setShowTaskModal(false);
            setEditingTask(null);
            setTaskForm({
                title: "",
                description: "",
                priority: "Medium",
                dueDate: "",
                assignees: [],
            });
            fetchProjectData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save task");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            await tasksAPI.delete(projectId, taskId);
            toast.success("Task deleted successfully");
            fetchProjectData();
        } catch {
            toast.error("Failed to delete task");
        }
        setOpenTaskMenu(null);
    };

    const handleUpdateTaskStatus = async (taskId, status) => {
        try {
            await tasksAPI.updateStatus(projectId, taskId, status);
            toast.success("Status updated");
            fetchProjectData();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();

        if (!memberEmail.trim()) {
            toast.error("Email is required");
            return;
        }

        try {
            await projectsAPI.addMember(projectId, {
                memberEmail: memberEmail,
            });

            toast.success("Member added successfully");
            setMemberEmail("");
            setShowMemberModal(false);
            fetchProjectData();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to add member",
            );
        }
    };

    const handleUpdateMemberRole = async (memberId, newRole) => {
        try {
            await projectsAPI.updateMemberRole(projectId, memberId, newRole);
            toast.success("Role updated successfully");
            setShowEditRoleModal(false);
            setSelectedMember(null);
            fetchProjectData();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update role",
            );
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (
            !confirm(
                "Are you sure you want to remove this member from the project?",
            )
        )
            return;

        try {
            await projectsAPI.deleteMember(projectId, memberId);
            toast.success("Member removed successfully");
            setOpenMemberMenu(null);
            fetchProjectData();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to remove member",
            );
        }
    };

    const handleUpdateProjectStatus = async (newStatus) => {
        try {
            await projectsAPI.update(projectId, { status: newStatus });
            toast.success(`Project status updated to ${newStatus}`);
            setShowStatusMenu(false);
            fetchProjectData();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to update project status",
            );
        }
    };

    // Check if current user is admin
    const isCurrentUserAdmin =
        project?.members?.find(
            (m) => m.user?._id === project?.owner || m.role === "admin",
        )?.user?._id ===
        project?.members?.find((m) => m.role === "admin")?.user?._id;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Critical":
                return "text-red-400";
            case "High":
                return "text-orange-400";
            case "Medium":
                return "text-yellow-400";
            case "Low":
                return "text-green-400";
            default:
                return "text-gray-400";
        }
    };

    const getHealthColor = (score) => {
        if (score > 80) return "text-red-400";
        if (score > 50) return "text-yellow-400";
        return "text-green-400";
    };

    const tasksByStatus = {
        Todo: tasks.filter((t) => t.status === "Todo"),
        "In Progress": tasks.filter((t) => t.status === "In Progress"),
        Done: tasks.filter((t) => t.status === "Done"),
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/projects")}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">
                        {project.name}
                    </h1>
                    <p className="text-slate-400">
                        {project.description || "No description"}
                    </p>
                </div>

                {/* Project Status Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowStatusMenu(!showStatusMenu)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border ${
                            project.status === "completed"
                                ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                                : project.status === "active"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                                  : project.status === "archived"
                                    ? "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                        }`}
                    >
                        {project.status === "completed" ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : project.status === "active" ? (
                            <Clock className="w-4 h-4" />
                        ) : project.status === "archived" ? (
                            <AlertTriangle className="w-4 h-4" />
                        ) : (
                            <Clock className="w-4 h-4" />
                        )}
                        {project.status?.charAt(0).toUpperCase() +
                            project.status?.slice(1) || "Pending"}
                    </button>

                    {showStatusMenu && (
                        <div className="absolute right-0 top-12 z-20 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg py-1 min-w-[160px]">
                            {["pending", "active", "completed", "archived"].map(
                                (status) => (
                                    <button
                                        key={status}
                                        onClick={() =>
                                            handleUpdateProjectStatus(status)
                                        }
                                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${
                                            project.status === status
                                                ? "bg-slate-700/50 text-white"
                                                : "text-slate-300 hover:bg-slate-700/50"
                                        }`}
                                    >
                                        {status === "completed" ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        ) : status === "active" ? (
                                            <Clock className="w-4 h-4 text-blue-400" />
                                        ) : status === "archived" ? (
                                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-yellow-400" />
                                        )}
                                        {status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                        {project.status === status && (
                                            <CheckCircle2 className="w-4 h-4 text-purple-400 ml-auto" />
                                        )}
                                    </button>
                                ),
                            )}
                        </div>
                    )}
                </div>

                <Link
                    to={`/projects/${projectId}/edit`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all border border-slate-600/50"
                >
                    <Edit className="w-4 h-4" />
                    Edit
                </Link>
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Deadline</p>
                            <p className="text-white font-medium">
                                {project.deadline
                                    ? format(
                                          new Date(project.deadline),
                                          "MMM d, yyyy",
                                      )
                                    : "Not set"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Team</p>
                            <p className="text-white font-medium">
                                {project.members?.length || 1} members
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Progress</p>
                            <p className="text-white font-medium">
                                {tasksByStatus["Done"].length}/{tasks.length}{" "}
                                tasks done
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 card-hover">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                projectHealth?.projectHealthScore > 50
                                    ? "bg-red-500/20"
                                    : "bg-green-500/20"
                            }`}
                        >
                            <AlertTriangle
                                className={`w-5 h-5 ${getHealthColor(
                                    projectHealth?.projectHealthScore || 0,
                                )}`}
                            />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">
                                Health Score
                            </p>
                            <p
                                className={`font-medium ${getHealthColor(
                                    projectHealth?.projectHealthScore || 0,
                                )}`}
                            >
                                {projectHealth?.projectHealthScore ?? "N/A"}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            AI Insight
                        </h2>
                    </div>
                    <button
                        onClick={fetchInsight}
                        disabled={loadingInsight}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white text-sm rounded-xl transition-all border border-slate-600/50"
                    >
                        {loadingInsight ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        Generate
                    </button>
                </div>
                {insight ? (
                    <p className="text-slate-300">{insight.insight}</p>
                ) : (
                    <p className="text-slate-500">
                        Click "Generate" to get AI-powered insights about your
                        project.
                    </p>
                )}
            </div>

            {/* Task Board */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Tasks</h2>
                <button
                    onClick={() => {
                        setEditingTask(null);
                        setTaskForm({
                            title: "",
                            description: "",
                            priority: "Medium",
                            dueDate: "",
                            assignees: [],
                        });
                        setShowTaskModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                    <div
                        key={status}
                        className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/30"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-medium flex items-center gap-2">
                                <span
                                    className={`w-3 h-3 rounded-full ${
                                        status === "Todo"
                                            ? "bg-slate-500"
                                            : status === "In Progress"
                                              ? "bg-blue-500"
                                              : "bg-green-500"
                                    }`}
                                />
                                {status}
                            </h3>
                            <span className="text-slate-400 text-sm px-2 py-0.5 bg-slate-700/50 rounded-lg">
                                {statusTasks.length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {statusTasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/70 transition-all card-hover"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-white font-medium">
                                            {task.title}
                                        </h4>
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setOpenTaskMenu(
                                                        openTaskMenu ===
                                                            task._id
                                                            ? null
                                                            : task._id,
                                                    )
                                                }
                                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            {openTaskMenu === task._id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() =>
                                                            setOpenTaskMenu(
                                                                null,
                                                            )
                                                        }
                                                    />
                                                    <div className="absolute right-0 top-6 w-40 bg-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl z-20 py-1 border border-slate-600/50">
                                                        <button
                                                            onClick={() => {
                                                                setEditingTask(
                                                                    task,
                                                                );
                                                                setTaskForm({
                                                                    title: task.title,
                                                                    description:
                                                                        task.description ||
                                                                        "",
                                                                    priority:
                                                                        task.priority,
                                                                    dueDate:
                                                                        task.dueDate?.split(
                                                                            "T",
                                                                        )[0] ||
                                                                        "",
                                                                    assignees:
                                                                        task.assignees ||
                                                                        [],
                                                                });
                                                                setShowTaskModal(
                                                                    true,
                                                                );
                                                                setOpenTaskMenu(
                                                                    null,
                                                                );
                                                            }}
                                                            className="flex items-center gap-2 w-full px-3 py-2 text-slate-300 hover:bg-slate-600/50 transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteTask(
                                                                    task._id,
                                                                )
                                                            }
                                                            className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:bg-slate-600/50 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {task.description && (
                                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                                            {task.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-lg ${
                                                task.priority === "Critical"
                                                    ? "bg-red-500/20 text-red-400"
                                                    : task.priority === "High"
                                                      ? "bg-orange-500/20 text-orange-400"
                                                      : task.priority ===
                                                          "Medium"
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : "bg-green-500/20 text-green-400"
                                            }`}
                                        >
                                            {task.priority}
                                        </span>
                                        {task.dueDate && (
                                            <span className="text-slate-400 text-xs flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {format(
                                                    new Date(task.dueDate),
                                                    "MMM d",
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    {/* Assignees */}
                                    {task.assignees &&
                                        task.assignees.length > 0 && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Users className="w-3 h-3 text-slate-500" />
                                                <div className="flex -space-x-1">
                                                    {task.assignees
                                                        .slice(0, 4)
                                                        .map(
                                                            (assignee, idx) => (
                                                                <button
                                                                    key={
                                                                        assignee._id ||
                                                                        assignee ||
                                                                        idx
                                                                    }
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        handleUserClick(
                                                                            assignee,
                                                                        );
                                                                    }}
                                                                    className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-medium border-2 border-slate-800 hover:scale-110 transition-transform cursor-pointer"
                                                                    title={
                                                                        assignee.username ||
                                                                        "Assignee"
                                                                    }
                                                                >
                                                                    {assignee.username?.[0]?.toUpperCase() ||
                                                                        "U"}
                                                                </button>
                                                            ),
                                                        )}
                                                    {task.assignees.length >
                                                        4 && (
                                                        <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-[10px] font-medium border-2 border-slate-800">
                                                            +
                                                            {task.assignees
                                                                .length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-slate-500 text-xs">
                                                    {task.assignees.length}{" "}
                                                    assigned
                                                </span>
                                            </div>
                                        )}

                                    {/* Status change buttons */}
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50">
                                        {status !== "Todo" && (
                                            <button
                                                onClick={() =>
                                                    handleUpdateTaskStatus(
                                                        task._id,
                                                        "Todo",
                                                    )
                                                }
                                                className="flex-1 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors"
                                            >
                                                Todo
                                            </button>
                                        )}
                                        {status !== "In Progress" && (
                                            <button
                                                onClick={() =>
                                                    handleUpdateTaskStatus(
                                                        task._id,
                                                        "In Progress",
                                                    )
                                                }
                                                className="flex-1 py-1.5 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                                            >
                                                In Progress
                                            </button>
                                        )}
                                        {status !== "Done" && (
                                            <button
                                                onClick={() =>
                                                    handleUpdateTaskStatus(
                                                        task._id,
                                                        "Done",
                                                    )
                                                }
                                                className="flex-1 py-1.5 text-xs bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
                                            >
                                                Done
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {statusTasks.length === 0 && (
                                <div className="text-center py-8 text-slate-500 text-sm">
                                    No tasks
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Team Members */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-400" />
                        </div>
                        Team Members ({project.members?.length || 0})
                    </h2>
                    <button
                        onClick={() => setShowMemberModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white text-sm rounded-xl transition-all border border-slate-600/50"
                    >
                        <Plus className="w-4 h-4" />
                        Add Member
                    </button>
                </div>

                <div className="divide-y divide-slate-700/50">
                    {project.members?.map((member, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 py-3 px-2 hover:bg-slate-700/30 rounded-xl transition-colors relative"
                        >
                            <div
                                onClick={() =>
                                    handleUserClick(member.user, member.role)
                                }
                                className="flex items-center gap-4 flex-1 cursor-pointer"
                            >
                                {member.user?.avatar?.url ? (
                                    <img
                                        src={member.user.avatar.url}
                                        alt={member.user.username}
                                        className="w-10 h-10 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-sm font-medium">
                                        {member.user?.username?.[0]?.toUpperCase() ||
                                            "U"}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-white font-medium">
                                        {member.user?.fullName ||
                                            member.user?.username ||
                                            "User"}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        @{member.user?.username || "unknown"} •{" "}
                                        {member.user?.email || "No email"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        member.role === "admin"
                                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                            : member.role === "project_admin"
                                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                              : "bg-slate-600 text-slate-300"
                                    }`}
                                >
                                    {member.role === "admin"
                                        ? "Admin"
                                        : member.role === "project_admin"
                                          ? "Project Admin"
                                          : "Member"}
                                </span>

                                {/* Action menu for admins - can't modify self or the owner */}
                                {project.owner ===
                                    project.members?.find(
                                        (m) => m.role === "admin",
                                    )?.user?._id &&
                                    member.user?._id !== project.owner && (
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMemberMenu(
                                                        openMemberMenu ===
                                                            member.user?._id
                                                            ? null
                                                            : member.user?._id,
                                                    );
                                                }}
                                                className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                            </button>

                                            {openMemberMenu ===
                                                member.user?._id && (
                                                <div className="absolute right-0 top-8 z-20 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg py-1 min-w-[140px]">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedMember(
                                                                member,
                                                            );
                                                            setShowEditRoleModal(
                                                                true,
                                                            );
                                                            setOpenMemberMenu(
                                                                null,
                                                            );
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                        Edit Role
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveMember(
                                                                member.user
                                                                    ?._id,
                                                            );
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    ))}
                    {(!project.members || project.members.length === 0) && (
                        <div className="text-center py-8 text-slate-500">
                            No team members yet
                        </div>
                    )}
                </div>
            </div>

            {/* Task Modal */}
            <Modal
                isOpen={showTaskModal}
                onClose={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                }}
                title={editingTask ? "Edit Task" : "Create Task"}
            >
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={taskForm.title}
                            onChange={(e) =>
                                setTaskForm({
                                    ...taskForm,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                            placeholder="Task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={taskForm.description}
                            onChange={(e) =>
                                setTaskForm({
                                    ...taskForm,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none input-glow"
                            placeholder="Task description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Priority
                            </label>
                            <select
                                value={taskForm.priority}
                                onChange={(e) =>
                                    setTaskForm({
                                        ...taskForm,
                                        priority: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={taskForm.dueDate}
                                onChange={(e) =>
                                    setTaskForm({
                                        ...taskForm,
                                        dueDate: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                            />
                        </div>
                    </div>

                    {/* Assignees Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Assignees
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {project.members?.map((member) => (
                                <label
                                    key={member.user?._id || member.user}
                                    className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={taskForm.assignees.includes(
                                            member.user?._id || member.user,
                                        )}
                                        onChange={(e) => {
                                            const memberId =
                                                member.user?._id || member.user;
                                            if (e.target.checked) {
                                                setTaskForm({
                                                    ...taskForm,
                                                    assignees: [
                                                        ...taskForm.assignees,
                                                        memberId,
                                                    ],
                                                });
                                            } else {
                                                setTaskForm({
                                                    ...taskForm,
                                                    assignees:
                                                        taskForm.assignees.filter(
                                                            (id) =>
                                                                id !== memberId,
                                                        ),
                                                });
                                            }
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                                    />
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                                        {member.user?.username?.[0]?.toUpperCase() ||
                                            "U"}
                                    </div>
                                    <span className="text-white text-sm">
                                        {member.user?.username ||
                                            member.user?.email ||
                                            "User"}
                                    </span>
                                    <span className="text-slate-400 text-xs capitalize ml-auto">
                                        {member.role}
                                    </span>
                                </label>
                            ))}
                            {(!project.members ||
                                project.members.length === 0) && (
                                <p className="text-slate-500 text-sm">
                                    No team members available
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowTaskModal(false);
                                setEditingTask(null);
                            }}
                            className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all border border-slate-600/50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            {editingTask ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Member Modal */}
            <Modal
                isOpen={showMemberModal}
                onClose={() => setShowMemberModal(false)}
                title="Add Team Member"
                size="sm"
            >
                <form onSubmit={handleAddMember} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                            placeholder="member@example.com"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowMemberModal(false)}
                            className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all border border-slate-600/50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            Add Member
                        </button>
                    </div>
                </form>
            </Modal>

            {/* User Info Modal */}
            <Modal
                isOpen={showUserInfoModal}
                onClose={() => {
                    setShowUserInfoModal(false);
                    setSelectedUser(null);
                }}
                title="User Information"
                size="sm"
            >
                {selectedUser && (
                    <div className="space-y-6">
                        {/* User Avatar and Name */}
                        <div className="flex flex-col items-center text-center">
                            {selectedUser.avatar?.url ? (
                                <img
                                    src={selectedUser.avatar.url}
                                    alt={selectedUser.username}
                                    className="w-20 h-20 rounded-full object-cover mb-4"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    {selectedUser.username?.[0]?.toUpperCase() ||
                                        "U"}
                                </div>
                            )}
                            <h3 className="text-xl font-semibold text-white">
                                {selectedUser.fullName ||
                                    selectedUser.username ||
                                    "User"}
                            </h3>
                            <p className="text-slate-400">
                                @{selectedUser.username || "unknown"}
                            </p>
                        </div>

                        {/* User Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <div>
                                    <p className="text-slate-400 text-xs">
                                        Email
                                    </p>
                                    <p className="text-white">
                                        {selectedUser.email ||
                                            "No email available"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                                <User className="w-5 h-5 text-green-400" />
                                <div>
                                    <p className="text-slate-400 text-xs">
                                        Username
                                    </p>
                                    <p className="text-white">
                                        {selectedUser.username || "Unknown"}
                                    </p>
                                </div>
                            </div>

                            {selectedUser.role && (
                                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                    <div>
                                        <p className="text-slate-400 text-xs">
                                            Role in Project
                                        </p>
                                        <span
                                            className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                                                selectedUser.role === "admin"
                                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                    : selectedUser.role ===
                                                        "project_admin"
                                                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                      : "bg-slate-600 text-slate-300"
                                            }`}
                                        >
                                            {selectedUser.role === "admin"
                                                ? "Admin"
                                                : selectedUser.role ===
                                                    "project_admin"
                                                  ? "Project Admin"
                                                  : "Member"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowUserInfoModal(false);
                                setSelectedUser(null);
                            }}
                            className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all border border-slate-600/50"
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>

            {/* Edit Role Modal */}
            <Modal
                isOpen={showEditRoleModal}
                onClose={() => {
                    setShowEditRoleModal(false);
                    setSelectedMember(null);
                }}
                title="Edit Member Role"
                size="sm"
            >
                {selectedMember && (
                    <div className="space-y-6">
                        {/* Member Info */}
                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                            {selectedMember.user?.avatar?.url ? (
                                <img
                                    src={selectedMember.user.avatar.url}
                                    alt={selectedMember.user.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                    {selectedMember.user?.username?.[0]?.toUpperCase() ||
                                        "U"}
                                </div>
                            )}
                            <div>
                                <p className="text-white font-medium">
                                    {selectedMember.user?.fullName ||
                                        selectedMember.user?.username ||
                                        "User"}
                                </p>
                                <p className="text-slate-400 text-sm">
                                    @
                                    {selectedMember.user?.username || "unknown"}
                                </p>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-300">
                                Select Role
                            </label>
                            <div className="space-y-2">
                                {[
                                    {
                                        value: "admin",
                                        label: "Admin",
                                        desc: "Full project access and management",
                                    },
                                    {
                                        value: "project_admin",
                                        label: "Project Admin",
                                        desc: "Can manage tasks and members",
                                    },
                                    {
                                        value: "member",
                                        label: "Member",
                                        desc: "Can view and work on assigned tasks",
                                    },
                                ].map((role) => (
                                    <button
                                        key={role.value}
                                        onClick={() =>
                                            handleUpdateMemberRole(
                                                selectedMember.user?._id,
                                                role.value,
                                            )
                                        }
                                        className={`w-full p-3 text-left rounded-xl border transition-all ${
                                            selectedMember.role === role.value
                                                ? "border-purple-500 bg-purple-500/10"
                                                : "border-slate-600/50 hover:border-slate-500 hover:bg-slate-700/50"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p
                                                    className={`font-medium ${
                                                        selectedMember.role ===
                                                        role.value
                                                            ? "text-purple-400"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    {role.label}
                                                </p>
                                                <p className="text-sm text-slate-400">
                                                    {role.desc}
                                                </p>
                                            </div>
                                            {selectedMember.role ===
                                                role.value && (
                                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cancel Button */}
                        <button
                            onClick={() => {
                                setShowEditRoleModal(false);
                                setSelectedMember(null);
                            }}
                            className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all border border-slate-600/50"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProjectDetails;
