import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ensure this path is correct
import './CityData.css'; // Import the CSS file

const CityData = () => {
    const { cityName } = useParams();
    const { user } = useAuth();
    const [weatherDetails, setWeatherDetails] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [temperatureUnit, setTemperatureUnit] = useState('C');

    useEffect(() => {
        const fetchPreferencesAndWeather = async () => {
            try {
                if (user && user.user_id) {
                    // Fetch user preferences
                    const prefResponse = await axios.get('http://localhost:5000/preferences', { 
                        params: { user_id: user.user_id },
                        withCredentials: true
                    });
                    setTemperatureUnit(prefResponse.data.temperatureUnit);

                    // Fetch current weather and forecast data from the backend
                    const weatherResponse = await axios.get('http://localhost:5000/getcityweather', {
                        params: { city: cityName, user_id: user.user_id },
                        withCredentials: true
                    });

                    setWeatherDetails(weatherResponse.data.current_weather);
                    setForecastData(weatherResponse.data.forecast_data);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };

        fetchPreferencesAndWeather();
    }, [cityName, user]);

    const convertTemperature = (temp, unit) => {
        if (unit === 'F') {
            return (temp * 9 / 5) + 32;
        } else {
            return temp;
        }
    };

    const roundDegree = (temp) => {
        return Math.round(temp * 10) / 10;
    };

    const formatDate = (timestamp, type) => {
        const date = new Date(timestamp * 1000);
        const options = type === 'hour' ? { hour: '2-digit', minute: '2-digit' } : { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const groupForecastByDay = () => {
        const days = [];
        for (let i = 0; i < forecastData.length; i += 8) {
            days.push(forecastData.slice(i, i + 8));
        }
        return days;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const groupedForecast = groupForecastByDay();

    return (
        <div className="city-data-container">
            <h1>{cityName}</h1>
            <div className="current-weather">
                <h2>Current Weather</h2>
                <p>Temperature: {roundDegree(convertTemperature(weatherDetails.Temperature, temperatureUnit))}°{temperatureUnit}</p>
                <p>Weather: {weatherDetails.WeatherText}</p>
                <img src={weatherDetails.WeatherImage} alt={weatherDetails.WeatherText} />
            </div>
            <div className="forecast">
                <h2>Next 5 Days</h2>
                {groupedForecast.map((day, index) => (
                    <div className="forecast-grid" key={index}>
                        {day.map((item, i) => (
                            <div className="forecast-item" key={i}>
                                <p className="forecast-date">{formatDate(item.dt, "short")}</p>
                                <p className="forecast-time">{formatDate(item.dt, "hour")}</p>
                                <img className="forecast-icon" src={`http://openweathermap.org/img/wn/${item.weatherIcon}@2x.png`} alt={item.weatherDescription} />
                                <p className="forecast-temperature">{roundDegree(convertTemperature(item.temperature, temperatureUnit))}°{temperatureUnit}</p>
                                <p className="forecast-description">{item.weatherDescription}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CityData;
