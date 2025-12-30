import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  Plus, 
  User, 
  Bell, 
  Menu,
  X,
  BookOpen,
  MessageCircle,
  Calendar, 
  Clock, 
  MapPin,
  Award,
  Target,
  TrendingUp
} from "lucide-react";
import { getUserGroups } from "../api/groupServices";

export default function dashboard() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [myGroups, setMyGroups] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userData));
        
        const fetchGroups = async () => {
            try {
                const groups = await getUserGroups();
                setMyGroups(groups);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
            }

        };
    
    fetchGroups();
    }, []);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Study Groups', href: '/groups', icon: Users },
        { name: 'Create Group', href: '/create-group', icon: Plus },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const isActive = (path) => location.pathname === path;

    const stats = [
        {
        title: "Study Sessions",
        value: "24",
        change: "+3 this week",
        icon: Calendar,
        color: "text-blue-600"
        },
        {
        title: "Active Groups",
        value: "6",
        change: "+1 this month",
        icon: Users,
        color: "text-green-600"
        },
        {
        title: "Study Hours",
        value: "48",
        change: "+8 this week",
        icon: Clock,
        color: "text-purple-600"
        },
        {
        title: "Achievement Score",
        value: "892",
        change: "+42 points",
        icon: Award,
        color: "text-orange-600"
        }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    StudySync
                </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/60 ${
                        isActive(item.href)
                            ? 'bg-white/80 text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-purple-600'
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
                <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                
                <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                </button>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                </div>
            </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
            <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-white/20">
                <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive(item.href)
                            ? 'bg-purple-100 text-purple-600'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                    </Link>
                    );
                })}
                </div>
            </div>
            )}
        </header>

        {/* Main Content */}
        <main className="flex-1">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, {user.firstName}! 👋
                    </h1>
                    <p className="text-purple-100 text-lg mb-4 md:mb-0">
                    {user.bio}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Link 
                    to="/create-group"
                    className="inline-flex items-center px-4 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                    </Link>
                    <Link 
                    to="/groups"
                    className="inline-flex items-center px-4 py-2 border border-white text-white hover:bg-white hover:text-purple-600 rounded-lg font-medium transition-colors"
                    >
                    Find Groups
                    </Link>
                </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                        <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        <p className="text-green-600 text-sm mt-1">{stat.change}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upcoming Sessions */}
                <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg">
                    <div className="flex flex-row items-center justify-between p-6 pb-0">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Upcoming Study Sessions
                    </h2>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        View All
                    </button>
                    </div>
                    <div className="p-6 space-y-4">
                    {myGroups.map((group) => 
                    group.sessions && group.sessions.length > 0 ? (
                        group.sessions.map((session) => (
                        <div key={`${group.id}-${session.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{session.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(session.dateTime).toLocaleString('en-CA', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                    })}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {session.location}
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {group.currentMembers} members
                                </div>
                                </div>
                            </div>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {group.subject}
                            </span>
                        </div>
                        ))
                    ) : (
                        <div key={group.id}>
                        </div>
                    )
                    )}
                    </div>
                </div>
                </div>

                {/* My Groups */}
                <div>
                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg">
                    <div className="p-6 pb-0">
                    <h2 className="text-xl font-semibold text-gray-800">
                        My Study Groups
                    </h2>
                    </div>
                    <div className="p-6 space-y-4">
                    {myGroups.map((group) => (
                        <div key={group.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">{group.title}</h3>
                            <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                group.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                            >
                            {group.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {group.currentMembers} members
                            </div>
                            <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {group.nextSession}
                            </div>
                        </div>
                        </div>
                    ))}
                    
                    <Link 
                        to="/groups"
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Join New Group
                    </Link>
                    </div>
                </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg cursor-pointer group hover:shadow-xl transition-all duration-300">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Set Study Goals</h3>
                    <p className="text-gray-600 text-sm">Track your progress and achieve your academic targets</p>
                </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg cursor-pointer group hover:shadow-xl transition-all duration-300">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Group Chat</h3>
                    <p className="text-gray-600 text-sm">Connect and collaborate with your study partners</p>
                </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg cursor-pointer group hover:shadow-xl transition-all duration-300">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Study Analytics</h3>
                    <p className="text-gray-600 text-sm">View detailed insights about your learning progress</p>
                </div>
                </div>
            </div>
            </div>
        </main>
        </div>
    )
}