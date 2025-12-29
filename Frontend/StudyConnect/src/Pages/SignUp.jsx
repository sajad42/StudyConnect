import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Mail, Lock, User, GraduationCap } from "lucide-react";
import { authService } from "../api/authservice";

export default function SignUp() {

    const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    university: "",
    major: "",
    year: ""
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration attempt:", formData);
    authService.register(formData)
      .then(() => {
        console.log("Registration successful");
        // navigate("/login");
        navigate("/dashboard");
      })
      .catch(error => {
        console.error("Registration failed:", error);
      })
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              StudySync
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <div className="text-center pb-6 pt-8 px-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Join StudySync
            </h1>
            <p className="text-gray-600">
              Start your collaborative learning journey today
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-gray-700 font-medium text-sm block">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-10 h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-gray-700 font-medium text-sm block">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="pl-10 h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-700 font-medium text-sm block">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                    required
                  />
                </div>
              </div>

              {/* University */}
              <div className="space-y-2">
                <label htmlFor="university" className="text-gray-700 font-medium text-sm block">
                  University
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                  <select
                    id="university"
                    value={formData.university}
                    onChange={(e) => handleInputChange("university", e.target.value)}
                    className="pl-10 h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 appearance-none"
                    required
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

              {/* Major and Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="major" className="text-gray-700 font-medium text-sm block">
                    Major
                  </label>
                  <select
                    id="major"
                    value={formData.major}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 appearance-none"
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
                  <label htmlFor="year" className="text-gray-700 font-medium text-sm block">
                    Year
                  </label>
                  <select
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 appearance-none"
                    required
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-700 font-medium text-sm block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                Create Account
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-500 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}