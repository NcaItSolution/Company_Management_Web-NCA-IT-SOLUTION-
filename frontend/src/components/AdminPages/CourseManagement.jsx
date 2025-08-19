import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';

const CourseManagement = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: ''
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(''); // Clear previous errors
            const response = await courseService.getAllCourses();
            setCourses(response.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            
            // Handle authentication errors specifically
            if (error.message.includes('Invalid token') || error.message.includes('authentication token')) {
                setError('Your session has expired. Please login again.');
                // Optionally redirect to login
                // navigate('/');
            } else {
                setError(error.message || 'Failed to fetch courses');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!newCourse.title || !newCourse.description) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setError(''); // Clear previous errors
            console.log('Creating course with data:', newCourse);
            
            const response = await courseService.createCourse(newCourse);
            console.log('Course created successfully:', response);
            
            setShowCreateModal(false);
            setNewCourse({ title: '', description: '' });
            
            // Refresh courses list
            await fetchCourses();
            
            // Show success message
            alert('Course created successfully!');
        } catch (error) {
            console.error('Error creating course:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            
            // Show more specific error messages
            if (error.message.includes('authentication')) {
                setError('Your session has expired. Please login again.');
            } else if (error.message.includes('required')) {
                setError('Please fill in all required fields properly.');
            } else {
                setError(error.message || 'Failed to create course. Please try again.');
            }
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        try {
            await courseService.deleteCourse(courseId);
            setCourses(courses.filter(course => course._id !== courseId));
            alert('Course deleted successfully!');
        } catch (error) {
            setError(error.message || 'Failed to delete course');
            console.error('Error deleting course:', error);
        }
    };

    const handleViewCourse = (course) => {
        setSelectedCourse(course);
        navigate(`/admin/courses/${course._id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center space-x-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-lg text-gray-700">Loading courses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-blue-900">Course Management</h1>
                            <p className="text-gray-600 mt-2">Create and manage courses, lectures, assignments, and notes</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-4">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
                            >
                                + Create Course
                            </button>
                            <button
                                onClick={() => navigate('/admin')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Courses Grid */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Courses</h2>
                    
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-medium text-gray-600 mb-2">No courses found</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first course</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-200"
                            >
                                Create Your First Course
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div key={course._id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-200">
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-700 mb-4 line-clamp-3">{course.description}</p>
                                    
                                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                                        <span>📚 {course.lectures?.length || 0} Lectures</span>
                                        <span>📝 {course.assignments?.length || 0} Assignments</span>
                                        <span>📄 {course.notes?.length || 0} Notes</span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewCourse(course)}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                                        >
                                            Manage
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourse(course._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Course Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Course</h2>
                            
                            <form onSubmit={handleCreateCourse}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newCourse.title}
                                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter course title"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Description *
                                    </label>
                                    <textarea
                                        value={newCourse.description}
                                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Enter course description"
                                        required
                                    />
                                </div>
                                
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setNewCourse({ title: '', description: '' });
                                            setError('');
                                        }}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Create Course
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseManagement;
