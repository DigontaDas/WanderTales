import express from 'express';

const weatherRouter = express.Router();

// GET weather data for a city
weatherRouter.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ 
        success: false, 
        message: 'City parameter is required' 
      });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Weather service is not configured properly' 
      });
    }

    // Fetch weather data from OpenWeatherMap API
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        return res.status(404).json({ 
          success: false, 
          message: 'City not found' 
        });
      }
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();

    // Format the response data
    const formattedData = {
      success: true,
      name: weatherData.name,
      country: weatherData.sys.country,
      temperature: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 'N/A', // Convert to km
      pressure: weatherData.main.pressure,
      icon: weatherData.weather[0].icon,
      timestamp: new Date().toISOString()
    };

    res.json(formattedData);

  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch weather data' 
    });
  }
});

export default weatherRouter;