import React, { useEffect, useState } from 'react';
import { courseService } from '../../services/courseService';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const StudentCourse = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await courseService.getMyCourse();
        if (!res.success || !res.course) {
          setError(res.message || 'No course assigned. Please contact your admin.');
          setCourse(null);
        } else {
          setCourse(res.course);
        }
      } catch (err) {
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading course details...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }
  if (!course) {
    return <div className="p-8 text-center">No course found.</div>;
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
  <div className="max-w-7xl mx-auto">
    
    {/* Course Header */}
    <div className="bg-white rounded-2xl shadow-xl p-10 mb-10 relative">
      {/* Back Button (Top Right) */}
      <button
        onClick={() => navigate('/student')}
        className="absolute top-6 right-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-4xl font-extrabold text-blue-900 mb-4">{course.title}</h1>
      <p className="text-lg text-gray-700 max-w-7xl mx-auto">
        {course.description}
      </p>
    </div>

    {/* Grid for Lectures, Assignments, Notes */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Lectures */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300 border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">📚 Lectures</h2>
        {course.lectures && course.lectures.length > 0 ? (
          <ul className="space-y-4">
            {course.lectures.map((lecture) => (
              <li 
                key={lecture._id} 
                className="border rounded-lg p-4 bg-gray-50 hover:bg-blue-50 transition duration-200"
              >
                <h3 className="text-lg font-semibold text-blue-800">{lecture.title}</h3>
                <p className="text-gray-600 mb-2">{lecture.description}</p>
                {lecture.lecture?.secure_url && (
                  <a 
                    href={lecture.lecture.secure_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 font-medium hover:underline"
                  >
                    📄 View File
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No lectures available.</p>
        )}
      </div>

      {/* Assignments */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300 border-t-4 border-green-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">📝 Assignments</h2>
        {course.assignments && course.assignments.length > 0 ? (
          <ul className="space-y-4">
            {course.assignments.map((assignment) => (
              <li 
                key={assignment._id} 
                className="border rounded-lg p-4 bg-gray-50 hover:bg-green-50 transition duration-200"
              >
                <h3 className="text-lg font-semibold text-green-800">{assignment.title}</h3>
                <p className="text-gray-600 mb-2">{assignment.description}</p>
                {assignment.assignment?.secure_url && (
                  <a 
                    href={assignment.assignment.secure_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-green-600 font-medium hover:underline"
                  >
                    📄 View File
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No assignments available.</p>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300 border-t-4 border-purple-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">🗒️ Notes</h2>
        {course.notes && course.notes.length > 0 ? (
          <ul className="space-y-4">
            {course.notes.map((note) => (
              <li 
                key={note._id} 
                className="border rounded-lg p-4 bg-gray-50 hover:bg-purple-50 transition duration-200"
              >
                <h3 className="text-lg font-semibold text-purple-800">{note.title}</h3>
                <p className="text-gray-600 mb-2">{note.description}</p>
                {note.note?.secure_url && (
                  <a 
                    href={note.note.secure_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-purple-600 font-medium hover:underline"
                  >
                    📄 View File
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notes available.</p>
        )}
      </div>

    </div>
  </div>
</div>

  );
};

export default StudentCourse;
