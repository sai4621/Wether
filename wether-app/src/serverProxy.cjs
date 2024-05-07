const express = require('express');
const cors = require('cors');  // Make sure to install the cors package
const axios = require('axios');
const app = express();
const port = 3000;

// Use CORS middleware to set appropriate headers
app.use(cors({
    origin: 'http://localhost:5173', // Set to the origins you want to allow, or use '*' for all
    credentials: true  // If your front-end needs to send cookies to the backend
}));

app.get('/api/weather', async (req, res) => {
    const apiKey = 'zzxuz8sofa3hIRooJVdGU6qhmWpNE1jd'; // Make sure this is your actual API key
    const city = req.query.city;
    const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(city)}`;

    try {
        const response = await axios.get(url);
        if (response.data.length > 0 && response.data[0].Key) {
            const locationId = response.data[0].Key;
            const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationId}?apikey=${apiKey}`;
            const weatherResponse = await axios.get(weatherUrl);
            res.json(weatherResponse.data);
        } else {
            res.status(404).send('No location found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
