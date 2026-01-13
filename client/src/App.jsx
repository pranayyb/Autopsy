import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import "./App.css";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// App Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/projects/Projects";
import CreateProject from "./pages/projects/CreateProject";
import ProjectDetails from "./pages/projects/ProjectDetails";
import EditProject from "./pages/projects/EditProject";
import Risks from "./pages/Risks";
import Settings from "./pages/Settings";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password/:resetToken"
                        element={<ResetPassword />}
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            index
                            element={<Navigate to="/dashboard" replace />}
                        />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="projects" element={<Projects />} />
                        <Route
                            path="projects/new"
                            element={<CreateProject />}
                        />
                        <Route
                            path="projects/:projectId"
                            element={<ProjectDetails />}
                        />
                        <Route
                            path="projects/:projectId/edit"
                            element={<EditProject />}
                        />
                        <Route path="risks" element={<Risks />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* Catch all */}
                    <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                    />
                </Routes>
            </Router>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#1f2937",
                        color: "#fff",
                        border: "1px solid #374151",
                    },
                    success: {
                        iconTheme: {
                            primary: "#10b981",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                        },
                    },
                }}
            />
        </AuthProvider>
    );
}

export default App;
