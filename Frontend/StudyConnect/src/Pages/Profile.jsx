import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Edit,
  Mail,
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Settings,
  Calendar,
  Lock,
  LogOut,
  Loader2,
  Check,
  X,
} from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStudyGroups,
  getInterestedSubjects,
} from "../api/profileServices";
import { authService } from "../api/authservice";
import Navbar from "../Components/Navbar";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    major: "",
    year: "",
    bio: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({ type: "", text: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;

    const loadAll = async () => {
      setLoading(true);
      try {
        const [userResp, groupsResp, subjectsResp] = await Promise.all([
          getUserProfile(),
          getUserStudyGroups().catch(() => []),
          getInterestedSubjects().catch(() => []),
        ]);
        if (cancelled) return;
        const normalized = {
          firstName: userResp?.firstName || "",
          lastName: userResp?.lastName || "",
          email: userResp?.email || "",
          university: userResp?.university || "",
          major: userResp?.major || "",
          year: userResp?.year || "",
          bio: userResp?.bio || "",
        };
        setProfile(normalized);
        setOriginalProfile(normalized);
        setGroups(Array.isArray(groupsResp) ? groupsResp : []);
        setSubjects(Array.isArray(subjectsResp) ? subjectsResp : []);
      } catch (err) {
        if (!cancelled) {
          setStatusMessage({ type: "error", text: err.message || "Failed to load profile." });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSave = async () => {
    setStatusMessage({ type: "", text: "" });
    if (JSON.stringify(profile) === JSON.stringify(originalProfile)) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateUserProfile(profile);
      const nextProfile = {
        firstName: updated?.firstName ?? profile.firstName,
        lastName: updated?.lastName ?? profile.lastName,
        email: updated?.email ?? profile.email,
        university: updated?.university ?? profile.university,
        major: updated?.major ?? profile.major,
        year: updated?.year ?? profile.year,
        bio: updated?.bio ?? profile.bio,
      };
      setProfile(nextProfile);
      setOriginalProfile(nextProfile);
      if (updated && updated.id) {
        authService.setUser(updated);
      } else {
        authService.setUser({ ...authService.getUser(), ...nextProfile });
      }
      setIsEditing(false);
      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 3500);
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (originalProfile) setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: "", text: "" });

    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", text: "New passwords do not match." });
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordStatus({ type: "success", text: "Password updated successfully!" });
    } catch (err) {
      setPasswordStatus({
        type: "error",
        text: err.message || "Could not update password. Check your current password.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const currentUserId = authService.getUserId();
  const createdCount = groups.filter((g) => g.createdBy === currentUserId).length;

  const achievements = [
    {
      name: "Community Member",
      description: "Joined StudySync and set up your student profile",
      unlocked: true,
    },
    {
      name: "Team Player",
      description: "Joined at least 1 active study group",
      unlocked: groups.length >= 1,
    },
    {
      name: "Study Group Leader",
      description: "Created a study group for fellow students",
      unlocked: createdCount >= 1,
    },
    {
      name: "Multi-Disciplinary",
      description: "Collaborating across 2 or more academic subjects",
      unlocked: subjects.length >= 2,
    },
  ];

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "groups", label: "Groups", icon: Users },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const universitySuggestions = [
    "University of Toronto",
    "York University",
    "University of Waterloo",
    "McGill University",
    "Harvard University",
    "MIT",
    "Stanford University",
    "UC Berkeley",
    "Oxford University",
    "Cambridge University",
  ];

  const majorSuggestions = [
    "Computer Science",
    "Software Engineering",
    "Engineering",
    "Business & Finance",
    "Mathematics",
    "Physics",
    "Biology",
    "Chemistry",
    "Economics",
    "Psychology",
    "Medicine",
    "Law",
  ];

  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "Student Profile";
  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg text-white text-2xl font-bold">
                {initials || <User className="w-12 h-12 text-white" />}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {loading ? "Loading..." : fullName}
            </h1>
            <p className="text-gray-600">
              {[profile.major, profile.year, profile.university].filter(Boolean).join(" • ") ||
                "Complete your academic details below"}
            </p>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex bg-white/80 shadow-sm rounded-lg p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Tab Content */}
            {activeTab === "profile" && (
              <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 text-sm cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isSaving || loading}
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 ${
                        isEditing
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isEditing ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Edit className="w-4 h-4" />
                      )}
                      {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
                    </button>
                  </div>
                </div>

                {statusMessage.text && (
                  <div
                    className={`mx-6 mt-4 px-4 py-3 rounded-lg text-sm ${
                      statusMessage.type === "error"
                        ? "bg-red-50 border border-red-200 text-red-700"
                        : "bg-green-50 border border-green-200 text-green-700"
                    }`}
                  >
                    {statusMessage.text}
                  </div>
                )}

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-gray-700 font-medium flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-gray-700 font-medium flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-gray-700 font-medium flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="university" className="text-gray-700 font-medium flex items-center text-sm">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        University
                      </label>
                      <input
                        id="university"
                        type="text"
                        list="profile-universities"
                        value={profile.university}
                        onChange={(e) => handleInputChange("university", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your university"
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                      <datalist id="profile-universities">
                        {universitySuggestions.map((u) => (
                          <option key={u} value={u} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="major" className="text-gray-700 font-medium flex items-center text-sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Major
                      </label>
                      <input
                        id="major"
                        type="text"
                        list="profile-majors"
                        value={profile.major}
                        onChange={(e) => handleInputChange("major", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your major"
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                      <datalist id="profile-majors">
                        {majorSuggestions.map((m) => (
                          <option key={m} value={m} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="year" className="text-gray-700 font-medium flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Year
                      </label>
                      <select
                        id="year"
                        value={profile.year}
                        onChange={(e) => handleInputChange("year", e.target.value)}
                        disabled={!isEditing}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      >
                        <option value="">Select year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                        {profile.year && !years.includes(profile.year) && (
                          <option value={profile.year}>{profile.year}</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-gray-700 font-medium text-sm">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell fellow students what you're studying and your study goals..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm block">
                      Subjects of Interest
                    </label>
                    {subjects.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Join study groups to automatically populate your active subjects here.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((subject) => (
                          <span
                            key={subject.id}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                          >
                            {subject.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Groups Tab Content */}
            {activeTab === "groups" && (
              <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">My Study Groups</h2>
                  <Link
                    to="/groups"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    Browse All
                  </Link>
                </div>
                <div className="p-6">
                  {groups.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">You haven&apos;t joined any study groups yet.</p>
                      <Link
                        to="/groups"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        Find a Study Group
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groups.map((group) => (
                        <div
                          key={group.id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-semibold text-gray-800">{group.title}</h3>
                              <p className="text-gray-600 text-sm">{group.subject}</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 shrink-0">
                              <Users className="w-4 h-4 mr-1" />
                              {group.currentMembers}/{group.maxMembers} members
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Achievements Tab Content */}
            {activeTab === "achievements" && (
              <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-5 border rounded-xl text-center transition-colors ${
                          achievement.unlocked
                            ? "border-purple-200 bg-purple-50/40"
                            : "border-gray-200 bg-gray-50 opacity-60"
                        }`}
                      >
                        <Trophy
                          className={`w-8 h-8 mx-auto mb-2 ${
                            achievement.unlocked ? "text-yellow-500" : "text-gray-400"
                          }`}
                        />
                        <h3 className="font-semibold text-gray-800 mb-1">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            achievement.unlocked
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {achievement.unlocked ? "Unlocked" : "Locked"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab Content */}
            {activeTab === "settings" && (
              <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
                </div>
                <div className="p-6 space-y-8">
                  {/* Change Password Form */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
                    </div>

                    {passwordStatus.text && (
                      <div
                        className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                          passwordStatus.type === "error"
                            ? "bg-red-50 border border-red-200 text-red-700"
                            : "bg-green-50 border border-green-200 text-green-700"
                        }`}
                      >
                        {passwordStatus.text}
                      </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                      <div>
                        <label
                          htmlFor="oldPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Current Password
                        </label>
                        <input
                          id="oldPassword"
                          type="password"
                          required
                          value={passwordForm.oldPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
                          }
                          className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          required
                          minLength={6}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                          }
                          className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          required
                          minLength={6}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-60 cursor-pointer flex items-center"
                      >
                        {isChangingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isChangingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">Sign Out</h3>
                      <p className="text-sm text-gray-600">Sign out of your StudySync session</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => authService.logout()}
                      className="inline-flex items-center px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
