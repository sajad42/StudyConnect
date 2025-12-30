import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GroupsButton } from '../Components/GroupsButton';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  MapPin, 
  Users,
  Video,
  Star, 
  Heart, 
  MessageCircle, 
  Plus, 
  ChevronDown,
  Menu,
  X,
  Home,
  Calendar,
  Settings,
  LogOut,
  User
} from 'lucide-react';

import { getSubjects, getAllGroups, joinGroup, deleteGroup, leaveGroup } from '../api/groupServices';
import { getUnsplashImage } from '../api/unsplashService';
import { authService } from '../api/authservice';

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupImages, setGroupImages] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(new Set()); // Add this


  
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Groups', href: '/groups', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleJoinGroup = async (groupId, index, group) => {

  try {
    joinGroup(groupId);
    
    setSuccessMessage('Successfully joined the group!');
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    setGroups(prevGroups => 
      prevGroups.map((group, i) => 
        i === index 
          ? { ...group, currentMembers: group.currentMembers + 1 
                    , member: true
          }
          : group
      )
    );
      
  } catch (error) {
    console.error('Failed to join the group:', error);
    setSuccessMessage('Failed to join group. Please try again.');
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  } finally {
    // Remove loading state
    setLoadingGroups(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
      return newSet;
    });
  }
};

  const handleDeteleGroup = async (groupId, index, group) => {

      if ( authService.getUserId() == group.createdBy ){
    // Add loading state
    setLoadingGroups(prev => new Set(prev).add(groupId));
    try {
    deleteGroup(groupId);
    
    setErrorMessage('Successfully Deleted the group!');
    
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
    
    setGroups(prevGroups => 
      prevGroups.filter((_, i) => i !== index)
    );
      
  } catch (error) {
    console.error('Failed to delete the group:', error);
    setErrorMessage('Failed to delete group. Please try again.');
    
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  } finally {
    // Remove loading state
    setLoadingGroups(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
      return newSet;
    });
  }

  } else {
    console.log("You are not the owner of this group");
  }
  };

  const handleLeaveGroup = async (groupId, index, group) => {

      if ( group.member ){
    // Add loading state
    setLoadingGroups(prev => new Set(prev).add(groupId));
    try {
    leaveGroup(groupId);
    
    setSuccessMessage('Successfully Left the group!');
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    setGroups(prevGroups => 
      prevGroups.map((group, i) => {
        if (i === index) {
          return { ...group, currentMembers: group.currentMembers - 1, member: false };
        }
        return group;
      })
    );
      
  } catch (error) {
    console.error('Failed to delete the group:', error);
    setErrorMessage('Failed to delete group. Please try again.');
    
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  } finally {
    // Remove loading state
    setLoadingGroups(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
      return newSet;
    });
  }

  }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const fetchSubjects = async () => {
      try {
        const resp = await getSubjects();
        setSubjects(["All", ...resp.map(({name}) => name)]);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
  
    };

    const fetchGroups = async () => {
      try {
        const resp = await getAllGroups();
    setGroups(resp);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
      
    };
    
    fetchGroups();
    fetchSubjects();

  }, [navigate]);

  // Your existing data and logic
  //const subjects = ["All", "Mathematics", "Computer Science", "Physics", "Chemistry", "Biology", "Literature"];
  // const timeSlots = ["All", "Morning", "Afternoon", "Evening", "Weekend"];

  const mockGroups = [
    {
    id: 1,
      name: "Advanced Calculus Study Circle",
      subject: "Mathematics",
      description: "Weekly sessions covering differential equations, limits, and integration techniques. Perfect for Math 201 students.",
      members: 8,
      maxMembers: 12,
      schedule: "Mon & Wed, 6:00 PM",
      location: "Library Study Room B",
      rating: 4.8,
      tags: ["Math 201", "Calculus", "Problem Solving"],
      difficulty: "Advanced",
      studyStyle: "Group Discussion",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
      organizer: "Sarah Chen"
    },
    {
      id: 2,
      name: "Data Structures & Algorithms",
      subject: "Computer Science",
      description: "Collaborative coding sessions focusing on DSA concepts, leetcode practice, and interview preparation.",
      members: 6,
      maxMembers: 10,
      schedule: "Tue & Thu, 7:00 PM",
      location: "Computer Lab 301",
      rating: 4.9,
      tags: ["CS 150", "Coding", "Interview Prep"],
      difficulty: "Intermediate",
      studyStyle: "Hands-on Practice",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop",
      organizer: "Michael Rodriguez"
    },
    {
      id: 3,
      name: "Organic Chemistry Lab Group",
      subject: "Chemistry",
      description: "Lab report collaboration and reaction mechanism study. Great for CHEM 201 students preparing for exams.",
      members: 5,
      maxMembers: 8,
      schedule: "Fri, 2:00 PM",
      location: "Chemistry Building",
      rating: 4.6,
      tags: ["CHEM 201", "Lab Reports", "Reactions"],
      difficulty: "Intermediate",
      studyStyle: "Lab Work",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop",
      organizer: "Emma Watson"
    },
    {
      id: 4,
      name: "Spanish Conversation Club",
      subject: "Languages",
      description: "Practice conversational Spanish in a friendly, supportive environment. All levels welcome!",
      members: 12,
      maxMembers: 15,
      schedule: "Mon, Wed, Fri, 3:00 PM",
      location: "Language Center",
      rating: 4.7,
      tags: ["Spanish", "Conversation", "Cultural Exchange"],
      difficulty: "All Levels",
      studyStyle: "Discussion",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
      organizer: "Carlos Martinez"
    },
    {
      id: 5,
      name: "Psychology Research Methods",
      subject: "Psychology",
      description: "Collaborative study sessions for PSYC 301. Focus on research design, statistics, and methodology.",
      members: 7,
      maxMembers: 10,
      schedule: "Thu, 4:00 PM",
      location: "Psychology Building",
      rating: 4.5,
      tags: ["PSYC 301", "Research", "Statistics"],
      difficulty: "Advanced",
      studyStyle: "Research Focus",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=200&fit=crop",
      organizer: "Dr. Jennifer Lee"
    },
    {
      id: 6,
      name: "Financial Accounting Study Group",
      subject: "Business",
      description: "Weekly sessions covering financial statements, accounting principles, and exam preparation for ACCT 101.",
      members: 9,
      maxMembers: 12,
      schedule: "Sat, 10:00 AM",
      location: "Business School",
      rating: 4.4,
      tags: ["ACCT 101", "Financial Statements", "Exam Prep"],
      difficulty: "Beginner",
      studyStyle: "Problem Solving",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=200&fit=crop",
      organizer: "David Kim"
    }
    // Add more groups as needed...
  ];

   // Load images only when groups change, not on every filter
  useEffect(() => {
    const loadImagesForGroups = async (groupsToLoad) => {
      const missingImages = groupsToLoad.filter(group => !groupImages[group.id]);
      
      if (missingImages.length === 0) return;
      
      const imagePromises = missingImages.map(async (group) => {
        const imageUrl = await getUnsplashImage(group.title, group.id, 400, 200);
        return { id: group.id, imageUrl };
      });

      const results = await Promise.all(imagePromises);
      const newImages = {};
      results.forEach(result => {
        newImages[result.id] = result.imageUrl;
      });

      setGroupImages(prev => ({ ...prev, ...newImages }));
    };

    if (groups.length > 0) {
      loadImagesForGroups(groups);
    }
  }, [groups]);

  const timeSlots = ["All", "Morning", "Afternoon", "Evening", "Weekend"];

  // Filter function - called during render, no useEffect needed
  const getFilteredGroups = () => {
    return groups.filter(group => {
      const matchesSearch = group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSubject = !selectedSubject || group.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  };

  const filteredGroups = getFilteredGroups();

  

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    StudyConnect
                  </span>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
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
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-all duration-200 w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
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
        <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl p-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 relative">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups, subjects, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>
            
            {/* Subject Select */}
            <div className="relative z-50">
              <button
                onClick={() => { setSubjectOpen(!subjectOpen); setTimeOpen(false); }}
                className="w-full md:w-48 h-12 px-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{selectedSubject || "Subject"}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${subjectOpen ? 'rotate-180' : ''}`} />
              </button>
              {subjectOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setSubjectOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                    {subjects.map(subject => (
                      <button
                        key={subject}
                        onClick={() => { setSelectedSubject(subject === "All" ? "" : subject); setSubjectOpen(false); }}
                        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Time Select */}
            <div className="relative z-50">
              <button
                onClick={() => { setTimeOpen(!timeOpen); setSubjectOpen(false); }}
                className="w-full md:w-48 h-12 px-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{selectedTime || "Time"}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${timeOpen ? 'rotate-180' : ''}`} />
              </button>
              {timeOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setTimeOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => { setSelectedTime(time === "All" ? "" : time); setTimeOpen(false); }}
                        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 px-6 rounded-lg flex items-center justify-center font-medium transition-all">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

          {/* Groups Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group, index) => (
              <div key={group.id} className="hover-lift bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl group cursor-pointer overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={groupImages[group.id] || group.image || '/default-image.jpg'} 
                    alt={group.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(group.difficulty)}`}>
                      {group.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{group.rating}</span>
                    </div>
                  </div> */}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {group.subject}
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Heart className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {group.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {group.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {group.currentMembers}/{group.maxMembers} members
                    </div>
                    
                    {/* Upcoming sessions */}
                    {group.sessions && group.sessions.length > 0 && (
                    <>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Next: {group.sessions[0].title}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(group.sessions[0].dateTime).toLocaleString('en-CA', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        {group.sessions[0].isOnline || group.sessions[0].isOnline == null ? (
                          <>
                            <Video className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-green-600">Online (Zoom)</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 mr-2" />
                            {group.sessions[0].location}
                          </>
                        )}
                      </div>
                    </>
                  )}
                  <div className="flex text-xs text-purple-600 font-medium">
                    {group.sessions ? group.sessions.length : 0} session{group.sessions && group.sessions.length !== 1 ? 's' : ''} scheduled
                  </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {group.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 border border-gray-200 rounded-full text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                    {group.tags.length > 2 && (
                      <span className="px-2 py-1 border border-gray-200 rounded-full text-xs text-gray-600">
                        +{group.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <GroupsButton
                      group={group}
                      index={index}
                      onJoinGroup={(groupId, index) => handleJoinGroup(groupId, index, group)}
                      onLeaveGroup={(groupId, index) => handleLeaveGroup(groupId, index, group)}
                      onDeleteGroup={(groupId, index) => handleDeteleGroup(groupId, index, group)}
                      isLoading={loadingGroups.has(group.id)}
                    />
                  </div>

                  {/* For The Time If I Want To Add A Like Button */}
                  {/* <div className="flex gap-2">
                    <div className="flex gap-2">
                      <GroupsButton
                        group={group}
                        index={index}
                        onJoinGroup={handleJoinGroup}
                        isLoading={loadingGroups.has(group.id)}
                      />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>

          {/* Create Group CTA */}
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Can't Find the Perfect Group?
              </h2>
              <p className="text-purple-100 text-lg mb-6 max-w-2xl mx-auto">
                Create your own study group and invite like-minded students to join your learning journey
              </p>
              <Link
                to="/create-group"
                className="inline-flex items-center bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
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
