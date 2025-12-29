import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Plus, Users, Clock, MapPin, ChevronDown, Home, BookOpen, User, Bell, MessageCircle, Menu, X } from "lucide-react";
import { getSubjects, createGroup } from "../api/groupServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateGroup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    maxMembers: "",
    meetingDateTime: null,
    location: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Groups", href: "/groups", icon: Users },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Transform the data to match backend expectations
    const groupData = {
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      maxMembers: parseInt(formData.maxMembers), // Convert string to integer
      tags: [], // Add empty tags array
      sessionTitle: formData.title, // Assuming session title is the same as group title
      sessionDateTime: formData.meetingDateTime.toISOString(), // Convert to ISO string
      sessionLocation: formData.location,
      isOnline: formData.isOnline,
    };
    
    createGroup(groupData).then((resp) => {
      console.log(resp);
      navigate("/groups");
    }).catch((error) => {
      console.error("Failed to create group:", error);
    });
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to ${value}`);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
  
      const fetchSubjects = async () => {
        try {
          const resp = await getSubjects();
          console.log(resp);
          setSubjects(resp);
        } catch (error) {
          console.error('Failed to fetch subjects:', error);
        }
    
      };
  
    fetchSubjects();
  
    }, [navigate]);

//   const subjects = [
//     { value: "mathematics", label: "Mathematics" },
//     { value: "physics", label: "Physics" },
//     { value: "chemistry", label: "Chemistry" },
//     { value: "computer-science", label: "Computer Science" },
//     { value: "biology", label: "Biology" },
//     { value: "economics", label: "Economics" },
//     { value: "psychology", label: "Psychology" },
//     { value: "history", label: "History" },
//     { value: "literature", label: "Literature" },
//     { value: "other", label: "Other" }
//   ];

  const memberOptions = [
    { value: "3", label: "3 members" },
    { value: "5", label: "5 members" },
    { value: "8", label: "8 members" },
    { value: "10", label: "10 members" },
    { value: "15", label: "15 members" }
  ];

  const difficultyOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ];

const CustomSelect = ({ id, placeholder, options, value, onChange, dropdownKey, required }) => {
  const isOpen = openDropdown === dropdownKey;
  const selectedOption = options.find(opt => (opt.value || opt.name) === value);
  
  return (
    <div className="relative">
      {/* Hidden select for browser validation */}
      {required && (
        <select
          required
          value={value || ''}
          onChange={() => {}} // Controlled by the custom dropdown
          className="absolute opacity-0 pointer-events-none"
          tabIndex={-1}
        >
          <option value="">Please select</option>
          {options.map((option, index) => (
            <option key={option.id || option.value || index} value={option.value || option.name}>
              {option.label || option.name}
            </option>
          ))}
        </select>
      )}
      
      <button
        type="button"
        onClick={() => setOpenDropdown(isOpen ? null : dropdownKey)}
        className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-500"}>
          {selectedOption ? (selectedOption.label || selectedOption.name) : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={option.id || option.value || index}
              type="button"
              onClick={() => {
                onChange(option.value || option.name);
                setOpenDropdown(null);
              }}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 text-gray-700 first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label || option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};



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
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
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
                <MessageCircle className="w-5 h-5" />
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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Study Group
            </h1>
            <p className="text-gray-600">
              Start a new study group and connect with fellow students
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Group Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-gray-700 font-medium">
                  Group Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., Calculus II Study Group"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-gray-700 font-medium">
                  Subject
                </label>
                <CustomSelect
                  id="subject"
                  placeholder={formData.subject ? formData.subject : "Select a subject"}
                  options={subjects}
                  value={formData.subject}
                  onChange={(value) => handleInputChange("subject", value)}
                  dropdownKey="subject"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-gray-700 font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe what you'll study, goals, and expectations..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full min-h-24 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                  required
                />
              </div>

              {/* Max Members & Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="maxMembers" className="flex items-center text-gray-700 font-medium">
                    <Users className="w-4 h-4 mr-2" />
                    Max Members
                  </label>
                  <CustomSelect
                    id="maxMembers"
                    placeholder="Select size"
                    options={memberOptions}
                    value={formData.maxMembers}
                    onChange={(value) => handleInputChange("maxMembers", value)}
                    dropdownKey="maxMembers"
                    required
                  />
                </div>

                {/* <div className="space-y-2">
                  <label htmlFor="difficulty" className="block text-gray-700 font-medium">
                    Difficulty Level
                  </label>
                  <CustomSelect
                    id="difficulty"
                    placeholder="Select level"
                    options={difficultyOptions}
                    value={formData.difficulty}
                    onChange={(value) => handleInputChange("difficulty", value)}
                    dropdownKey="difficulty"
                  />
                </div> */}
              </div>

              {/* Meeting Schedule */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  Meeting Schedule
                </label>
                <div className="flex items-center justify-between gap-4">
                  <DatePicker
                    selected={formData.meetingDateTime}
                    onChange={(date) => handleInputChange("meetingDateTime", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time"
                    className="w-4/5 h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    required
                  />
                  <label className="flex items-center space-x-2 text-gray-700 whitespace-nowrap mr-8">
                    <input
                      type="checkbox"
                      checked={formData.isOnline || false}
                      onChange={(e) => handleInputChange("isOnline", e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="font-medium">Is it online?</span>
                  </label>
                </div>
              </div>


              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="flex items-center text-gray-700 font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  {formData.isOnline ? "Zoom Link" : "Location"}
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder={formData.isOnline ? "e.g., https://zoom.us/j/123456789" : "e.g., Library Room 204"}
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>


              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/groups")}
                  className="flex-1 h-12 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateGroup;
