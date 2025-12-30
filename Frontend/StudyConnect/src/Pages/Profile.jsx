import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  User, 
  Edit, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Trophy,
  Settings,
  Camera,
  Calendar,
  Home,
  Bell,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { getUserProfile, updateUserProfile, getUserStudyGroups } from "../api/profileServices";

const Profile = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({});
    const [originalProfile, setOriginalProfile] = useState({});
    const [groups, setGroups] = useState([]);


    const navigate = useNavigate();

//   {
//     name: "John Doe",
//     email: "john.doe@university.edu",
//     phone: "+1 (555) 123-4567",
//     major: "Computer Science",
//     year: "Junior",
//     bio: "Passionate computer science student interested in AI and machine learning. Love collaborative studying and helping others understand complex concepts."
//   }

//   get User Profile
  useEffect(() => {
    console.log("from useEffect");
    
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
    }

    const fetchUserProfile = async () => {
        try {
            const resp = await getUserProfile();
            setProfile(resp);
            setOriginalProfile(resp);
        } catch (error) {
            console.error('Failed to fetch User Profile:', error)
        }
    }

    const fetchGroups = async () => {
        try {
            const groups = await getUserStudyGroups();
            console.log("Groups fetched:", groups);
            setGroups(groups);
        } catch (error) {
            console.error('Failed to fetch User Study Groups:', error)
        }
    };

    fetchUserProfile();
    fetchGroups();
    
  }, [navigate]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Groups", href: "/groups", icon: Users },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSave = () => {
    console.log("Saving profile:", profile);
    if (JSON.stringify(profile) !== JSON.stringify(originalProfile)) {
        updateUserProfile(profile);
        setOriginalProfile(profile);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const myGroups = [
    { id: 1, name: "Advanced Algorithms", subject: "Computer Science", members: 8 },
    { id: 2, name: "Calculus III Study Group", subject: "Mathematics", members: 6 },
    { id: 3, name: "Data Structures Workshop", subject: "Computer Science", members: 12 }
  ];

  const subjects = ["Computer Science", "Mathematics", "Physics", "Chemistry"];
  const achievements = [
    { name: "Study Group Creator", description: "Created 5+ study groups" },
    { name: "Active Participant", description: "Attended 50+ study sessions" },
    { name: "Top Contributor", description: "Highly rated by group members" }
  ];

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "groups", label: "Groups", icon: Users },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const universities = [
    { value: "harvard", label: "Harvard University" },
    { value: "mit", label: "MIT" },
    { value: "stanford", label: "Stanford University" },
    { value: "berkeley", label: "UC Berkeley" },
    { value: "oxford", label: "Oxford University" },
    { value: "cambridge", label: "Cambridge University" }
  ];

  const majors = [
    { value: "computer-science", label: "Computer Science" },
    { value: "engineering", label: "Engineering" },
    { value: "business", label: "Business" },
    { value: "medicine", label: "Medicine" },
    { value: "law", label: "Law" },
    { value: "psychology", label: "Psychology" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" }
  ];

  const years = [
    { value: "freshman", label: "Freshman" },
    { value: "sophomore", label: "Sophomore" },
    { value: "junior", label: "Junior" },
    { value: "senior", label: "Senior" },
    { value: "graduate", label: "Graduate" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                StudySync
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
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-purple-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      isActive(item.href)
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-purple-50"
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
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0 bg-white shadow-lg hover:bg-gray-50 border border-gray-200 flex items-center justify-center">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {profile.name}
            </h1>
            <p className="text-gray-600">{profile.major} • {profile.year}</p>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-white text-purple-700 shadow-sm"
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
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Personal Information
                  </h2>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-gray-700 font-medium flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        First Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="name" className="text-gray-700 font-medium flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Last Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                        disabled={true}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="university" className="text-gray-700 font-medium flex items-center text-sm">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        University
                      </label>
                      <div className="relative">
                        <select
                          id="university"
                          value={profile.university}
                          onChange={(e) => handleInputChange("university", e.target.value)}
                          disabled={!isEditing}
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          <option value="">Select your university</option>
                          {universities.map((uni) => (
                            <option key={uni.value} value={uni.value}>
                              {uni.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>


                    <div className="space-y-2">
                      <label htmlFor="major" className="text-gray-700 font-medium flex items-center text-sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Major
                      </label>
                      <select
                        id="major"
                        value={profile.major}
                        onChange={(e) => handleInputChange("major", e.target.value)}
                        disabled={!isEditing}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        required
                    >
                        <option value="">Your major</option>
                        {majors.map((major) => (
                        <option key={major.value} value={major.value}>
                            {major.label}
                        </option>
                        ))}
                    </select>
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
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        required
                    >
                        <option value="">Your year</option>
                        {years.map((year) => (
                        <option key={year.value} value={year.value}>
                            {year.label}
                        </option>
                        ))}
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
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">Subjects of Interest</label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <span 
                          key={subject} 
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Groups Tab Content */}
            {activeTab === "groups" && (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">
                    My Study Groups
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <div 
                        key={group.id} 
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{group.title}</h3>
                            <p className="text-gray-600 text-sm">{group.subject}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            {group.currentMembers} members
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab Content */}
            {activeTab === "achievements" && (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Achievements
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index} 
                        className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                      >
                        <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-800 mb-1">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab Content */}
            {activeTab === "settings" && (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Account Settings
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-800">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive emails about group activities</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-800">Privacy Settings</h3>
                      <p className="text-sm text-gray-600">Control who can see your profile</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                      Manage
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <h3 className="font-medium text-gray-800">Change Password</h3>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                      Change
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
