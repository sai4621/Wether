import { useState, useEffect } from 'react';
import Navbar from "./components/navbar.jsx";
import './App.css'; // Ensure your CSS is properly linked

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const apiKey = '7sUh6NAVuaidqDA2A6rh6Y4Y8jJlcqwT';
    const locationId = '348707';
    const currentConditionsUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationId}?apikey=${apiKey}`;
    const forecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationId}?apikey=${apiKey}&metric=true`;

    const fetchWeatherData = async () => {
      try {
        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(currentConditionsUrl),
          fetch(forecastUrl)
        ]);

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        setCurrentWeather(currentData[0]);
        setForecast(forecastData);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  // Attire recommendation function based on temperature
  const recommendAttire = (temperature) => {
    if (temperature < 0) return "thermal layers, a heavy coat, and gloves";
    else if (temperature < 10) return "a coat, and consider a hat and gloves";
    else if (temperature < 20) return "a light jacket or sweater";
    else if (temperature < 30) return "light clothing";
    else return "shorts and a t-shirt";
  };

  return (
    <div className="weather-app-container">
      <Navbar />
      <div className="weather-info">
        {currentWeather && (
          <div className="current-weather">
            <h2>Current Weather</h2>
            <p>{currentWeather.WeatherText}</p>
            <p>Temperature: {currentWeather.Temperature.Metric.Value}°C</p>
            <p>Attire Recommendation: {recommendAttire(currentWeather.Temperature.Metric.Value)}</p>
          </div>
        )}
        {forecast && (
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          {forecast.DailyForecasts.map((day, index) => (
            <div key={index} className="forecast-day">
              <p>Date: {new Date(day.Date).toLocaleDateString()}</p>
              <p>Min: {day.Temperature.Minimum.Value}°C, Max: {day.Temperature.Maximum.Value}°C</p>
              <p>Day: {day.Day.IconPhrase}, Night: {day.Night.IconPhrase}</p>
              <p>Attire for the day: {recommendAttire((day.Temperature.Maximum.Value + day.Temperature.Minimum.Value) / 2)}</p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
