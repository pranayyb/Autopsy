import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    Mail,
    Lock,
    User,
    Loader2,
    UserCircle,
    Sparkles,
    ArrowRight,
} from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const result = await register({
            fullName: formData.fullName,
            username: formData.username.toLowerCase(),
            email: formData.email,
            password: formData.password,
        });

        if (result.success) {
            navigate("/login");
        }

        setLoading(false);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-slate-900">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
                {/* Circle pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L2c+PC9zdmc+')] opacity-40"></div>
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/50"></div>

                <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
                    {/* Logo */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 animate-float">
                            <span className="text-white font-bold text-2xl">
                                A
                            </span>
                        </div>
                        <span className="text-3xl font-bold text-white">
                            Autopsy
                        </span>
                    </div>

                    {/* Tagline */}
                    <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                        Start Your
                        <span className="block mt-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Journey Today
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg xl:text-xl max-w-md mb-12 leading-relaxed">
                        Join thousands of teams who trust Autopsy for
                        intelligent project management and risk detection.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        {[
                            "Team Collaboration",
                            "Smart Analytics",
                            "AI-Powered Insights",
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 text-slate-300"
                            >
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                </div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Right Panel - Branding */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-6 bg-slate-900 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-xl">
                                A
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Autopsy
                        </span>
                    </div>

                    {/* Form Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Sign Up
                        </h2>
                        <p className="text-slate-400">
                            Join us and start managing your projects
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-slate-300 mb-2"
                                >
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all input-glow"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-slate-300 mb-2"
                                >
                                    Username
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all input-glow"
                                        placeholder="Choose a username"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1.5 text-sm text-red-400">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-300 mb-2"
                                >
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all input-glow"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-300 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all input-glow"
                                        placeholder="Create a password"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                                <p className="mt-1.5 text-xs text-slate-500">
                                    Must be at least 8 characters
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-slate-300 mb-2"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all input-glow"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1.5 text-sm text-red-400">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all btn-glow shadow-lg shadow-purple-500/25"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-slate-900 text-slate-500">
                                    or
                                </span>
                            </div>
                        </div>

                        <p className="text-center text-slate-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
