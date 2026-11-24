import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GroupsButton } from "../Components/GroupsButton";
import Navbar from "../Components/Navbar";
import {
  Search,
  BookOpen,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  ChevronDown,
  Calendar,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";

import { getSubjects } from "../api/groupServices";
import { getUnsplashImage } from "../api/unsplashService";
import { authService } from "../api/authservice";
import { useGroups } from "../hooks/useGroups";

const matchesTimeSlot = (sessions, slot) => {
  if (!slot) return true;
  if (!sessions || sessions.length === 0) return false;

  return sessions.some((session) => {
    if (!session.dateTime) return false;
    const dt = new Date(session.dateTime);
    if (Number.isNaN(dt.getTime())) return false;
    const hour = dt.getHours();
    const day = dt.getDay();

    switch (slot) {
      case "Morning":
        return hour >= 5 && hour < 12;
      case "Afternoon":
        return hour >= 12 && hour < 17;
      case "Evening":
        return hour >= 17 || hour < 5;
      case "Weekend":
        return day === 0 || day === 6;
      default:
        return true;
    }
  });
};

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const [subjects, setSubjects] = useState(["All"]);
  const [groupImages, setGroupImages] = useState({});
  const loadedImageIdsRef = useRef(new Set());
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { groups, loading, error: loadError, actionLoadingSet, join, leave, groupDelete } =
    useGroups();

  const navigate = useNavigate();

  const showMessage = (message, isError = false) => {
    if (isError) {
      setSuccessMessage("");
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 4000);
    } else {
      setErrorMessage("");
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 3500);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await join(groupId);
      showMessage("Successfully joined the group!");
    } catch (err) {
      showMessage(err.message || "Failed to join group. Please try again.", true);
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await leave(groupId);
      showMessage("Successfully left the group.");
    } catch (err) {
      showMessage(err.message || "Failed to leave group. Please try again.", true);
    }
  };

  const handleDeleteGroup = async (groupId, groupTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${groupTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await groupDelete(groupId);
      showMessage("Study group deleted.");
    } catch (err) {
      showMessage(err.message || "Failed to delete group. Please try again.", true);
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchSubjects = async () => {
      try {
        const resp = await getSubjects();
        if (Array.isArray(resp)) {
          setSubjects(["All", ...resp.map(({ name }) => name).filter(Boolean)]);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchSubjects();
  }, [navigate]);

  useEffect(() => {
    const missingImages = groups.filter((group) => !loadedImageIdsRef.current.has(group.id));
    if (missingImages.length === 0) return;

    missingImages.forEach((g) => loadedImageIdsRef.current.add(g.id));

    const loadImagesForGroups = async () => {
      const results = await Promise.all(
        missingImages.map(async (group) => {
          const query = group.subject || group.title || "study";
          const imageUrl = await getUnsplashImage(query, group.id);
          return { id: group.id, imageUrl };
        })
      );

      const newImages = {};
      results.forEach((r) => {
        newImages[r.id] = r.imageUrl;
      });
      setGroupImages((prev) => ({ ...prev, ...newImages }));
    };

    loadImagesForGroups();
  }, [groups]);

  const timeSlots = ["All", "Morning", "Afternoon", "Evening", "Weekend"];

  const filteredGroups = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return groups.filter((group) => {
      const title = (group.title || "").toLowerCase();
      const subject = (group.subject || "").toLowerCase();
      const description = (group.description || "").toLowerCase();
      const tags = Array.isArray(group.tags) ? group.tags : [];

      const matchesSearch =
        !q ||
        title.includes(q) ||
        subject.includes(q) ||
        description.includes(q) ||
        tags.some((tag) => (tag || "").toLowerCase().includes(q));

      const matchesSubject = !selectedSubject || group.subject === selectedSubject;
      const matchesTime = matchesTimeSlot(group.sessions, selectedTime);

      return matchesSearch && matchesSubject && matchesTime;
    });
  }, [groups, searchTerm, selectedSubject, selectedTime]);

  const hasActiveFilters = Boolean(searchTerm.trim() || selectedSubject || selectedTime);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setSelectedTime("");
  };

  const currentUserId = authService.getUserId();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col">
      <Navbar />

      {/* Toast Messages */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-2">
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage("")} className="opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-2">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage("")} className="opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Find Your Study Group
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join collaborative learning communities and accelerate your academic journey with like-minded students
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/85 backdrop-blur-sm border-0 shadow-lg rounded-xl p-6 relative z-20">
            <div className="flex flex-col md:flex-row gap-4 relative">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search groups, subjects, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 h-12 border border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              {/* Subject Select */}
              <div className="relative z-40">
                <button
                  type="button"
                  onClick={() => {
                    setSubjectOpen(!subjectOpen);
                    setTimeOpen(false);
                  }}
                  className="w-full md:w-52 h-12 px-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center truncate">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span className="text-gray-700 truncate">{selectedSubject || "All Subjects"}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${
                      subjectOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {subjectOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setSubjectOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-40 max-h-64 overflow-y-auto">
                      {subjects.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => {
                            setSelectedSubject(subject === "All" ? "" : subject);
                            setSubjectOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer ${
                            (subject === "All" && !selectedSubject) || selectedSubject === subject
                              ? "bg-purple-50 text-purple-700 font-medium"
                              : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Time Select */}
              <div className="relative z-40">
                <button
                  type="button"
                  onClick={() => {
                    setTimeOpen(!timeOpen);
                    setSubjectOpen(false);
                  }}
                  className="w-full md:w-44 h-12 px-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center truncate">
                    <Clock className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span className="text-gray-700 truncate">{selectedTime || "Any Time"}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${
                      timeOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {timeOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setTimeOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-40 max-h-60 overflow-y-auto">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(time === "All" ? "" : time);
                            setTimeOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer ${
                            (time === "All" && !selectedTime) || selectedTime === time
                              ? "bg-purple-50 text-purple-700 font-medium"
                              : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-12 px-4 border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center text-sm font-medium transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {loadError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {loadError}
            </div>
          )}

          {/* Groups Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-3" />
              <p className="text-base font-medium">Loading study groups...</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
              <Users className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No study groups found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? "Try adjusting your search or filter criteria."
                  : "Be the first to create a study group for your course!"}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
                <Link
                  to="/create-group"
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Study Group
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => {
                const tags = Array.isArray(group.tags) ? group.tags : [];
                const nextSession =
                  group.sessions && group.sessions.length > 0 ? group.sessions[0] : null;
                const isOnline = Boolean(nextSession?.isOnline);
                const isFull =
                  group.maxMembers > 0 && (group.currentMembers || 0) >= group.maxMembers;
                const isUrl =
                  nextSession?.location && /^https?:\/\//i.test(nextSession.location.trim());

                return (
                  <div
                    key={group.id}
                    className="bg-white/85 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group overflow-hidden flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600">
                      <img
                        src={groupImages[group.id] || "/og-image.png"}
                        alt={group.title}
                        onError={(e) => {
                          e.currentTarget.src = "/og-image.png";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {group.subject || "General"}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isFull ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isFull ? "Full" : "Open"}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {group.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {group.description}
                      </p>

                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 shrink-0" />
                          {group.currentMembers}/{group.maxMembers} members
                        </div>

                        {nextSession && (
                          <>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 shrink-0" />
                              <span className="truncate">Next: {nextSession.title}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 shrink-0" />
                              {new Date(nextSession.dateTime).toLocaleString("en-CA", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </div>
                            <div className="flex items-center">
                              {isOnline ? (
                                <>
                                  <Video className="w-4 h-4 mr-2 shrink-0 text-green-600" />
                                  {isUrl && group.member ? (
                                    <a
                                      href={nextSession.location}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-green-600 hover:underline inline-flex items-center truncate"
                                    >
                                      Online Meeting Link
                                      <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0" />
                                    </a>
                                  ) : (
                                    <span className="text-green-600 truncate">
                                      Online{!group.member ? " (join to view link)" : ""}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-4 h-4 mr-2 shrink-0" />
                                  <span className="truncate">{nextSession.location || "TBD"}</span>
                                </>
                              )}
                            </div>
                          </>
                        )}

                        <div className="text-xs text-purple-600 font-medium pt-1">
                          {group.sessions ? group.sessions.length : 0} session
                          {group.sessions && group.sessions.length !== 1 ? "s" : ""} scheduled
                        </div>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 border border-gray-200 rounded-full text-xs text-gray-600 bg-gray-50"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 3 && (
                            <span className="px-2.5 py-0.5 border border-gray-200 rounded-full text-xs text-gray-500">
                              +{tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto pt-2">
                        <GroupsButton
                          isOwner={currentUserId === group.createdBy}
                          member={Boolean(group.member)}
                          isFull={isFull}
                          isLoading={actionLoadingSet.has(group.id)}
                          onJoin={() => handleJoin(group.id)}
                          onLeave={() => handleLeave(group.id)}
                          onDelete={() => handleDeleteGroup(group.id, group.title)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create Group CTA */}
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Can&apos;t Find the Perfect Group?</h2>
              <p className="text-purple-100 text-lg mb-6 max-w-2xl mx-auto">
                Create your own study group and invite like-minded students to join your learning journey
              </p>
              <Link
                to="/create-group"
                className="inline-flex items-center bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Study Group
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Groups;
