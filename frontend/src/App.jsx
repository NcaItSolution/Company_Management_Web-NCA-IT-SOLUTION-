import React from 'react'
import HomePage from './components/HomePage'
import GenerateId from './components/AdminPages/GenerateId'
import { BrowserRouter, Route, Routes } from "react-router-dom";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<HomePage/>}></Route>
        <Route path = "/admin/login" element={<GenerateId/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
