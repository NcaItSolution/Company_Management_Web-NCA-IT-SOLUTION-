import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const cardData = [
  {
    title: 'My Courses',
    description: 'View your registered course and all its lectures, assignments, and notes',
    bgColor: 'from-green-100 to-green-200',
    textColor: 'text-green-800',
    link: '/student/course',
  },
  {
    title: 'Assignments',
    description: 'Check upcoming assignments and submissions',
    bgColor: 'from-blue-100 to-blue-200',
    textColor: 'text-blue-800',
    link: '/student/assignments',
  },
  {
    title: 'Grades',
    description: 'View your academic performance',
    bgColor: 'from-purple-100 to-purple-200',
    textColor: 'text-purple-800',
    link: '/student/grades',
  },
  {
    title: 'Attendance',
    description: 'Mark attendance and view your attendance history',
    bgColor: 'from-pink-100 to-pink-200',
    textColor: 'text-pink-800',
    link: '/student/attendance',
  },
  {
    title: 'Scan QR Code',
    description: 'Quick access to QR code scanner for attendance',
    bgColor: 'from-indigo-100 to-indigo-200',
    textColor: 'text-indigo-800',
    link: '/attendance',
  },
];

const StudentHome = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-grow">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-xl mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-green-900">Student Dashboard</h1>
              {userInfo && (
                <p className="text-gray-600 mt-2">Welcome back, <span className="font-medium">{userInfo.userId}</span>!</p>
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
        <div className="bg-white p-8 rounded-xl shadow-lg flex-grow flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Portal</h2>
          <p className="text-gray-600 mb-6">Access your courses, assignments, and academic information.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
            {cardData.map((card, index) => (
              <Link
                to={card.link}
                key={index}
                className={`bg-gradient-to-br ${card.bgColor} hover:scale-105 transform transition duration-300 rounded-xl p-6 shadow-md hover:shadow-lg flex flex-col justify-between`}
              >
                <h3 className={`text-xl font-bold mb-2 ${card.textColor}`}>{card.title}</h3>
                <p className="text-gray-700">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
