import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, risksAPI } from '../services/api';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Filter,
  Loader2,
  FolderKanban,
  AlertCircle,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const Risks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [risks, setRisks] = useState([]);
  const [projectHealth, setProjectHealth] = useState(null);
  const [topRiskTasks, setTopRiskTasks] = useState([]);
  const [riskTimeline, setRiskTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRisks, setLoadingRisks] = useState(false);

  const fetchRiskData = useCallback(async () => {
    if (!selectedProject) return;
    setLoadingRisks(true);
    try {
      const [risksRes, healthRes, topTasksRes, timelineRes] = await Promise.all([
        risksAPI.getProjectRisks(selectedProject),
        risksAPI.getProjectHealth(selectedProject),
        risksAPI.getTopRiskTasks(selectedProject, 5),
        risksAPI.getTimeline(selectedProject, { 
          from: subDays(new Date(), 30).toISOString() 
        }),
      ]);

      setRisks(risksRes.data.data.risks || []);
      setProjectHealth(healthRes.data.data);
      setTopRiskTasks(topTasksRes.data.data.topTasks || []);
      setRiskTimeline(timelineRes.data.data.timeline || []);
    } catch {
      // Error fetching risk data
    } finally {
      setLoadingRisks(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchRiskData();
    }
  }, [selectedProject, fetchRiskData]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      const projectList = response.data.data.projects || [];
      setProjects(projectList);
      if (projectList.length > 0) {
        setSelectedProject(projectList[0]._id);
      }
    } catch {
      // Error fetching projects
    } finally {
      setLoading(false);
    }
  };

  const handleResolveRisk = async (riskId) => {
    try {
      await risksAPI.resolveRisk(riskId);
      toast.success('Risk marked as resolved');
      fetchRiskData();
    } catch {
      toast.error('Failed to resolve risk');
    }
  };

  const getRiskTypeColor = (type) => {
    switch (type) {
      case 'STAGNATION':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'FAKE_PROGRESS':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'STATUS_FLAPPING':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'OVERDUE':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskTypeLabel = (type) => {
    switch (type) {
      case 'STAGNATION':
        return 'Stagnation';
      case 'FAKE_PROGRESS':
        return 'Fake Progress';
      case 'STATUS_FLAPPING':
        return 'Status Flapping';
      case 'OVERDUE':
        return 'Overdue';
      default:
        return type;
    }
  };

  const getSeverityColor = (severity) => {
    if (severity >= 4) return 'text-red-400';
    if (severity >= 3) return 'text-orange-400';
    if (severity >= 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getHealthColor = (score) => {
    if (score > 80) return 'text-red-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getHealthBgColor = (score) => {
    if (score > 80) return 'bg-red-500';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const openRisks = risks.filter((r) => r.status === 'open');
  const resolvedRisks = risks.filter((r) => r.status === 'resolved');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Projects</h2>
        <p className="text-gray-400 mb-4">
          Create a project first to monitor risks
        </p>
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Create Project
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Risk Monitor</h1>
          <p className="text-gray-400 mt-1">
            Track and manage project risks
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchRiskData}
            disabled={loadingRisks}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {loadingRisks ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {loadingRisks ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Health Score</p>
                  <p
                    className={`text-3xl font-bold mt-1 ${getHealthColor(
                      projectHealth?.projectHealthScore || 0
                    )}`}
                  >
                    {projectHealth?.projectHealthScore ?? 'N/A'}%
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    projectHealth?.projectHealthScore > 50
                      ? 'bg-red-500/20'
                      : 'bg-green-500/20'
                  }`}
                >
                  <TrendingUp
                    className={`w-6 h-6 ${getHealthColor(
                      projectHealth?.projectHealthScore || 0
                    )}`}
                  />
                </div>
              </div>
              {projectHealth?.projectHealthScore !== undefined && (
                <div className="mt-4">
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getHealthBgColor(
                        projectHealth.projectHealthScore
                      )} transition-all`}
                      style={{ width: `${projectHealth.projectHealthScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Open Risks</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {openRisks.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Resolved</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {resolvedRisks.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">At-Risk Tasks</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {topRiskTasks.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Insight Message */}
          {projectHealth?.insightMessage && (
            <div
              className={`rounded-xl p-4 border ${
                projectHealth.projectHealthScore > 80
                  ? 'bg-red-500/10 border-red-500/30'
                  : projectHealth.projectHealthScore > 50
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle
                  className={`w-5 h-5 ${getHealthColor(
                    projectHealth.projectHealthScore
                  )}`}
                />
                <p
                  className={`font-medium ${getHealthColor(
                    projectHealth.projectHealthScore
                  )}`}
                >
                  {projectHealth.insightMessage}
                </p>
              </div>
            </div>
          )}

          {/* Risk Timeline */}
          {riskTimeline.length > 0 && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Risk Timeline (Last 30 Days)</h2>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {riskTimeline.slice(0, 20).map((event, index) => (
                  <div key={event._id || index} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      event.severity >= 4 ? 'bg-red-400' :
                      event.severity >= 3 ? 'bg-orange-400' :
                      event.severity >= 2 ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getRiskTypeColor(event.type)}`}>
                          {getRiskTypeLabel(event.type)}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {format(new Date(event.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{event.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              {riskTimeline.length > 20 && (
                <p className="text-gray-500 text-sm text-center mt-3">
                  Showing 20 of {riskTimeline.length} events
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Signals */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-5 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Risk Signals</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {openRisks.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                    <p className="text-gray-400">No open risks</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {openRisks.map((risk) => (
                      <div key={risk._id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getRiskTypeColor(
                                  risk.type
                                )}`}
                              >
                                {getRiskTypeLabel(risk.type)}
                              </span>
                              <span
                                className={`text-sm font-medium ${getSeverityColor(
                                  risk.severity
                                )}`}
                              >
                                Severity: {risk.severity}/5
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">
                              {risk.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              {format(new Date(risk.createdAt), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleResolveRisk(risk._id)}
                            className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs rounded-lg transition-colors"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Risk Tasks */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-5 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">
                  Top At-Risk Tasks
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {topRiskTasks.length === 0 ? (
                  <div className="p-8 text-center">
                    <FolderKanban className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No at-risk tasks</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {topRiskTasks.map(({ task, cumulativeRisk }, index) => (
                      <div key={task._id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0
                                ? 'bg-red-500 text-white'
                                : index === 1
                                ? 'bg-orange-500 text-white'
                                : 'bg-yellow-500 text-gray-900'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <Link
                              to={`/projects/${selectedProject}`}
                              className="text-white font-medium hover:text-blue-400 transition-colors"
                            >
                              {task.title}
                            </Link>
                            <div className="flex items-center gap-3 mt-1">
                              <span
                                className={`text-sm ${getSeverityColor(
                                  Math.min(cumulativeRisk, 5)
                                )}`}
                              >
                                Risk Score: {cumulativeRisk}
                              </span>
                              <span className="text-gray-500 text-sm">
                                Status: {task.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Type Breakdown */}
          {projectHealth?.typeBreakdown && Object.keys(projectHealth.typeBreakdown).length > 0 && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
              <h2 className="text-lg font-semibold text-white mb-4">
                Risk Type Breakdown
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(projectHealth.typeBreakdown).map(
                  ([type, count]) => (
                    <div
                      key={type}
                      className="bg-gray-700/50 rounded-lg p-4 text-center"
                    >
                      <p className="text-2xl font-bold text-white">{count}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {getRiskTypeLabel(type)}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Risks;
