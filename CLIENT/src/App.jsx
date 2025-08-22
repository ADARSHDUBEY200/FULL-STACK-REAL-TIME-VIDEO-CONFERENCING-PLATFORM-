import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import VideoComponent from './pages/VideoComponent'
import Meeting from './pages/Meeting'
import Home from './pages/Home'
import Authentication from './pages/Authentication/Authentication'
import DashBoard from './pages/DashBoard/DashBoard'
import "./index.css"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Authentication/>}/>
        <Route path='/video' element={<VideoComponent />} />
        <Route path='/video/:id' element={<Meeting/>}/>
        <Route path='/dashboard' element={<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App