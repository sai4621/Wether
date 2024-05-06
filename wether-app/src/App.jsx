import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.jsx";
import Login from "./components/LoginPage.jsx";
import Home from "./components/home.jsx";
import Preferences from "./components/Preferences.jsx";
import { AuthProvider } from './components/AuthContext'; // Ensure this path is correct

const About = () => {
  return <h1>About Page</h1>;
};

// App component should only setup the Router and AuthProvider
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
