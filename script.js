var cityDateEl = document.querySelector('#city-date');
var currentEl = document.querySelector('#current');
var forecastEl = document.querySelector('#forecast');
var submitBtnEl = document.getElementById('submit-button');
var recentCityEl = document.getElementById('recent-searches');

// 
var cities = localStorage.getItem('cities')? JSON.parse(localStorage.getItem('cities')) : [];

// This function gets the current and forecast weather as well as rendering on the page
function getWeather (cityName) {

    // Fetch information using the Current Weather endpoint
    var currentDate = moment().format('MM/DD/YYYY');
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=dc2f3090dc723dd5dfe242a2abd2e604';

    fetch (currentUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                currentEl.innerHTML = '';

                // Display searched city and current date
                cityDateEl.textContent = data.name + ' (' + currentDate + ')';

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
                        var uviEl = document.createElement('span');
                        uviEl.textContent = 'UV Index: '
                        currentEl.appendChild(uviEl);
                        var uvi2El = document.createElement('span')
                        uvi2El.textContent = data.value;
                        // Color code UV index (0-2 green, 3 - 5 yellow, 6-7 orange, 8-10 red)
                        if (data.value < 3) {
                            uvi2El.setAttribute('class', 'container text-white bg-success');
                        } else if (data.value < 6) {
                            uvi2El.setAttribute('class', 'container text-white bg-warning');
                        } else if (data.value < 8) {
                            uvi2El.setAttribute('class', 'container text-white bg-warning');
                        } else {
                            uvi2El.setAttribute('class', 'container text-white bg-danger');
                        };
                        currentEl.appendChild(uvi2El);
                        });
                    };
                });
                // Create lat/lon coordinates and use URL this to fetch 7-day forecast
                var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&units=imperial&exclude=minutely,hourly,alerts&appid=dc2f3090dc723dd5dfe242a2abd2e604';
                fetch (oneCallUrl).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            
                            forecastEl.innerHTML = '';

                            for (var i = 1; i < 6; i++) {

                                var cardEl = document.createElement('div');
                                cardEl.setAttribute('class', 'card bg-primary text-light rounded p-2 m-2');
                                forecastEl.appendChild(cardEl);

                                var dateEl = document.createElement('h5');
                                dateEl.textContent = moment().add(i, 'days').format('MM/DD/YYYY');
                                cardEl.appendChild(dateEl);
        
                                // Create weather icon and append
                                var icon2El = document.createElement('img');
                                icon2El.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png');
                                cardEl.appendChild(icon2El);
        
                                // Create temperature element and append
                                var temp2El = document.createElement('p');
                                temp2El.textContent = 'Temp: ' + data.daily[i].temp.day + ' °F';
                                cardEl.appendChild(temp2El);
        
                                // Create humidity element and append
                                var humid2El = document.createElement('p');
                                humid2El.textContent = 'Humidity: ' + data.daily[i].humidity + ' %';
                                cardEl.appendChild(humid2El);
                            };
                        });
                    };
                });
            });
        } else {
            currentEl.textContent = 'Invalid search. Please try again.'
        };
    });
};

// This function creates buttons for each city previously entered
function renderCities () {
    recentCityEl.innerHTML = '';
    for (var i =0; i < cities.length; i++) {
        var cityBtn = document.createElement('button');
        cityBtn.textContent = cities[i];
        cityBtn.value = cities[i];
        cityBtn.setAttribute('class', 'm-2 align-left');
        cityBtn.addEventListener('click', getHistory);
        recentCityEl.appendChild(cityBtn);
    };
};

// This function runs getWeather for a saved city
function getHistory (event) {
    getWeather(event.target.value);
};

// Create an event listener to get weather when a new city name is entered
submitBtnEl.addEventListener('click', function(event) {
    event.preventDefault();
    var cityName = document.getElementById('city-input').value;
    // Save city name to local storage
    cities.push(cityName);
    localStorage.setItem('cities', JSON.stringify(cities));
    getWeather(cityName);
    renderCities();
});

renderCities();