import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.jsx";
import Login from "./components/LoginPage.jsx";
import Home from "./components/home.jsx";
import Preferences from "./components/Preferences.jsx";
import CityData from "./components/CityData.jsx"; // Ensure the correct path
import { AuthProvider } from './components/AuthContext'; // Ensure this path is correct

axios.defaults.withCredentials = true; // Set axios to send credentials with every request

const About = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>About WeatherApp</h1>
      <p>
        Welcome to WeatherApp! Our application provides real-time weather data and forecasts for any location worldwide. Whether you're planning your day, your week, or a vacation, WeatherApp has you covered.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Real-time weather updates</li>
        <li>5-day weather forecasts</li>
        <li>Search for weather data by city name or zip code</li>
        <li>Automatically detects your current location for weather updates</li>
        <li>Save your favorite locations for quick access</li>
        <li>Clothing recommendations based on the current weather</li>
        <li>User authentication to personalize your experience</li>
      </ul>
      <h2>Technologies Used</h2>
      <p>
        WeatherApp is built using the following technologies:
      </p>
      <ul>
        <li>React - for the front-end user interface</li>
        <li>Flask - for the back-end server</li>
        <li>SQL Database - for storing user preferences and location data</li>
        <li>OpenWeatherMap API - for fetching weather data</li>
        <li>Axios - for making HTTP requests</li>
      </ul>
      <h2>Our Mission</h2>
      <p>
        Our mission is to provide users with accurate and timely weather information, helping them make informed decisions and stay prepared for any weather conditions. We aim to create an intuitive and user-friendly platform that anyone can use with ease.
      </p>
    </div>
  );
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
          <Route path="/city/:cityName" element={<CityData />} /> {/* Add this route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
