import React, { useState } from 'react';
import { Search, MapPin, Wind, Eye, Droplets } from 'lucide-react';

function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/weather?city=${encodeURIComponent(city)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Weather data not found');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather();
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'clear': '☀️',
      'clouds': '☁️',
      'rain': '🌧️',
      'drizzle': '🌦️',
      'thunderstorm': '⛈️',
      'snow': '❄️',
      'mist': '🌫️',
      'fog': '🌫️',
      'haze': '🌫️',
    };
    
    const lowerCondition = condition.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerCondition.includes(key)) {
        return icon;
      }
    }
    return '🌤️'; // default icon
  };

  return (
    <div className="bg-blue-900 rounded-4xl p-8 text-white shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Plan with Real-time Weather</h2>
        <p className="text-blue-100 text-lg">Check weather conditions for your next destination</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8 max-w-md mx-auto">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., Paris, Tokyo, Bali)..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 
            placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg 
          hover:bg-white/30 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="text-center mb-6">
          <p className="text-red-200 bg-red-500/20 backdrop-blur-sm rounded-lg p-3 inline-block">
            {error}
          </p>
        </div>
      )}

      {/* Weather Display */}
      {weatherData && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-200" />
              <h3 className="text-xl font-semibold">
                {weatherData.name}, {weatherData.country}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Weather Info */}
            <div className="text-center">
              <div className="text-6xl mb-2">
                {getWeatherIcon(weatherData.condition)}
              </div>
              <div className="text-4xl font-bold mb-2">
                {Math.round(weatherData.temperature)}°C
              </div>
              <p className="text-lg text-blue-100 capitalize">
                {weatherData.description}
              </p>
            </div>

            {/* Weather Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🌡️</span>
                  <span>Feels like</span>
                </div>
                <span className="font-semibold">{Math.round(weatherData.feelsLike)}°C</span>
              </div>

              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5" />
                  <span>Wind Speed</span>
                </div>
                <span className="font-semibold">{weatherData.windSpeed} km/h</span>
              </div>

              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5" />
                  <span>Humidity</span>
                </div>
                <span className="font-semibold">{weatherData.humidity}%</span>
              </div>

              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Visibility</span>
                </div>
                <span className="font-semibold">{weatherData.visibility} km</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;