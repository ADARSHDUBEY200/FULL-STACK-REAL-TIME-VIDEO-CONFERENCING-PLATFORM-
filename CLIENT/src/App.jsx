import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import VideoComponent from './pages/VideoComponent'
import Meeting from './pages/Meeting'
import Home from './pages/Home'
import DashBoard from './pages/DashBoard/DashBoard'
import "./index.css"
import Signup from './pages/Authentication/Signup'
import Login from './pages/Authentication/Login'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/video' element={<VideoComponent/>} />
        <Route path='/video/:id' element={<Meeting/>}/>
        <Route path='/dashboard' element={<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App