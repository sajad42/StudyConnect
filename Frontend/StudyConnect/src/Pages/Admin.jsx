import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Shield,
  Search,
  Calendar,
  TrendingUp,
  Trash2,
  Loader2,
} from "lucide-react";
import { isAnAdmin, getUsers } from "../api/adminService";
import { getAllGroups, deleteGroup } from "../api/groupServices";
import Navbar from "../Components/Navbar";

const AdminDashboard = () => {
  const [userSearch, setUserSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [deletingGroupId, setDeletingGroupId] = useState(null);
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);

  useEffect(() => {
    if (!isAnAdmin()) {
      navigate("/dashboard", { replace: true });
      return;
    }

    let cancelled = false;

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [usersResp, groupsResp] = await Promise.all([
          getUsers().catch(() => []),
          getAllGroups().catch(() => []),
        ]);
        if (cancelled) return;
        setUsers(Array.isArray(usersResp) ? usersResp : []);
        setStudyGroups(Array.isArray(groupsResp) ? groupsResp : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAdminData();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach((u) => map.set(Number(u.id), u));
    return map;
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      return (
        fullName.includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.university || "").toLowerCase().includes(q)
      );
    });
  }, [users, userSearch]);

  const filteredGroups = useMemo(() => {
    const q = groupSearch.trim().toLowerCase();
    if (!q) return studyGroups;
    return studyGroups.filter((g) => {
      return (
        (g.title || "").toLowerCase().includes(q) ||
        (g.subject || "").toLowerCase().includes(q)
      );
    });
  }, [studyGroups, groupSearch]);

  const totalSessions = useMemo(
    () => studyGroups.reduce((sum, g) => sum + (g.sessions?.length || 0), 0),
    [studyGroups]
  );

  const totalMemberships = useMemo(
    () => studyGroups.reduce((sum, g) => sum + (g.currentMembers || 0), 0),
    [studyGroups]
  );

  const handleDeleteGroup = async (group) => {
    if (!window.confirm(`Delete study group "${group.title}"?`)) return;
    setDeletingGroupId(group.id);
    try {
      await deleteGroup(group.id);
      setStudyGroups((prev) => prev.filter((g) => g.id !== group.id));
      setFeedback(`Deleted "${group.title}".`);
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setFeedback(err.message || "Failed to delete group.");
      setTimeout(() => setFeedback(""), 4000);
    } finally {
      setDeletingGroupId(null);
    }
  };

  const stats = [
    { title: "Total Users", value: String(users.length), icon: Users, color: "bg-blue-500" },
    {
      title: "Study Groups",
      value: String(studyGroups.length),
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Scheduled Sessions",
      value: String(totalSessions),
      icon: Calendar,
      color: "bg-amber-500",
    },
    {
      title: "Total Memberships",
      value: String(totalMemberships),
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const tabs = [
    { id: "users", label: `Users (${users.length})` },
    { id: "groups", label: `Groups (${studyGroups.length})` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, study groups, and platform health</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>

          {feedback && (
            <div className="mb-6 bg-purple-50 border border-purple-200 text-purple-800 px-4 py-3 rounded-lg text-sm">
              {feedback}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/85 backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800">
                        {loading ? "—" : stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex bg-white/80 shadow-sm rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="bg-white/85 rounded-xl shadow-xl p-12 flex items-center justify-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2 text-purple-600" />
                Loading platform data...
              </div>
            ) : activeTab === "users" ? (
              <div className="bg-white/85 backdrop-blur-md rounded-xl shadow-xl">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="p-6">
                  {filteredUsers.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No matching users found.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"}
                              </h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">
                                {user.university ? `${user.university} • ` : ""}
                                Joined{" "}
                                {user.createdAt
                                  ? new Date(user.createdAt).toLocaleDateString("en-CA")
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role || "USER"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/85 backdrop-blur-md rounded-xl shadow-xl">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">Study Groups Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search groups..."
                      value={groupSearch}
                      onChange={(e) => setGroupSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="p-6">
                  {filteredGroups.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No matching study groups found.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredGroups.map((group) => {
                        const creator = userMap.get(Number(group.createdBy));
                        const creatorName = creator
                          ? `${creator.firstName || ""} ${creator.lastName || ""}`.trim()
                          : `User #${group.createdBy ?? "Unknown"}`;

                        return (
                          <div
                            key={group.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">{group.title}</h3>
                                <p className="text-sm text-gray-600">
                                  {group.subject} • Created by {creatorName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {group.currentMembers}/{group.maxMembers} members
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                              <button
                                type="button"
                                disabled={deletingGroupId === group.id}
                                onClick={() => handleDeleteGroup(group)}
                                title="Delete study group"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
