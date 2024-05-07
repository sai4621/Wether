import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    axios.defaults.withCredentials = true;
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [weatherData, setWeatherData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const apiKey = "zzxuz8sofa3hIRooJVdGU6qhmWpNE1jd";

    useEffect(() => {
        setLoading(false);
    }, []);

    const fetchWeatherData = (cities) => {
      const cityData = {
          "Baltimore": {
              "Key": "348707",
              "LocalizedName": "Baltimore"
              // Add more details as necessary
          },
          "New York": {
              "Key": "349727",
              "LocalizedName": "New York"
              // Add more details as necessary
          },
          "Los Angeles": {
              "Key": "347625",
              "LocalizedName": "Los Angeles"
              // Add more details as necessary
          }
      };
  
      const hardcodedWeatherData = {
          "348707": { // Baltimore's locationId
              Temperature: "20°C", // Assuming 20°C
              WeatherCode: 1 // Sunny
          },
          "349727": { // New York's locationId
              Temperature: "18°C", // Assuming 18°C
              WeatherCode: 2 // Partly Cloudy
          },
          "347625": { // Los Angeles's locationId
              Temperature: "25°C", // Assuming 25°C
              WeatherCode: 3 // Clear
          }
      };
  
      const weatherTexts = {
          1: "Sunny",
          2: "Partly Cloudy",
          3: "Clear"
          // Add more weather codes and texts as necessary
      };
  
      const requests = cities.map(city => {
          const cityInfo = cityData[city];
  
          if (!cityInfo) {
              console.log(`No location found for city: ${city}`);
              return Promise.resolve({ city, data: undefined });
          }
  
          const locationId = cityInfo.Key;
          const mockWeatherData = hardcodedWeatherData[locationId];
  
          if (mockWeatherData) {
              return Promise.resolve({
                  city,
                  data: {
                      Temperature: mockWeatherData.Temperature,
                      WeatherText: weatherTexts[mockWeatherData.WeatherCode]
                  }
              });
          } else {
              console.error(`Mock weather data not found for ${city}`);
              return Promise.resolve({ city, data: undefined });
          }
      });
  
      Promise.all(requests).then(results => {
          const newWeatherData = results.reduce((acc, result) => {
              acc[result.city] = result.data;
              return acc;
          }, {});
          setWeatherData(newWeatherData);
          console.log('Updated weather data:', newWeatherData);
      });
  };

  

    const addCity = () => {
        if (newCity.trim()) {
            setCities([...cities, newCity]);
            fetchWeatherData([...cities, newCity]);
            setNewCity('');
        } else {
            alert('Please enter a city name.');
        }
    };

    const removeCity = (cityToRemove) => {
        const updatedCities = cities.filter(city => city !== cityToRemove);
        setCities(updatedCities);
        fetchWeatherData(updatedCities);
    };

    return (
      <div className="weather-app-container">
          <h1>Weather Dashboard</h1>
          <input
              type="text"
              value={newCity}
              onChange={e => setNewCity(e.target.value)}
              placeholder="Add New City"
          />
          <button onClick={addCity}>Add City</button>
          {cities.map((city, index) => (
              <div key={index}>
                  <h2>{city}</h2>
                  {weatherData[city] ? (
                      <div>
                          <p>Temperature: {weatherData[city].Temperature}</p>
                          <p>Weather: {weatherData[city].WeatherText}</p>
                      </div>
                  ) : <p>Loading...</p>}
                  <button onClick={() => removeCity(city)}>Remove</button>
              </div>
          ))}
      </div>
  );
};

export default Home;
