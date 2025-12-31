import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Shield, 
  Search, 
  MoreHorizontal,
  TrendingUp,
  AlertTriangle,
  Eye,
  Home,
  User,
  Menu,
  X,
  Bell,
  MessageCircle,
  Plus
} from "lucide-react";
import { isAnAdmin, getUsers } from "../api/adminService";
import { getAllGroups } from "../api/groupServices";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Groups', href: '/groups', icon: BookOpen },
    { name: 'Create Group', href: '/create-group', icon: Plus },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkAdmin = async () => {
    try {
      const admin = await isAnAdmin();
      if (!admin) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to check admin role', err);
      navigate('/dashboard');
    }
  };

  const fetchUsers = async () => {
    try {
        const resp = await getUsers();
        setUsers(resp);
    } catch (error) {
        console.error('Failed to fetch Users:', error);
    }
  };

  const fetchStudyGroup = async () => {
    try {
        const resp = await getAllGroups();
        setStudyGroups(resp);
    } catch (error) {
        console.error('Failed to fetch Study Groups:', error);
    }
  };

  checkAdmin();
  fetchUsers();
  fetchStudyGroup();
  }, [navigate])

  const stats = [
    { title: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "bg-blue-500" },
    { title: "Active Groups", value: "156", change: "+8%", icon: BookOpen, color: "bg-green-500" },
    { title: "Pending Reports", value: "7", change: "-3%", icon: AlertTriangle, color: "bg-yellow-500" },
    { title: "This Month Signups", value: "234", change: "+25%", icon: TrendingUp, color: "bg-purple-500" }
  ];

//   const studyGroups = [
//     { id: 1, name: "Advanced Calculus", creator: "Prof. Anderson", members: 24, status: "active", reports: 0 },
//     { id: 2, name: "Organic Chemistry Lab", creator: "Sarah Johnson", members: 18, status: "active", reports: 1 },
//     { id: 3, name: "Machine Learning Basics", creator: "Alex Kim", members: 32, status: "under_review", reports: 3 },
//     { id: 4, name: "Spanish Conversation", creator: "Maria Garcia", members: 15, status: "active", reports: 0 }
//   ];

  const reports = [
    { id: 1, type: "Inappropriate Content", group: "Machine Learning Basics", reporter: "Anonymous", status: "pending", date: "2024-01-15" },
    { id: 2, type: "Spam", group: "Study Group Hub", reporter: "John Doe", status: "resolved", date: "2024-01-14" },
    { id: 3, type: "Harassment", group: "Chemistry Study", reporter: "Jane Smith", status: "investigating", date: "2024-01-13" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "under_review": return "bg-orange-100 text-orange-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "investigating": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "users", label: "Users" },
    { id: "groups", label: "Groups" },
    { id: "reports", label: "Reports" },
    { id: "analytics", label: "Analytics" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                StudyHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Manage users, groups, and platform health</p>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="space-y-6">
              {/* Tab List */}
              <div className="flex justify-center">
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">
                        User Management
                      </h2>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{`${user.firstName} ${user.lastName}`}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">Joined 
                                {" "+new Date(user.createdAt).toLocaleString('en-CA')}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor("active")}`}>
                              {"Active"}
                            </span>
                            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Groups Tab */}
              {activeTab === "groups" && (
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Study Groups Management
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {studyGroups.map((group) => (
                        <div key={group.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{group.title}</h3>
                              <p className="text-sm text-gray-600">Created by 
                                {" " + users.find(user => user.id == group.createdBy).firstName + " "}
                                {users.find(user => user.id == group.createdBy).lastName}
                              </p>
                              <p className="text-xs text-gray-500">{group.currentMembers} members</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {group.reports > 0 && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {group.reports} reports
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor("active")}`}>
                              Active
                            </span>
                            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Reports & Moderation
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{report.type}</h3>
                              <p className="text-sm text-gray-600">Group: {report.group}</p>
                              <p className="text-xs text-gray-500">Reported by {report.reporter} on {report.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                              Review
                            </button>
                            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Platform Analytics
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Analytics Dashboard</h3>
                      <p className="text-gray-500">Advanced analytics and reporting features coming soon...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
