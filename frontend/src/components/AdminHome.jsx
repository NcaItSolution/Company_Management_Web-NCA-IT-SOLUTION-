import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const cardData = [
  {
    title: "User Management",
    description: "Create and manage student and admin accounts",
    bgColor: "from-blue-100 to-blue-200",
    textColor: "text-blue-800",
    link: "/admin/users"
  },
  {
    title: "Course Management",
    description: "Add, edit, and organize courses",
    bgColor: "from-green-100 to-green-200",
    textColor: "text-green-800",
    link: "/admin/courses"
  },
  {
    title: "Reports",
    description: "View system analytics and reports",
    bgColor: "from-purple-100 to-purple-200",
    textColor: "text-purple-800",
    link: "/admin/reports"
  },
  {
    title: "Settings",
    description: "Configure system preferences",
    bgColor: "from-yellow-100 to-yellow-200",
    textColor: "text-yellow-800",
    link: "/admin/settings"
  },
  {
    title: "Generate IDs",
    description: "Create new user identification",
    bgColor: "from-indigo-100 to-indigo-200",
    textColor: "text-indigo-800",
    link: "/admin/login"
  },
  {
    title: "Notifications",
    description: "Send announcements to users",
    bgColor: "from-pink-100 to-pink-200",
    textColor: "text-pink-800",
    link: "/admin/notifications"
  },
];

const AdminHome = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = authService.getUserInfo();
    setUserInfo(user);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-grow">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-blue-900">Admin Dashboard</h1>
              {userInfo && (
                <p className="text-gray-600 mt-2">
                  Welcome back, Administrator <span className="font-medium">{userInfo.userId}</span>!
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex-grow flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Administration Panel</h2>
          <p className="text-gray-600 mb-6">Quick access to system modules and management tools.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
            {cardData.map((card, index) => (
              <Link
                to={card.link}
                key={index}
                className={`bg-gradient-to-br ${card.bgColor} hover:scale-105 transform transition duration-300 rounded-xl p-6 shadow-md hover:shadow-lg flex flex-col justify-between`}
              >
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${card.textColor}`}>{card.title}</h3>
                  <p className="text-gray-700">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
