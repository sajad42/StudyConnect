import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Clock, MapPin, ChevronDown, Tag, Loader2 } from "lucide-react";
import { getSubjects, createGroup } from "../api/groupServices";
import { authService } from "../api/authservice";
import Navbar from "../Components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatLocalDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:00`;
};

const CustomSelect = ({
  placeholder,
  options,
  value,
  onChange,
  dropdownKey,
  openDropdown,
  setOpenDropdown,
  required,
}) => {
  const isOpen = openDropdown === dropdownKey;
  const selectedOption = options.find((opt) => (opt.value || opt.name) === value);

  return (
    <div className="relative">
      {required && (
        <select
          required
          value={value || ""}
          onChange={() => {}}
          className="absolute inset-0 opacity-0 pointer-events-none"
          tabIndex={-1}
          aria-hidden="true"
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
        className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer"
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-500"}>
          {selectedOption ? selectedOption.label || selectedOption.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((option, index) => (
              <button
                key={option.id || option.value || index}
                type="button"
                onClick={() => {
                  onChange(option.value || option.name);
                  setOpenDropdown(null);
                }}
                className="w-full px-4 py-3 text-left hover:bg-purple-50 text-gray-700 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
              >
                {option.label || option.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    maxMembers: "",
    meetingDateTime: null,
    location: "",
    isOnline: false,
    tagsInput: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const memberOptions = [
    { value: "3", label: "3 members" },
    { value: "5", label: "5 members" },
    { value: "8", label: "8 members" },
    { value: "10", label: "10 members" },
    { value: "15", label: "15 members" },
    { value: "25", label: "25 members" },
  ];

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchSubjects = async () => {
      try {
        const resp = await getSubjects();
        setSubjects(Array.isArray(resp) ? resp : []);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setError("Could not load subjects. Please refresh the page.");
      }
    };

    fetchSubjects();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.subject) {
      setError("Please select a subject.");
      return;
    }
    if (!formData.maxMembers) {
      setError("Please select the maximum number of members.");
      return;
    }
    if (!formData.meetingDateTime) {
      setError("Please choose a date and time for your first study session.");
      return;
    }

    const parsedTags = formData.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const groupData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      subject: formData.subject,
      maxMembers: parseInt(formData.maxMembers, 10),
      tags: parsedTags,
      sessionTitle: formData.title.trim(),
      sessionDateTime: formatLocalDateTime(formData.meetingDateTime),
      sessionLocation: formData.location.trim(),
      isOnline: Boolean(formData.isOnline),
    };

    setIsSubmitting(true);
    try {
      await createGroup(groupData);
      navigate("/groups");
    } catch (err) {
      setError(err.message || "Failed to create study group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Study Group</h1>
            <p className="text-gray-600">
              Start a new study group and connect with fellow students
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Group Details</h2>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-gray-700 font-medium">
                  Group Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., Calculus II Midterm Prep"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>

              {/* Subject & Max Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Subject</label>
                  <CustomSelect
                    placeholder="Select a subject"
                    options={subjects}
                    value={formData.subject}
                    onChange={(value) => handleInputChange("subject", value)}
                    dropdownKey="subject"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Users className="w-4 h-4 mr-2" />
                    Max Members
                  </label>
                  <CustomSelect
                    placeholder="Select size"
                    options={memberOptions}
                    value={formData.maxMembers}
                    onChange={(value) => handleInputChange("maxMembers", value)}
                    dropdownKey="maxMembers"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    required
                  />
                </div>
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

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="flex items-center text-gray-700 font-medium">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags <span className="text-gray-400 text-sm font-normal ml-1">(optional, comma-separated)</span>
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="e.g., Midterm, Problem Solving, Weekly"
                  value={formData.tagsInput}
                  onChange={(e) => handleInputChange("tagsInput", e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Meeting Schedule */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  First Session Date &amp; Time
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <DatePicker
                      selected={formData.meetingDateTime}
                      onChange={(date) => handleInputChange("meetingDateTime", date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Select date and time"
                      wrapperClassName="w-full"
                      className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                      required
                    />
                  </div>
                  <label className="flex items-center space-x-2 text-gray-700 whitespace-nowrap cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOnline}
                      onChange={(e) => handleInputChange("isOnline", e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="font-medium">Online session</span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="flex items-center text-gray-700 font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  {formData.isOnline ? "Meeting Link (Zoom / Google Meet)" : "Location"}
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder={
                    formData.isOnline ? "e.g., https://zoom.us/j/123456789" : "e.g., Library Room 204"
                  }
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/groups")}
                  className="flex-1 h-12 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Group"
                  )}
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
