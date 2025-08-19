import React, { useEffect, useState } from 'react';
import { courseService } from '../../services/courseService';
import { authService } from '../../services/authService';

const StudentCourse = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{course.title}</h1>
          <p className="text-gray-700 mb-4">{course.description}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lectures</h2>
          {course.lectures && course.lectures.length > 0 ? (
            <ul className="space-y-4">
              {course.lectures.map((lecture) => (
                <li key={lecture._id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-bold text-blue-800">{lecture.title}</h3>
                  <p className="text-gray-700 mb-2">{lecture.description}</p>
                  {lecture.lecture && lecture.lecture.secure_url && (
                    <a href={lecture.lecture.secure_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View File</a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No lectures available.</p>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assignments</h2>
          {course.assignments && course.assignments.length > 0 ? (
            <ul className="space-y-4">
              {course.assignments.map((assignment) => (
                <li key={assignment._id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-bold text-blue-800">{assignment.title}</h3>
                  <p className="text-gray-700 mb-2">{assignment.description}</p>
                  {assignment.assignment && assignment.assignment.secure_url && (
                    <a href={assignment.assignment.secure_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View File</a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No assignments available.</p>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notes</h2>
          {course.notes && course.notes.length > 0 ? (
            <ul className="space-y-4">
              {course.notes.map((note) => (
                <li key={note._id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-bold text-blue-800">{note.title}</h3>
                  <p className="text-gray-700 mb-2">{note.description}</p>
                  {note.note && note.note.secure_url && (
                    <a href={note.note.secure_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View File</a>
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
  );
};

export default StudentCourse;
