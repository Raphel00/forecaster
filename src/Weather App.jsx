import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null); 
  const [loading, setLoading] = useState(true);        
  const [error, setError] = useState(null);             
  const [location, setLocation] = useState(null);      

  const API_KEY = '44b2cad36ef22b3266e3449eef1f310f'; 
  const weatherBackgrounds = {
    Clear: 'clearsky.jpg',
    Rain: 'rainy.jpeg',
    Haze: 'haze.jpeg',
    Snow: 'snowy.jpeg',
    Thunderstorm: 'thunderstorm.gif',
    Drizzle: 'drizzle.gif',
  };

 
  const getBackgroundImage = (condition) => {
    if (weatherBackgrounds[condition]) {
      return `url(/images/${weatherBackgrounds[condition]})`; 
    }
    
    return 'url(/images/default.jpeg)';
  };
  const getWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch weather data');
    }
  };
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError('Unable to retrieve your location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
    }
  };
  useEffect(() => {
    if (location) {
      getWeatherData(location.latitude, location.longitude);
    } else {
      getUserLocation();
    }
  }, [location]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const weatherCondition = weatherData?.weather[0]?.main;

  const backgroundImage = getBackgroundImage(weatherCondition);

  return (
    <div
      className="weather-app"
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        color: 'white', 
      }}
    >
      <h1>Weather App</h1>
      {weatherData && (
        <div className="weather-details">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;

