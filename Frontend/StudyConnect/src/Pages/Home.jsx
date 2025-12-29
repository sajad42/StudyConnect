import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button"

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
  Globe
} from "lucide-react";

export default function Home() {

      const features = [
        {
        icon: Users,
        title: "Smart Group Matching",
        description: "AI-powered algorithm matches you with compatible study partners based on your subjects, schedule, and learning style.",
        color: "from-purple-500 to-indigo-500"
        },
        {
        icon: Calendar,
        title: "Seamless Scheduling",
        description: "Coordinate study sessions effortlessly with integrated calendar sync and availability matching.",
        color: "from-blue-500 to-cyan-500"
        },
        {
        icon: MessageCircle,
        title: "Real-time Collaboration",
        description: "Chat with your study group, share resources, and collaborate on projects in real-time.",
        color: "from-cyan-500 to-teal-500"
        },
        {
        icon: MapPin,
        title: "Campus Integration",
        description: "Find study spots on campus, book library rooms, and discover the best places to learn together.",
        color: "from-teal-500 to-green-500"
        },
        {
        icon: Star,
        title: "Progress Tracking",
        description: "Track your study goals, celebrate achievements, and build a community of motivated learners.",
        color: "from-orange-500 to-red-500"
        },
        {
        icon: Globe,
        title: "Global Community",
        description: "Connect with students worldwide, join international study groups, and expand your learning network.",
        color: "from-pink-500 to-purple-500"
        }
    ];

    const stats = [
        { number: "50K+", label: "Active Students" },
        { number: "10K+", label: "Study Groups" },
        { number: "500+", label: "Universities" },
        { number: "95%", label: "Success Rate" }
    ];
    return (<>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-white/20 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between items-center h-16">

                    <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-poppins font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        StudySync
                    </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                    <Link to="/login">
                        <button className="text-gray-600 hover:text-purple-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer font-sans">
                        Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 p-2 rounded-md cursor-pointer font-sans">
                        Get Started
                        </button>
                    </Link>
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

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
                    <Link to="/register">
                        <button size="lg" className="rounded-md cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-2 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                        Start Learning Together
                        <ArrowRight className="ml-2 w-5 h-5 inline" />
                        </button>
                    </Link>
                    
                    <button variant="outline" size="lg" className="rounded-md cursor-pointer px-8 py-2 text-lg font-semibold border-2 bg-white border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-colors duration-300 ">
                        Explore Groups
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                        {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                        {stat.label}
                    </div>
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
                Why Students Love <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">StudySync</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the features that make studying more effective, enjoyable, and social
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div key={index} className="rounded-2xl bg-card text-card-foreground shadow-md group hover-lift bg-white backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <div className="text-left p-8">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                        {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                        </p>
                    </div>
                    </div>
                );  
                })}
            </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-2 pb-0">
            <div className="w-full mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6">
                Ready to Transform Your Study Experience?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                Join thousands of students who have already discovered the power of collaborative learning
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                    <button size="lg" className="rounded-md cursor-pointer bg-white text-purple-600 hover:bg-gray-100 px-8 py-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <CheckCircle className="mr-2 mb-1 w-4 h-4 inline" />
                    Sign Up Free
                    </button>
                </Link>
                <Link to="/groups">
                <button variant="outline" size="lg" className="rounded-md cursor-pointer border-2 border-white text-white hover:bg-white hover:text-purple-600 px-6 py-2 text-lg font-semibold">
                    <Zap className="mr-2 mb-1 w-4 h-4 inline" />
                    Explore Now
                </button>
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
                © 2024 StudySync. Empowering students worldwide.
                </p>
            </div>
            </div>
        </footer>
            
        </div>
        </>)
}