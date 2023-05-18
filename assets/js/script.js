// Declare DOM element variables
var APIKey = '414f5aad5297b46db7645b948ad4cafc';
var inputBox = document.getElementById("city-input");
var searchBtn = document.getElementById("search-btn");
var todayCity = document.getElementById("today-city");
var todayIcon = document.getElementById("today-icon")
var todayTemp = document.getElementById("today-temp");
var todayWind = document.getElementById("today-wind");
var todayHumidity = document.getElementById("today-humidity");
var fiveDayContainer = document.getElementById("five-day-display");
var searchDisplay = document.getElementById("search-display");
var resetBtn = document.getElementById("reset-btn");

//checks for blank city name, if not, runs API call
function getWeather () {
    if (inputBox.value === "") {
        alert("Please enter a city");
        return;
    } else {
        search();
        getAPI();
    }
}

// API call
function getAPI() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIKey;

    fetch(requestUrl)
        .then (function (response) {
            // checks if search is successful
            if (response.status === 200) {
                console.log(response.status)
            }  else {
                alert("Please enter a valid city, or check your spelling again.")
                searchDisplay.removeChild(searchDisplay.lastElementChild);
                var searchList = JSON.parse(localStorage.getItem("searchList")) || [];
                searchList.pop();
                localStorage.setItem("searchList", JSON.stringify(searchList));
                return;
            }
            return response.json();
        })
        // saves coordiates based on city name
        .then (function (data){
            var coordLat = data.coord.lat;
            var coordLon = data.coord.lon;
            
            // applies coordiates to OpenWeather's 5 day API
            var requestURLDays = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordLat + "&lon=" + coordLon +"&units=metric&cnt=50&appid=" + APIKey;
            
            fetch(requestURLDays)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data)
                        // displays weather data for current day and time
                        var currentCity = data.city.name;
                        var currentDate = (data.list[0].dt_txt).substring(0,10);
                        var currentTemp = data.list[0].main.temp;
                        var currentWind = data.list[0].wind.speed;
                        var currentHumidity = data.list[0].main.humidity;
                        var currentIcon = data.list[0].weather[0].icon;

                        todayCity.textContent = currentCity + " (" + currentDate + ")";
                        todayTemp.textContent = "Temperature: " + currentTemp + "°C";
                        todayWind.textContent = "Wind: " + currentWind + "mph";
                        todayHumidity.textContent = "Humidity: " + currentHumidity + "%";
                        todayIcon.setAttribute("src","http://openweathermap.org/img/wn/" + currentIcon + "@2x.png");

                        // displays weather data for next 5 days
                        for (var i=7; i < data.list.length; i += 8) {
                            var j = (i-7)/8;
                            var loopDate = (data.list[i].dt_txt).substring(0,10);
                            var loopTemp = data.list[i].main.temp;
                            var loopWind = data.list[i].wind.speed;
                            var loopHumidity = data.list[i].main.humidity;
                            var loopIcon = data.list[i].weather[0].icon;

                            fiveDayContainer.children[j].children[0].textContent = loopDate;
                            fiveDayContainer.children[j].children[1].setAttribute("src","http://openweathermap.org/img/wn/" + loopIcon + "@2x.png");
                            fiveDayContainer.children[j].children[2].textContent = "Temp: " + loopTemp + "°C";
                            fiveDayContainer.children[j].children[3].textContent = "Wind: " + loopWind + "mph";
                            fiveDayContainer.children[j].children[4].textContent = "Humidity: " + loopHumidity + "%"
                        }



                    })
        })
    
};

// creates buttons when successful search is done
function search () {
    todayIcon.className = '';
    city = inputBox.value;

    var searchCity = document.createElement("button");
    searchCity.setAttribute("class", "search-city");
    searchCity.textContent = city;
    searchDisplay.appendChild(searchCity);
    searchCity.addEventListener("click", (searchHistory));
    inputBox.value = "";
    saveCity();
}

// looks up existing local storage, and parses it to an array
var downloadStorage = function() {
    var searchList = JSON.parse(localStorage.getItem("searchList")) || [];
    return searchList
}

// sets a maximum of 6 cities in array, and removes the city and button if it goes over
function saveCity() {
    var searchList = downloadStorage();
    if (searchList.length === 6) {
        searchList.shift();
        searchList.push(city);
        localStorage.setItem("searchList", JSON.stringify(searchList));
        searchDisplay.removeChild(searchDisplay.firstElementChild);
    } else {
        searchList.push(city);
        localStorage.setItem("searchList", JSON.stringify(searchList));
    }
}

// runs API for city buttons clicked in search history
function searchHistory(event) {
    var element = event.target;
    city = element.textContent;
    getAPI();
}

// loads search history when page is refreshed, and recreates buttons
function displaySearchHistory() {
    var searchList = JSON.parse(localStorage.getItem("searchList")) || [];

    for (var i=0; i < searchList.length; i++) {
        var loadCity = document.createElement("button");
        loadCity.setAttribute("class", "search-city");
        loadCity.textContent = searchList[i];
        searchDisplay.appendChild(loadCity);
        loadCity.addEventListener("click", (searchHistory));
    }
}

// resets data in local storage, and removes all history buttons
function resetHistory() {
    localStorage.clear();
    while (searchDisplay.firstChild) {
        searchDisplay.removeChild(searchDisplay.firstChild);
    }
}

// adds event listeners for search and reset buttons
displaySearchHistory();
searchBtn.addEventListener("click", getWeather)
resetBtn.addEventListener("click", resetHistory)