import { useState, useEffect } from 'react';
import Navbar from "./components/navbar.jsx";
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Replace 'YOUR_CITY_ID' with your actual City ID and 'YOUR_API_KEY' with your actual AccuWeather API key
    const apiUrl = `http://dataservice.accuweather.com/currentconditions/v1/348707?apikey=7sUh6NAVuaidqDA2A6rh6Y4Y8jJlcqwT`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Assuming the data contains the information we need
        setWeatherData(data[0]);
      })
      .catch(error => console.error("Failed to fetch weather data:", error));
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div style={{ backgroundColor: 'skyblue'}}>   
      <Navbar />
      <div className="card" >
        <p>Welcome to Weather</p>
        {weatherData ? (
          <div>
            <p>Weather Status: {weatherData.WeatherText}</p>
            <p>Temperature: {weatherData.Temperature.Metric.Value}°{weatherData.Temperature.Metric.Unit}</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
