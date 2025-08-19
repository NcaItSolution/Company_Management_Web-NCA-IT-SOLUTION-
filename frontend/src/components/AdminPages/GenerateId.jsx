import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { courseService } from "../../services/courseService";

const GenerateId = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ loginId: "", password: "", courseId: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    setSelectedRole(role);
    setFormData({ loginId: "", password: "", courseId: "" });
    setError('');
    setSuccess('');
    if (role === 'student') {
      setCoursesLoading(true);
      try {
        const res = await courseService.getAllCourses();
        setCourses(res.courses || []);
      } catch (err) {
        setError('Failed to fetch courses');
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.loginId.trim()) {
      setError('Login ID is required');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (selectedRole === 'student' && !formData.courseId) {
      setError('Please select a course for the student');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        userId: formData.loginId.trim(),
        Password: formData.password,
        ...(selectedRole === 'student' ? { courseId: formData.courseId } : {})
      };

      let data;
      if (selectedRole === 'admin') {
        data = await authService.createAdmin(payload);
      } else if (selectedRole === 'student') {
        data = await authService.createStudent(payload);
      }

      if (data.success) {
        setSuccess(data.message);
        setFormData({ loginId: "", password: "" }); // Clear form
        console.log(`${selectedRole} created successfully:`, data);
      } else {
        setError(data.message || `Failed to create ${selectedRole}`);
      }
    } catch (error) {
      console.error(`Error creating ${selectedRole}:`, error);
      setError(error.message || 'Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col p-6">
      {/* Header with Go Back */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition"
        >
          ← Go Back
        </button>
        <h1 className="text-3xl font-bold text-blue-900">Generate Login ID</h1>
        <div className="w-28" /> {/* Empty block to center title */}
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto w-full flex-grow">
        {/* Left Panel - Role Selection */}
        <div className="w-full lg:w-1/3 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Select Role</h2>
          {["admin", "student"].map((role) => (
            <div
              key={role}
              onClick={() => handleRoleSelection(role)}
              className={`cursor-pointer p-5 rounded-xl shadow-md border-2 transition-all duration-300 ${
                selectedRole === role
                  ? "border-blue-600 bg-blue-100 text-blue-800 shadow-lg scale-105"
                  : "border-gray-200 bg-white hover:shadow"
              }`}
            >
              <h3 className="text-lg font-medium capitalize">{role}</h3>
              <p className="text-sm text-gray-600 mt-1">Generate ID for {role}</p>
            </div>
          ))}
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-2/3">
          {selectedRole && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl p-8 space-y-6"
            >
              <h2 className="text-2xl font-semibold text-blue-800">
                {`Create ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account`}
              </h2>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">Login ID</label>
                <input
                  type="text"
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter unique login ID"
                />
                <p className="text-sm text-gray-500 mt-1">Must be unique across the system</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter secure password"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 6 characters required</p>
              </div>

              {/* Course selection for student */}
              {selectedRole === 'student' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Assign Course</label>
                  {coursesLoading ? (
                    <div className="text-gray-500">Loading courses...</div>
                  ) : (
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                      ))}
                    </select>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Student will be registered for this course</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg text-lg font-semibold transition shadow-md ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? 'Creating...' : 'Create ID'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateId;
