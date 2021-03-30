var cityDateEl = document.querySelector('#city-date');
var currentEl = document.querySelector('#current');
var forecastEl = document.querySelector('#forecast');

// API key: dc2f3090dc723dd5dfe242a2abd2e604
// Fetch information using the Current Weather endpoint
var cityName = 'Atlanta';
var currentDate = moment().format('MM/DD/YYYY');
var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=dc2f3090dc723dd5dfe242a2abd2e604';

// Display searched city and current date
cityDateEl.textContent = cityName + ' (' + currentDate + ')';

// Fetch data from OpenWeather API and modify DOM
fetch (currentUrl).then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {

            // Create weather icon and append
            var iconEl = document.createElement('img');
            iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png');
            cityDateEl.appendChild(iconEl);

            // Create temperature element
            var tempEl = document.createElement('p');
            tempEl.textContent = 'Temperature: ' + data.main.temp + ' °F';
            currentEl.appendChild(tempEl);

            // Create humidity element and append
            var humidityEl = document.createElement('p');
            humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';
            currentEl.appendChild(humidityEl);

            // Create wind speed element and append
            var windSpeedEl = document.createElement('p');
            windSpeedEl.textContent = 'Wind Speed: ' + data.wind.speed + ' MPH';
            currentEl.appendChild(windSpeedEl);

            // Get lat/lon coordinates and use this to fetch UV index
            var uviUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&appid=dc2f3090dc723dd5dfe242a2abd2e604';
            // Run fetch for this UVI URL and append 
            fetch (uviUrl).then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                    var uviEl = document.createElement('p');
                    uviEl.textContent = 'UV Index: ' + data.value;
                    currentEl.appendChild(uviEl);
                    // TODO: Color code UV index
                    });
                };
            });
            // Create lat/lon coordinates and use URL this to fetch 7-day forecast
            var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&units=imperial&exclude=minutely,hourly,alerts&appid=dc2f3090dc723dd5dfe242a2abd2e604';
            fetch (oneCallUrl).then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        var dateEl = document.createElement('h3');
                        dateEl.textContent = moment().add(1, 'days').format('MM/DD/YYYY');
                        forecastEl.appendChild(dateEl);

                        // Create weather icon and append
                        var icon2El = document.createElement('img');
                        icon2El.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.daily[1].weather[0].icon + '.png');
                        forecastEl.appendChild(icon2El);

                        // Create temperature element and append
                        var temp2El = document.createElement('p');
                        temp2El.textContent = 'Temp: ' + data.daily[1].temp.day + ' °F';
                        forecastEl.appendChild(temp2El);

                        // Create humidity element and append
                        var humid2El = document.createElement('p');
                        humid2El.textContent = 'Humidity: ' + data.daily[1].humidity + ' %';
                        forecastEl.appendChild(humid2El);
                    });
                };
            });
        });
    } else {
        currentEl.textContent = 'Invalid search. Please try again.'
    };
});