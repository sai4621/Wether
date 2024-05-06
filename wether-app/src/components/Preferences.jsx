import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Ensure proper import

const Preferences = () => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState({
        temperatureUnit: 'C',
        favoriteCity: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            axios.get('/preferences', { params: { user_id: user.id } })
                .then(response => {
                    setPreferences(response.data.preferences);
                    setLoading(false);
                })
                .catch(error => console.error('Error fetching preferences', error));
        }
    }, [user]);

    const handleSave = (key, value) => {
        axios.post('/preferences', { user_id: user.id, preference_key: key, preference_value: value })
            .then(response => alert('Preferences saved!'))
            .catch(error => console.error('Error saving preferences', error));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>User Preferences</h1>
            <div>
                <label>Temperature Unit:</label>
                <select
                    value={preferences.temperatureUnit}
                    onChange={e => handleSave('temperatureUnit', e.target.value)}
                >
                    <option value="C">Celsius</option>
                    <option value="F">Fahrenheit</option>
                </select>
            </div>
            <div>
                <label>Favorite City:</label>
                <input
                    type="text"
                    value={preferences.favoriteCity}
                    onChange={e => handleSave('favoriteCity', e.target.value)}
                />
            </div>
            <button onClick={() => handleSave()}>Save Preferences</button>
        </div>
    );
};

export default Preferences;
