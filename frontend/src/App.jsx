import React from 'react'
import HomePage from './components/HomePage'
import GenerateId from './components/AdminPages/GenerateId'
import AttendanceManagement from './components/AdminPages/AttendanceManagement'
import UserManagement from './components/AdminPages/UserManagement'
import CourseManagement from './components/AdminPages/CourseManagement'
import CourseDetails from './components/AdminPages/CourseDetails'
import StudentAttendance from './components/StudentPages/StudentAttendance'
import StudentCourse from './components/StudentPages/StudentCourse'
import QRScanner from './components/QRScanner'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentHome from './components/StudentHome';
import AdminHome from './components/AdminHome';
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<HomePage/>}></Route>
        {/* Role Based Home Routes */}
        <Route path = "/student" element={
          <ProtectedRoute requiredRole="student">
            <StudentHome/>
          </ProtectedRoute>
        }></Route>
        <Route path = "/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminHome/>
          </ProtectedRoute>
        }></Route>
        {/* Admin Routes */}
        <Route path = "/admin/login" element={
          <ProtectedRoute requiredRole="admin">
            <GenerateId/>
          </ProtectedRoute>
        }></Route>
        <Route path = "/admin/attendance" element={
          <ProtectedRoute requiredRole="admin">
            <AttendanceManagement/>
          </ProtectedRoute>
        }></Route>
        <Route path = "/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement/>
          </ProtectedRoute>
        }></Route>
        <Route path = "/admin/courses" element={
          <ProtectedRoute requiredRole="admin">
            <CourseManagement/>
          </ProtectedRoute>
        }></Route>
        <Route path = "/admin/courses/:courseId" element={
          <ProtectedRoute requiredRole="admin">
            <CourseDetails/>
          </ProtectedRoute>
        }></Route>
        {/* Student Routes */}
        <Route path = "/student/attendance" element={
          <ProtectedRoute requiredRole="student">
            <StudentAttendance/>
          </ProtectedRoute>
        }></Route>
        <Route path = "/student/course" element={
          <ProtectedRoute requiredRole="student">
            <StudentCourse/>
          </ProtectedRoute>
        }></Route>
        {/* Student/Public Attendance Routes */}
        <Route path = "/attendance/:sessionId" element={
          <ProtectedRoute>
            <QRScanner/>
          </ProtectedRoute>
        }></Route>
        <Route path = "/attendance" element={
          <ProtectedRoute>
            <QRScanner/>
          </ProtectedRoute>
        }></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
