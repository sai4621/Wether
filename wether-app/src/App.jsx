import { useState } from 'react'
import Navbar from "./components/navbar.jsx";


import './App.css'

function App() {
  return (
      <div style={{ backgroundColor: 'skyblue'}}>   
        <Navbar />
        <div className="card" >
          <p>
            Welcome to Weather
          </p>
        </div>
    </div>
  )
}

export default App
