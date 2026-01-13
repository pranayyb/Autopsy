import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-6 lg:p-10 pt-20 lg:pt-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
