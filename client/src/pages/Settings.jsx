import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Lock, Loader2, Save, Mail } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const Settings = () => {
    const { user, changePassword, resendVerificationEmail, checkAuth } =
        useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get("verified") === "true") {
            toast.success("Email verified successfully!");
            checkAuth(); // Refresh user data
            setSearchParams({}); // Clear the query param
        }
    }, [searchParams, setSearchParams, checkAuth]);

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        const result = await changePassword(
            passwordForm.oldPassword,
            passwordForm.newPassword,
        );

        if (result.success) {
            setPasswordForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }

        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-slate-400 mt-1">
                    Manage your account settings
                </p>
            </div>

            {/* Profile Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                        Profile
                    </h2>
                </div>

                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-3xl font-bold text-white">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-white">
                            {user?.username}
                        </h3>
                        <p className="text-slate-400">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-slate-700/30 rounded-xl p-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Username
                        </label>
                        <p className="text-white font-medium">
                            {user?.username}
                        </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Email
                        </label>
                        <p className="text-white font-medium">{user?.email}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Email Verified
                        </label>
                        <div className="flex items-center gap-3">
                            <p
                                className={`font-medium ${user?.isEmailVerified ? "text-green-400" : "text-yellow-400"}`}
                            >
                                {user?.isEmailVerified
                                    ? "✓ Verified"
                                    : "○ Not verified"}
                            </p>
                            {!user?.isEmailVerified && (
                                <button
                                    onClick={async () => {
                                        setVerifyLoading(true);
                                        await resendVerificationEmail();
                                        setVerifyLoading(false);
                                    }}
                                    disabled={verifyLoading}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {verifyLoading ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Mail className="w-3 h-3" />
                                    )}
                                    Verify Email
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Member Since
                        </label>
                        <p className="text-white font-medium">
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                        Change Password
                    </h2>
                </div>

                <form onSubmit={handleSubmitPassword} className="space-y-5">
                    <div>
                        <label
                            htmlFor="oldPassword"
                            className="block text-sm font-medium text-slate-300 mb-2"
                        >
                            Current Password
                        </label>
                        <input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-slate-300 mb-2"
                        >
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-slate-300 mb-2"
                        >
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all input-glow"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-600/50 disabled:to-blue-700/50 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 btn-glow"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Update Password
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
