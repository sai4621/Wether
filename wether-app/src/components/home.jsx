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
    const apiKey = "zzxuz8sofa3hIRooJVdGU6qhmWpNE1jd";

    useEffect(() => {
        if (user && user.id) {
            axios.get('http://localhost:5000/preferences', { params: { user_id: user.id } })
                .then(response => {
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching preferences', error);
                    setError('Failed to fetch preferences');
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
                Temperature: "15°C", // Assuming 20°C
                WeatherCode: 1 // Sunny
            },
            "349727": { // New York's locationId
                Temperature: "7°C", // Assuming 18°C
                WeatherCode: 2 // Partly Cloudy
            },
            "347625": { // Los Angeles's locationId
                Temperature: "25°C", // Assuming 25°C
                WeatherCode: 3 // Clear
            }
        };
        const weatherImages = {
            "Sunny": "./images/w/sunny.png",
            "Partly Cloudy": "./images/w/partly_cloudy.png",
            "Clear": "./images/w/clear.png",
            // Add more images for other weather conditions as needed
        };
        const attireImages = {
            "Sunny": "./images/a/light_clothing.png",
            "Partly Cloudy": "./images/a/light_jacket.png",
            "Clear": "./images/a/casual.png",
            // Add more images for other weather conditions as needed
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
                        WeatherText: weatherTexts[mockWeatherData.WeatherCode],
                        WeatherImage: weatherImages[weatherTexts[mockWeatherData.WeatherCode]],
                        AttireImage: attireImages[weatherTexts[mockWeatherData.WeatherCode]]
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
            axios.post('http://localhost:5000/cities', { user_id: user.id, city_name: newCity })
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
                            <p>Temperature: {weatherData[city].Temperature}</p>
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
