// CitiesComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CitiesComponent = ({ userId }) => {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');

    useEffect(() => {
        axios.get('/cities', { params: { user_id: userId } })
            .then(response => {
                setCities(response.data.cities);
            });
    }, [userId]);

    const handleAddCity = () => {
        axios.post('/cities', { user_id: userId, city_name: newCity })
            .then(() => {
                setCities([...cities, newCity]);
                setNewCity('');
            });
    };

    const handleDeleteCity = (cityName) => {
        const city = cities.find(c => c.name === cityName);
        axios.delete(`/cities/${city.id}`)
            .then(() => {
                setCities(cities.filter(c => c.name !== cityName));
            });
    };

    return (
        <div>
            <input
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Add new city"
            />
            <button onClick={handleAddCity}>Add City</button>
            {cities.map(city => (
                <div key={city.id}>
                    {city.name}
                    <button onClick={() => handleDeleteCity(city.name)}>Remove</button>
                </div>
            ))}
        </div>
    );
};

export default CitiesComponent;
