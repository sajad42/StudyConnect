import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  MessageCircle,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
} from "lucide-react";
import { authService } from "../api/authservice";

export default function Home() {
  const isAuthenticated = authService.isAuthenticated();

  const features = [
    {
      icon: Users,
      title: "Smart Group Matching",
      description:
        "Find compatible study partners filtered by your academic subjects, schedule, and learning goals.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Calendar,
      title: "Seamless Scheduling",
      description:
        "Schedule study sessions effortlessly with clear date, time, and location or online meeting links.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageCircle,
      title: "Collaborative Learning",
      description:
        "Organize subject-focused groups, tag exam topics, and stay accountable with peers in your courses.",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: MapPin,
      title: "Campus & Online Ready",
      description:
        "Meet at campus libraries and study rooms or host remote Zoom study sessions from anywhere.",
      color: "from-teal-500 to-green-500",
    },
    {
      icon: Star,
      title: "Personal Dashboard",
      description:
        "Track your active study groups, upcoming sessions, and subjects of interest all in one place.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Globe,
      title: "University Community",
      description:
        "Connect with students across majors and universities to expand your academic network.",
      color: "from-pink-500 to-purple-500",
    },
  ];

  const stats = [
    { number: "16+", label: "Academic Subjects" },
    { number: "100%", label: "Free for Students" },
    { number: "Online & IRL", label: "Flexible Sessions" },
    { number: "24/7", label: "Group Access" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/85 backdrop-blur-md border-b border-white/20 shadow-xs z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-poppins font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                StudySync
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/groups"
                    className="text-gray-600 hover:text-purple-600 hover:bg-gray-100 px-3 py-2 rounded-md font-medium transition-colors"
                  >
                    Browse Groups
                  </Link>
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 rounded-md font-medium"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-purple-600 hover:bg-gray-100 px-3 py-2 rounded-md font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 rounded-md font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Find Your
              </span>
              <br />
              <span className="text-gray-800">Study Squad</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with like-minded students, form powerful study groups, and achieve academic excellence together.
              Your perfect study partner is just one click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {isAuthenticated ? "Open My Dashboard" : "Start Learning Together"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                to={isAuthenticated ? "/groups" : "/login"}
                className="inline-flex items-center rounded-lg px-8 py-3 text-lg font-semibold border-2 bg-white text-gray-800 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-colors duration-300"
              >
                Explore Groups
              </Link>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-gray-800 mb-4">
              Why Students Love{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                StudySync
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features that make studying more effective, enjoyable, and social
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl shadow-md group bg-white backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
                >
                  <div className="text-left p-8">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-poppins font-bold mb-6">
              Ready to Transform Your Study Experience?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join students who have already discovered the power of collaborative learning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/create-group" : "/register"}
                className="inline-flex items-center justify-center rounded-lg bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <CheckCircle className="mr-2 w-5 h-5" />
                {isAuthenticated ? "Create a Group" : "Sign Up Free"}
              </Link>
              <Link
                to={isAuthenticated ? "/groups" : "/login"}
                className="inline-flex items-center justify-center rounded-lg border-2 border-white text-white hover:bg-white hover:text-purple-600 px-6 py-3 text-lg font-semibold transition-colors"
              >
                <Zap className="mr-2 w-5 h-5" />
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-poppins font-bold text-xl">StudySync</span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} StudySync. Empowering students worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
