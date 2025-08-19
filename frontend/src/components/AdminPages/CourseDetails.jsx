import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('lectures');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'lecture', 'assignment', 'note'
    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        file: null
    });

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const response = await courseService.getCourseById(courseId);
            setCourse(response.course);
        } catch (error) {
            setError('Failed to fetch course details');
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
        setUploadData({ title: '', description: '', file: null });
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (50MB limit)
            if (file.size > 50 * 1024 * 1024) {
                setError('File size must be less than 50MB');
                return;
            }
            
            // Check file type
            const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.mp4', '.webp'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
            
            if (!allowedTypes.includes(fileExtension)) {
                setError('File type not supported. Allowed: JPG, JPEG, PNG, PDF, MP4, WEBP');
                return;
            }
            
            setUploadData({ ...uploadData, file });
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!uploadData.title || !uploadData.description) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            let response;
            switch (modalType) {
                case 'lecture':
                    response = await courseService.addLecture(courseId, uploadData);
                    break;
                case 'assignment':
                    response = await courseService.addAssignment(courseId, uploadData);
                    break;
                case 'note':
                    response = await courseService.addNotes(courseId, uploadData);
                    break;
                default:
                    throw new Error('Invalid modal type');
            }

            console.log(`${modalType} added:`, response);
            setShowModal(false);
            setUploadData({ title: '', description: '', file: null });
            setError('');
            fetchCourse(); // Refresh course data
            alert(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} added successfully!`);
        } catch (error) {
            setError(error.message || `Failed to add ${modalType}`);
            console.error(`Error adding ${modalType}:`, error);
        }
    };

    // Delete handlers
    const handleDeleteLecture = async (lectureId) => {
        if (!window.confirm('Are you sure you want to delete this lecture?')) return;
        try {
            await courseService.deleteLecture(courseId, lectureId);
            fetchCourse();
        } catch (error) {
            setError(error.message || 'Failed to delete lecture');
        }
    };
    const handleDeleteAssignment = async (assignmentId) => {
        if (!window.confirm('Are you sure you want to delete this assignment?')) return;
        try {
            await courseService.deleteAssignment(courseId, assignmentId);
            fetchCourse();
        } catch (error) {
            setError(error.message || 'Failed to delete assignment');
        }
    };
    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await courseService.deleteNote(courseId, noteId);
            fetchCourse();
        } catch (error) {
            setError(error.message || 'Failed to delete note');
        }
    };

    const getTabContent = () => {
        if (!course) return null;

        const data = course[activeTab] || [];
        const itemType = activeTab.slice(0, -1); // Remove 's' from end

        if (data.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">
                        {activeTab === 'lectures' ? '🎥' : activeTab === 'assignments' ? '📝' : '📄'}
                    </div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                        No {activeTab} found
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Add your first {itemType} to get started
                    </p>
                    <button
                        onClick={() => handleOpenModal(itemType)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-200"
                    >
                        Add {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-200 relative">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-between">
                            {item.title}
                            {/* Delete icon/button */}
                            {activeTab === 'lectures' && (
                                <button title="Delete Lecture" onClick={() => handleDeleteLecture(item._id)} className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold">✖</button>
                            )}
                            {activeTab === 'assignments' && (
                                <button title="Delete Assignment" onClick={() => handleDeleteAssignment(item._id)} className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold">✖</button>
                            )}
                            {activeTab === 'notes' && (
                                <button title="Delete Note" onClick={() => handleDeleteNote(item._id)} className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold">✖</button>
                            )}
                        </h3>
                        <p className="text-gray-700 mb-4 line-clamp-3">{item.description}</p>
                        {item[itemType] && item[itemType].secure_url && (
                            <div className="mb-4">
                                <a
                                    href={item[itemType].secure_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 underline"
                                >
                                    View File
                                </a>
                            </div>
                        )}
                        <div className="text-sm text-gray-500">
                            Added: {new Date().toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center space-x-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-lg text-gray-700">Loading course details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
                    <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                        Back to Courses
                    </button>
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
                            <h1 className="text-4xl font-bold text-blue-900">{course.title}</h1>
                            <p className="text-gray-600 mt-2">{course.description}</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/courses')}
                            className="mt-4 md:mt-0 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
                        >
                            Back to Courses
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex">
                            {['lectures', 'assignments', 'notes'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-6 text-sm font-medium ${
                                        activeTab === tab
                                            ? 'border-b-2 border-blue-500 text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)} ({course[tab]?.length || 0})
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Add Button */}
                    <div className="p-6 border-b border-gray-200">
                        <button
                            onClick={() => handleOpenModal(activeTab.slice(0, -1))}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
                        >
                            + Add {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {getTabContent()}
                </div>

                {/* Upload Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                            </h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadData.title}
                                        onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Enter ${modalType} title`}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={uploadData.description}
                                        onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder={`Enter ${modalType} description`}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        File (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        accept=".jpg,.jpeg,.png,.pdf,.mp4,.webp"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Supported formats: JPG, JPEG, PNG, PDF, MP4, WEBP (Max: 50MB)
                                    </p>
                                </div>
                                
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setUploadData({ title: '', description: '', file: null });
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
                                        Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
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

export default CourseDetails;
