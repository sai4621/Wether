import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ensure this path is correct
import './CityData.css'; // Import the CSS file


const apiKey = "3f59299cb03f1d4beb6bd960a3f546fd";


const CityData = () => {
    const { user } = useAuth();
    const [weatherDetails, setWeatherDetails] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [temperatureUnit, setTemperatureUnit] = useState('C');

    const dataFromLink = useParams()
    const [cityName, setCityName] = useState(dataFromLink.cityName)
    console.log("the city name: "  + cityName)

    useEffect(() => { 
        const fetchPreferencesAndWeather = async () => {
            try {
                if (user && user.user_id) {
                    // Fetch user preferences
                    console.log("first");
                    const prefResponse = await  axios.get('http://localhost:5000/preferences', { params: { user_id: user.user_id } })
                    setTemperatureUnit(prefResponse.data.temperatureUnit);
                    console.log("here working");
                    // Fetch current weather directly from OpenWeatherMap API
                    const weatherResponse = await axios.get('http://localhost:5000/weather', { params: { city: cityName, user_id: user.user_id } })
                    console.log("weather response:" + JSON.stringify(weatherResponse))


                    const currentWeather = {
                        Temperature: weatherResponse.data.main.temp,
                        WeatherText: weatherResponse.data.weather[0].description,
                        WeatherImage: `http://openweathermap.org/img/wn/${weatherResponse.data.weather[0].icon}@2x.png`,
                        AttireImage: '/images/a/light_clothing.png' // Example image path
                    };
                    setWeatherDetails(currentWeather);

                    // Fetch forecast data
                    const forecastResponse = await axios.get('http://localhost:5000/weather', { params: { city: cityName, user_id: user.user_id } })
                    console.log("filter forecast: " + JSON.stringify(forecastResponse, null, 2 ))
                    const filteredData = filterForecastData(forecastResponse.data);
                    setForecastData(filteredData);

                    setLoading(false);
                } else {
                    setLoading(false);
                    console.log("here else");
                }
            } catch (error) {
                console.log('Error fetching data:', error);
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

    const filterForecastData = (data) => {
        const dt = null
        const date = null
        const temperature = null 
        const weatherIcon = null
        const weatherDescription = null

        Object.keys(data).forEach(key =>  {
            if(key === "dt"){
                dt = key.dt
            }
            else if(date == "date"){
                date
            }
        })
        /*

        return data.map((item) => {
            return {
                dt: item.dt,
                date: item.dt_txt,
                temperature: item.main.temp,
                weatherIcon: item.weather[0].icon,
                weatherDescription: item.weather[0].description,
            };
        });
        */
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const groupForecastByDay = () => {
        const days = [];
        for (let i = 0; i < forecastData.length; i += 8) {
            days.push(forecastData.slice(i, i + 8));
        }
        return days;
    };

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
