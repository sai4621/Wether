import React, { useState, useEffect } from "react";
import "./styles.css";

function Home() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState("New York"); // State to hold the entered city name

  useEffect(() => {
    const apiKey = "7sUh6NAVuaidqDA2A6rh6Y4Y8jJlcqwT";
    const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(
      cityName
    )}`;

    const fetchLocationData = async () => {
      try {
        const locationResponse = await fetch(locationUrl);
        const locationData = await locationResponse.json();
        if (locationData.length > 0) {
          const locationId = locationData[0].Key;
          const currentConditionsUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationId}?apikey=${apiKey}`;
          const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationId}?apikey=${apiKey}&metric=true`;
          const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentConditionsUrl),
            fetch(forecastUrl),
          ]);

          const currentData = await currentResponse.json();
          const forecastData = await forecastResponse.json();

          setCurrentWeather(currentData[0]);
          setForecast(forecastData);
          setLocation(locationData[0]);
        } else {
          // Clear weather data if location not found
          setCurrentWeather(null);
          setForecast(null);
          setLocation(null);
        }
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    fetchLocationData();
  }, [cityName]); // Trigger useEffect when cityName changes

  const handleCityNameChange = (event) => {
    setCityName(event.target.value);
  };

  const recommendAttire = (temperature) => {
    if (temperature < 0) return "thermal layers, a heavy coat, and gloves";
    else if (temperature < 10) return "a coat, and consider a hat and gloves";
    else if (temperature < 20) return "a light jacket or sweater";
    else if (temperature < 30) return "light clothing";
    else return "shorts and a t-shirt";
  };

  return (
    <div className="weather-app-container">
      <div className="location-selector">
        <label htmlFor="city">Enter City Name</label>
        <input
          type="text"
          id="city"
          value={cityName}
          onChange={handleCityNameChange}
        />
      </div>
      <div className="weather-info">
        {location && (
          <div className="location-info">
            <h2>Location</h2>
            <p>City: {location.LocalizedName}</p>
            <p>Country: {location.Country.LocalizedName}</p>
          </div>
        )}
        {currentWeather && (
          <div className="current-weather">
            <h2>Current Weather</h2>
            <p>{currentWeather.WeatherText}</p>
            <p>Temperature: {currentWeather.Temperature.Metric.Value}°C</p>
            <p>
              Attire Recommendation:{" "}
              {recommendAttire(currentWeather.Temperature.Metric.Value)}
            </p>
          </div>
        )}
        {forecast && (
          <div className="forecast">
            <h2>5-Day Forecast</h2>
            {forecast.DailyForecasts.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>Date: {new Date(day.Date).toLocaleDateString()}</p>
                <p>
                  Min: {day.Temperature.Minimum.Value}°C, Max:{" "}
                  {day.Temperature.Maximum.Value}°C
                </p>
                <p>
                  Day: {day.Day.IconPhrase}, Night: {day.Night.IconPhrase}
                </p>
                <p>
                  Attire for the day:{" "}
                  {recommendAttire(
                    (day.Temperature.Maximum.Value +
                      day.Temperature.Minimum.Value) /
                      2
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
