import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Ensure the correct path to your AuthContext

const Preferences = () => {
    const [temperatureUnit, setTemperatureUnit] = useState('C');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth(); // Get the user object from the context

    useEffect(() => {
        if (user && user.user_id) {
            axios.get('http://localhost:5000/preferences', { params: { user_id: user.user_id } })
                .then(response => {
                    if (response.data.temperatureUnit) {
                        setTemperatureUnit(response.data.temperatureUnit);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching preferences:', error);
                    setError('Failed to fetch preferences. Please try again later.');
                    setLoading(false);
                });
        } else {
            setError('User information not available. Please log in.');
            setLoading(false);
        }
    }, [user]); // Include user in the dependency array

    const handleSave = (value) => {
        setTemperatureUnit(value);
        if (user && user.user_id) {
            axios.post('http://localhost:5000/preferences', {
                user_id: user.user_id,
                temperatureUnit: value
            }, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                alert('Preferences saved successfully!');
            })
            .catch(error => {
                console.error('Error saving preferences:', error);
                setError('Failed to save preferences. Please try again later.');
                setTemperatureUnit(temperatureUnit); // Revert to the previous selection on error
            });
        } else {
            setError('User information not available. Please log in.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>User Preferences</h1>
            <div>
                <label>Temperature Unit:</label>
                <select
                    value={temperatureUnit}
                    onChange={e => handleSave(e.target.value)}
                >
                    <option value="C">Celsius</option>
                    <option value="F">Fahrenheit</option>
                </select>
            </div>
        </div>
    );
};

export default Preferences;
