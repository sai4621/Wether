import { useState } from 'react'
import Navbar from "./components/navbar.jsx";

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Welcome to Weather
        </p>
      </div>
      <p className="read-the-docs">
        More to come soon...
      </p>
    </>
  )
}

export default App
