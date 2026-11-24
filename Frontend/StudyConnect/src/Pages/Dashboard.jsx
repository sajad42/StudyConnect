import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Video,
  Award,
  Target,
  UserCheck,
  Loader2,
} from "lucide-react";
import { getUserGroups } from "../api/groupServices";
import { getUserProfile } from "../api/profileServices";
import { authService } from "../api/authservice";
import Navbar from "../Components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => authService.getUser());
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const [groupsData, profileData] = await Promise.all([
          getUserGroups(),
          getUserProfile().catch(() => null),
        ]);
        if (cancelled) return;
        setMyGroups(Array.isArray(groupsData) ? groupsData : []);
        if (profileData && profileData.id) {
          setUser(profileData);
          authService.setUser(profileData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const upcomingSessions = useMemo(() => {
    const list = [];
    myGroups.forEach((group) => {
      (group.sessions || []).forEach((session) => {
        list.push({
          ...session,
          groupId: group.id,
          groupTitle: group.title,
          subject: group.subject,
          currentMembers: group.currentMembers,
        });
      });
    });
    return list.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }, [myGroups]);

  const uniqueSubjectsCount = useMemo(() => {
    return new Set(myGroups.map((g) => g.subject).filter(Boolean)).size;
  }, [myGroups]);

  const studyPartnersCount = useMemo(() => {
    return myGroups.reduce((sum, g) => sum + Math.max(0, (g.currentMembers || 1) - 1), 0);
  }, [myGroups]);

  const stats = [
    {
      title: "Active Groups",
      value: String(myGroups.length),
      subtitle: myGroups.length === 1 ? "Joined group" : "Joined groups",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Scheduled Sessions",
      value: String(upcomingSessions.length),
      subtitle: "Across your groups",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Study Partners",
      value: String(studyPartnersCount),
      subtitle: "Peers in your groups",
      icon: UserCheck,
      color: "text-purple-600",
    },
    {
      title: "Subjects Covered",
      value: String(uniqueSubjectsCount),
      subtitle: "Academic topics",
      icon: Award,
      color: "text-orange-600",
    },
  ];

  const formatDateTime = (dt) => {
    if (!dt) return "TBD";
    const parsed = new Date(dt);
    if (Number.isNaN(parsed.getTime())) return "TBD";
    return parsed.toLocaleString("en-CA", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back{user.firstName ? `, ${user.firstName}` : ""}!
                </h1>
                <p className="text-purple-100 text-lg">
                  {user.bio || "Ready to collaborate and crush your next study session?"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/create-group"
                  className="inline-flex items-center px-4 py-2.5 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-medium transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Link>
                <Link
                  to="/groups"
                  className="inline-flex items-center px-4 py-2.5 border border-white text-white hover:bg-white hover:text-purple-600 rounded-lg font-medium transition-colors"
                >
                  Find Groups
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/85 backdrop-blur-sm border-0 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        {loading ? "—" : stat.value}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
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
              <div className="bg-white/85 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Upcoming Study Sessions
                  </h2>
                  <Link
                    to="/groups"
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Browse All Groups
                  </Link>
                </div>
                <div className="p-6 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mr-2 text-purple-600" />
                      Loading your sessions...
                    </div>
                  ) : upcomingSessions.length === 0 ? (
                    <div className="text-center py-10">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-gray-700 mb-1">
                        No study sessions scheduled yet
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Join an active study group or create one to schedule your first session.
                      </p>
                      <Link
                        to="/groups"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Explore Study Groups
                      </Link>
                    </div>
                  ) : (
                    upcomingSessions.map((session) => (
                      <div
                        key={`${session.groupId}-${session.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{session.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 shrink-0" />
                                {formatDateTime(session.dateTime)}
                              </div>
                              <div className="flex items-center">
                                {session.isOnline ? (
                                  <>
                                    <Video className="w-4 h-4 mr-1 shrink-0 text-green-600" />
                                    <span className="text-green-700">Online</span>
                                  </>
                                ) : (
                                  <>
                                    <MapPin className="w-4 h-4 mr-1 shrink-0" />
                                    <span>{session.location || "TBD"}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 shrink-0" />
                                {session.currentMembers} members
                              </div>
                            </div>
                          </div>
                        </div>
                        {session.subject && (
                          <span className="self-start sm:self-center inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 shrink-0">
                            {session.subject}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* My Groups */}
            <div>
              <div className="bg-white/85 backdrop-blur-sm border-0 shadow-lg rounded-xl">
                <div className="p-6 pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">My Study Groups</h2>
                </div>
                <div className="p-6 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin mr-2 text-purple-600" />
                      Loading groups...
                    </div>
                  ) : myGroups.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        You haven&apos;t joined any study groups yet.
                      </p>
                    </div>
                  ) : (
                    myGroups.map((group) => {
                      const isFull =
                        group.maxMembers > 0 && (group.currentMembers || 0) >= group.maxMembers;
                      const nextSessionDate =
                        group.sessions && group.sessions.length > 0
                          ? formatDateTime(group.sessions[0].dateTime)
                          : "No session";

                      return (
                        <div key={group.id} className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-gray-800 truncate">{group.title}</h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                                isFull
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {isFull ? "Full" : "Active"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-3.5 h-3.5 mr-1" />
                              {group.currentMembers}/{group.maxMembers} members
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {nextSessionDate}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <Link
                    to="/groups"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300"
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
            <Link
              to="/create-group"
              className="bg-white/85 backdrop-blur-sm border-0 shadow-lg rounded-xl group hover:shadow-xl transition-all duration-300 block"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Start a Study Group</h3>
                <p className="text-gray-600 text-sm">
                  Create a focused group and schedule sessions for your course
                </p>
              </div>
            </Link>

            <Link
              to="/groups"
              className="bg-white/85 backdrop-blur-sm border-0 shadow-lg rounded-xl group hover:shadow-xl transition-all duration-300 block"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Discover Peers</h3>
                <p className="text-gray-600 text-sm">
                  Browse groups by subject, tags, or meeting schedule
                </p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="bg-white/85 backdrop-blur-sm border-0 shadow-lg rounded-xl group hover:shadow-xl transition-all duration-300 block"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Update Profile</h3>
                <p className="text-gray-600 text-sm">
                  Keep your major, university, and bio up to date
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
