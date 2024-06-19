// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const searchBox = document.querySelector(".search-button input");
const searchIcon = document.querySelector(".search-button #search-icon");
const weatherContainer = document.getElementById("weatherContainer"); // Add this line
const dayElement = document.querySelector(".current-day");

// App data this is an object
const weather = {};

//define temp unit
weather.temperature = {
  unit: "celsius"
}

// APP CONSTS AND VARS for conversion
const KELVIN = 273;
// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";

// CHECK IF BROWSER SUPPORTS GEOLOCATION

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";

}
// SET USER'S POSITION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
  
    getCurrentWeather(latitude, longitude);
    getForecastWeather(latitude, longitude); // Fetch forecast weather data
  
    // Display current weather and forecast here
    displayCurrentWeather();
    displayForecastWeather();
  }
  
  
// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}
function getCurrentWeather(locationOrLatitude, longitude) {
    let api;
  
    if (typeof locationOrLatitude === 'string') {
      api = `https://api.openweathermap.org/data/2.5/weather?q=${locationOrLatitude}&appid=${key}`;
    } else {
      api = `https://api.openweathermap.org/data/2.5/weather?lat=${locationOrLatitude}&lon=${longitude}&appid=${key}`;
    }
  
    fetch(api)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
  
        // Set the weather icon and other data in the UI
        displayCurrentWeather();
      })
      .catch(function(error) {
        console.error("Error fetching current weather data:", error);
      });
  }
// DISPLAY WEATHER TO UI
function displayCurrentWeather() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();
    const currentDayName = daysOfWeek[currentDate.getDay()];
  
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    dayElement.innerHTML = currentDayName; // Display current day
  }



function getForecastWeather(locationOrLatitude, longitude) {
    let api;
  
    if (typeof locationOrLatitude === 'string') {
      api = `https://api.openweathermap.org/data/2.5/forecast?q=${locationOrLatitude}&appid=${key}`;
    } else {
      api = `https://api.openweathermap.org/data/2.5/forecast?lat=${locationOrLatitude}&lon=${longitude}&appid=${key}`;
    }
  
    fetch(api)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        weather.forecast = data.list; // Store the forecast data
  
        // Display the forecast weather
        displayForecastWeather();
      })
      .catch(function(error) {
        console.error("Error fetching forecast weather data:", error);
      });
  }


  function displayForecastWeather() {
    weatherContainer.innerHTML = ''; // Clear previous content
  
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Loop through each forecast item (assuming the API returns data for every 3 hours)
    for (let i = 0; i < weather.forecast.length; i += 8) {
      const forecastItem = weather.forecast[i];
      const forecastDate = new Date(forecastItem.dt * 1000);
      const dayName = daysOfWeek[forecastDate.getDay()];
      const forecastTemp = Math.floor(forecastItem.main.temp - KELVIN);
      const forecastIcon = forecastItem.weather[0].icon;
  
      const forecastItemHtml = `
        <div class="forecast-item">
          <p class="forecast-date">${dayName}</p>
          <img src="icons/${forecastIcon}.png" class="forecast-icon">
          <p class="forecast-temp">${forecastTemp}°C</p>
        </div>
      `;
  
      weatherContainer.insertAdjacentHTML('beforeend', forecastItemHtml);
    }
  }


// C to F conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9 / 5) + 32;
}


// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function () {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});


searchIcon.addEventListener("click", () => {

      getCurrentWeather(searchBox.value);
      getForecastWeather(searchBox.value);

  });
