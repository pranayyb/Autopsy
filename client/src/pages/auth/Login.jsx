import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Loader2, Sparkles, ArrowRight } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate("/dashboard");
        }

        setLoading(false);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-slate-900">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
                {/* Circle pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L2c+PC9zdmc+')] opacity-40"></div>

                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/50"></div>

                <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
                    {/* Logo */}
                    <div className="flex items-center gap-4 mb-12">
                        <img
                            src="/skull.svg"
                            alt="Autopsy"
                            className="w-14 h-14 animate-float drop-shadow-lg"
                        />
                        <span className="text-3xl font-bold text-white">
                            Autopsy
                        </span>
                    </div>

                    {/* Tagline */}
                    <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                        Manage Projects
                        <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            with Confidence
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg xl:text-xl max-w-md mb-12 leading-relaxed">
                        AI-powered project management that helps you identify
                        risks, track progress, and deliver on time.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        {[
                            "AI Risk Detection",
                            "Real-time Collaboration",
                            "Smart Insights",
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 text-slate-300"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                </div>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 bg-slate-900 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <img
                            src="/skull.svg"
                            alt="Autopsy"
                            className="w-12 h-12 drop-shadow-lg"
                        />
                        <span className="text-2xl font-bold text-white">
                            Autopsy
                        </span>
                    </div>

                    {/* Form Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Welcome back
                        </h2>
                        <p className="text-slate-400">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
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
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                                />
                                <span className="text-sm text-slate-400">
                                    Remember me
                                </span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all btn-glow shadow-lg shadow-blue-500/25"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
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
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Create account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
