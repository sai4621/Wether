import { useState, useEffect } from 'react';
import Navbar from "./components/navbar.jsx";
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
   
    const apiUrl = `http://dataservice.accuweather.com/currentconditions/v1/348707?apikey=7sUh6NAVuaidqDA2A6rh6Y4Y8jJlcqwT`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setWeatherData(data[0]);
      })
      .catch(error => console.error("Failed to fetch weather data:", error));
  }, []);

  const recommendAttire = (temperature) => {
    if (temperature < 0) {
      return "Wear thermal layers, a heavy coat, and gloves.";
    } else if (temperature < 10) {
      return "Wear a coat and consider a hat and gloves.";
    } else if (temperature < 20) {
      return "A light jacket or sweater should be sufficient.";
    } else if (temperature < 30) {
      return "Wear light clothing.";
    } else {
      return "Stay cool with shorts and a t-shirt.";
    }
  };

  return (
    <div style={{ backgroundColor: 'skyblue' }}>   
      <Navbar />
      <div className="card" >
        <p>Welcome to Weather</p>
        {weatherData ? (
          <div>
            <p>Weather Status: {weatherData.WeatherText}</p>
            <p>Temperature: {weatherData.Temperature.Metric.Value}°{weatherData.Temperature.Metric.Unit}</p>
            {/* Adding attire recommendation based on the temperature */}
            <p>Recommended Attire: {recommendAttire(weatherData.Temperature.Metric.Value)}</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
