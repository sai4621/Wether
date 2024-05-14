import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Ensure this path is correct

const Home = () => {
    axios.defaults.withCredentials = true;
    const { user } = useAuth();
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [weatherData, setWeatherData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [temperatureUnit, setTemperatureUnit] = useState('C');

    useEffect(() => {
        if (user && user.user_id) {
            axios.get('http://localhost:5000/preferences', { params: { user_id: user.user_id } })
                .then(response => {
                    setTemperatureUnit(response.data.temperatureUnit);
                    return axios.get('http://localhost:5000/cities', { params: { user_id: user.user_id } });
                })
                .then(response => {
                    setCities(response.data.cities);
                    fetchWeatherData(response.data.cities);
                })
                .catch(error => {
                    console.error('Error fetching preferences or cities', error);
                    setError('Failed to fetch preferences or cities');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    const checkSession = () => {
        axios.get('http://localhost:5000/check_session')
            .then(response => {
                console.log('Session Data:', response.data);
            })
            .catch(error => {
                console.error('Session Check Failed:', error);
                alert('Session check failed. See console for details.');
            });
    };

    const fetchWeatherData = (cities) => {
        const requests = cities.map(city => {
            return axios.get('http://localhost:5000/weather', { params: { city, user_id: user.user_id } })
                .then(response => ({
                    city,
                    data: {
                        Temperature: response.data.main.temp,
                        WeatherText: response.data.weather[0].description,
                        WeatherImage: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
                        AttireImage: '/images/a/light_clothing.png' // Example image path
                    }
                }))
                .catch(error => {
                    console.error(`Error fetching data for city ${city}:`, error);
                    return { city, data: undefined };
                });
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
            axios.post('http://localhost:5000/cities', { user_id: user.user_id, city_name: newCity })
                .then(() => {
                    setCities([...cities, newCity]);
                    fetchWeatherData([...cities, newCity]);
                    setNewCity('');
                })
                .catch(error => {
                    console.error('Error adding city', error);
                    alert('Failed to add city. Please check your network or contact the administrator.');
                });
        } else {
            alert('Please enter a city name.');
        }
    };

    const removeCity = (cityToRemove) => {
        const encodedCityName = encodeURIComponent(cityToRemove);
        axios.delete(`http://localhost:5000/cities/${encodedCityName}`)
            .then(() => {
                const updatedCities = cities.filter(city => city !== cityToRemove);
                setCities(updatedCities);
                fetchWeatherData(updatedCities);
            })
            .catch(error => {
                console.error('Error removing city', error);
                alert('Failed to remove city. Please check your network or contact the administrator.');
            });
    };

    if (!user) {
        return <div>Please log in to view this page.</div>;
    }

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
                            <p>Temperature: {weatherData[city].Temperature} °{temperatureUnit}</p>
                            <p>Weather: {weatherData[city].WeatherText}</p>
                            {weatherData[city].WeatherImage && (
                                <img src={weatherData[city].WeatherImage} alt={weatherData[city].WeatherText} />
                            )}
                            {weatherData[city].AttireImage && (
                                <img src={weatherData[city].AttireImage} alt="Attire" />
                            )}
                        </div>
                    ) : <p>Loading...</p>}
                    <button onClick={() => removeCity(city)}>Remove</button>
                </div>
            ))}
        </div>
    );
};

export default Home;
