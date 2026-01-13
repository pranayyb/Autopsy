import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    FolderKanban,
    AlertTriangle,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from "lucide-react";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const menuItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/projects", icon: FolderKanban, label: "Projects" },
        { path: "/risks", icon: AlertTriangle, label: "Risk Monitor" },
        { path: "/settings", icon: Settings, label: "Settings" },
    ];

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard";
        }
        return location.pathname.startsWith(path);
    };

    const closeMobile = () => setMobileOpen(false);

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 border-b border-slate-700/50">
                <Link to="/dashboard" className="flex items-center gap-3">
                    <img 
                        src="/skull.svg" 
                        alt="Autopsy" 
                        className="w-11 h-11 drop-shadow-lg" 
                    />
                    {!collapsed && (
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Autopsy
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobile}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                            isActive(item.path)
                                ? "bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white shadow-lg shadow-blue-500/20"
                                : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                        }`}
                    >
                        <item.icon
                            className={`w-5 h-5 flex-shrink-0 transition-transform ${
                                isActive(item.path) ? "scale-110" : ""
                            }`}
                        />
                        {!collapsed && (
                            <span className="font-medium">{item.label}</span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-slate-700/50">
                <div
                    className={`flex items-center ${
                        collapsed ? "justify-center" : "gap-3"
                    } mb-4 p-3 rounded-xl bg-slate-700/30`}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-slate-600">
                        <span className="text-white font-semibold">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </span>
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                                {user?.username}
                            </p>
                            <p className="text-slate-400 text-sm truncate">
                                {user?.email}
                            </p>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all ${
                        collapsed ? "justify-center" : ""
                    }`}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>

            {/* Collapse button*/}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-all shadow-lg"
            >
                {collapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </button>
        </div>
    );

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-slate-800/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-white border border-slate-700/50 shadow-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={closeMobile}
                />
            )}

            {/* Mobile sidebar */}
            <div
                className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-slate-800/95 backdrop-blur-xl z-50 transform transition-transform border-r border-slate-700/50 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button
                    onClick={closeMobile}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                {sidebarContent}
            </div>

            {/* Desktop sidebar */}
            <div
                className={`hidden lg:block relative bg-slate-800/80 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300  ${
                    collapsed ? "w-20" : "w-72"
                }`}
            >
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;
