import React, { useState } from "react";

const GenerateId = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  });

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setFormData({ loginId: "", password: "" }); // reset fields
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      role: selectedRole,
    };
    console.log("Creating user:", payload);
    // Submit to backend here
  };

  return (
    <div className="flex w-full min-h-screen items-start p-10 bg-gray-100">
      
      {/* Left Column */}
      <div className="w-1/3 p-5 space-y-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Generate ID For:</h2>
        <button
          onClick={() => handleRoleSelection("admin")}
          className={`w-full py-3 rounded-lg border text-lg font-medium ${
            selectedRole === "admin"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-blue-100"
          }`}
        >
          Generate for Admin
        </button>
        <button
          onClick={() => handleRoleSelection("student")}
          className={`w-full py-3 rounded-lg border text-lg font-medium ${
            selectedRole === "student"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-blue-100"
          }`}
        >
          Generate for Student
        </button>
      </div>

      {/* Right Column */}
      <div className="w-2/3 p-5">
        {selectedRole && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-xl p-6 max-w-md"
          >
            <h3 className="text-2xl font-bold mb-4">
              Create {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </h3>

            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Set Login ID</label>
              <input
                type="text"
                name="loginId"
                value={formData.loginId}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Set Login Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Create
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GenerateId;
