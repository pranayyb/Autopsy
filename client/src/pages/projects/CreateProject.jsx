import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectsAPI } from "../../services/api";
import { ArrowLeft, Loader2, Calendar, FolderPlus } from "lucide-react";
import toast from "react-hot-toast";

const CreateProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        deadline: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Project name is required");
            return;
        }

        if (!formData.deadline) {
            toast.error("Project deadline is required");
            return;
        }

        setLoading(true);

        try {
            const response = await projectsAPI.create({
                name: formData.name.trim(),
                description: formData.description.trim(),
                deadline: formData.deadline,
            });

            toast.success("Project created successfully");
            navigate(`/projects/${response.data.data._id}`);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create project",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <FolderPlus className="w-5 h-5 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Create New Project
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-300 mb-2"
                        >
                            Project Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                            placeholder="Enter project name"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-slate-300 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none input-glow"
                            placeholder="Describe your project..."
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="deadline"
                            className="block text-sm font-medium text-slate-300 mb-2"
                        >
                            Deadline <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                id="deadline"
                                name="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all border border-slate-600/50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-600/50 disabled:to-blue-700/50 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;
