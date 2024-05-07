import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.jsx";
import Login from "./components/LoginPage.jsx";
import Home from "./components/home.jsx";
import Preferences from "./components/Preferences.jsx";
import { AuthProvider } from './components/AuthContext'; // Ensure this path is correct

axios.defaults.withCredentials = true; // Set axios to send credentials with every request

const About = () => {
  return <h1>About Page</h1>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
