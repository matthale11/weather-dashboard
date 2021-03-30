var cityDateEl = document.querySelector('#city-date');
var currentEl = document.querySelector('#current-weather');
var forecastEl = document.querySelector('#forecast-weather');

// API key: dc2f3090dc723dd5dfe242a2abd2e604
// Fetch information using the Current Weather endpoint
var cityName = 'London';
var currentDate = moment().format('MM/DD/YYYY');
var cityUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=dc2f3090dc723dd5dfe242a2abd2e604';
var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + '&cnt=5&units=imperial&appid=dc2f3090dc723dd5dfe242a2abd2e604';

// Display searched city and current date
cityDateEl.textContent = cityName + ' (' + currentDate + ')';

// Fetch data from OpenWeather API and modify DOM
fetch (cityUrl).then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {

            // Create weather icon and append
            var iconEl = document.createElement('img');
            iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png');
            cityDateEl.appendChild(iconEl);

            // Create temperature element
            var tempEl = document.createElement('p');
            tempEl.textContent = 'Temperature: ' + data.main.temp + ' °F';

            // Create humidity element and append
            var humidityEl = document.createElement('p');
            humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
            tempEl.appendChild(humidityEl);

            // Create wind speed element and append
            var windSpeedEl = document.createElement('p');
            windSpeedEl.textContent = 'Wind Speed: ' + data.wind.speed + ' MPH';
            tempEl.appendChild(windSpeedEl);

            // Get lat/lon coordinates and use this to fetch UV index
            var latLonUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&appid=dc2f3090dc723dd5dfe242a2abd2e604';
            // TODO: Run fetch for this URL and append 

            currentEl.appendChild(tempEl);
        });
    } else {
        currentEl.textContent = 'Invalid search. Please try again.'
    }
});


// Fetch information using the Daily Forecast 16 days endpoint
fetch (forecastUrl).then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {
            var dateEl = document.createElement('h3');
            dateEl = moment().format('MM/DD/YYYY');
            forecastEl.appendChild(dateEl);
        });
    } else {
        forecastEl.textContent = 'Invalid search. Please try again.'
    }
});