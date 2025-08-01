import React from 'react'
import HomePage from './components/HomePage'
import GenerateId from './components/AdminPages/GenerateId'
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
