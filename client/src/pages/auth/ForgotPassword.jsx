import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Loader2, ArrowLeft, KeyRound } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await forgotPassword(email);

        if (result.success) {
            setSent(true);
        }

        setLoading(false);
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
                        <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-slate-400 mb-6">
                            We've sent a password reset link to{" "}
                            <strong className="text-white">{email}</strong>
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-pattern opacity-5"></div>
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-slate-400">
                        No worries, we'll send you reset instructions
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-300 mb-2"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-600/50 disabled:to-blue-700/50 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 btn-glow"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>

                    <Link
                        to="/login"
                        className="flex items-center justify-center text-slate-400 hover:text-slate-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign In
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
