
const API_BASE_URL = 'https://company-management-web-nca-it-solution.onrender.com/api';

class CourseService {

    // Student: Get their registered course and content
    async getMyCourse() {
        try {
            const response = await fetch(`${API_BASE_URL}/student/my-course`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch course');
            }
            return data;
        } catch (error) {
            console.error('Error fetching student course:', error);
            throw error;
        }
    }

    // Delete lecture
    async deleteLecture(courseId, lectureId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/deleteLecture/${courseId}/${lectureId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete lecture');
            }
            return data;
        } catch (error) {
            console.error('Error deleting lecture:', error);
            throw error;
        }
    }

    // Delete assignment
    async deleteAssignment(courseId, assignmentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/deleteAssignment/${courseId}/${assignmentId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete assignment');
            }
            return data;
        } catch (error) {
            console.error('Error deleting assignment:', error);
            throw error;
        }
    }

    // Delete note
    async deleteNote(courseId, noteId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/deleteNote/${courseId}/${noteId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete note');
            }
            return data;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }
    // Helper method to get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }
        
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Helper method to get auth headers for form data
    getAuthHeadersForFormData() {
        const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
        return {
            'Authorization': `Bearer ${token}`
        };
    }

    // Create a new course
    async createCourse(courseData) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/create-course`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(courseData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create course');
            }

            return data;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }

    // Get all courses
    async getAllCourses() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/courses`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch courses');
            }

            return data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    }

    // Get course by ID
    async getCourseById(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/course/${courseId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch course');
            }

            return data;
        } catch (error) {
            console.error('Error fetching course:', error);
            throw error;
        }
    }

    // Add lecture to course
    async addLecture(courseId, lectureData) {
        try {
            const formData = new FormData();
            formData.append('title', lectureData.title);
            formData.append('description', lectureData.description);
            if (lectureData.file) {
                formData.append('lecture', lectureData.file);
            }

            const response = await fetch(`${API_BASE_URL}/admin/addLecture/${courseId}`, {
                method: 'POST',
                headers: this.getAuthHeadersForFormData(),
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add lecture');
            }

            return data;
        } catch (error) {
            console.error('Error adding lecture:', error);
            throw error;
        }
    }

    // Add assignment to course
    async addAssignment(courseId, assignmentData) {
        try {
            const formData = new FormData();
            formData.append('title', assignmentData.title);
            formData.append('description', assignmentData.description);
            if (assignmentData.file) {
                formData.append('assignment', assignmentData.file);
            }

            const response = await fetch(`${API_BASE_URL}/admin/addAssignments/${courseId}`, {
                method: 'POST',
                headers: this.getAuthHeadersForFormData(),
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add assignment');
            }

            return data;
        } catch (error) {
            console.error('Error adding assignment:', error);
            throw error;
        }
    }

    // Add notes to course
    async addNotes(courseId, notesData) {
        try {
            const formData = new FormData();
            formData.append('title', notesData.title);
            formData.append('description', notesData.description);
            if (notesData.file) {
                formData.append('note', notesData.file);
            }

            const response = await fetch(`${API_BASE_URL}/admin/addNotes/${courseId}`, {
                method: 'POST',
                headers: this.getAuthHeadersForFormData(),
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add notes');
            }

            return data;
        } catch (error) {
            console.error('Error adding notes:', error);
            throw error;
        }
    }

    // Delete course
    async deleteCourse(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/course/${courseId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete course');
            }

            return data;
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }


    // Delete lecture
    async deleteLecture(courseId, lectureId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/deleteLecture/${courseId}/${lectureId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete lecture');
            }
            return data;
        } catch (error) {
            console.error('Error deleting lecture:', error);
            throw error;
        }
    }

    // Delete assignment
    async deleteAssignment(courseId, assignmentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/deleteAssignment/${courseId}/${assignmentId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete assignment');
            }
            return data;
        } catch (error) {
            console.error('Error deleting assignment:', error);
            throw error;
        }
    }

    // Delete note
    async deleteNote(courseId, noteId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/deleteNote/${courseId}/${noteId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete note');
            }
            return data;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }

    // Update course
    async updateCourse(courseId, courseData) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/course/${courseId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(courseData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update course');
            }

            return data;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    }
}

export const courseService = new CourseService();
