console.log("This script has loaded");

//API key

const APIKey = "6b826d4c34586e17f4f669d088a91aed";

let searchFormEl = document.getElementById("search-form");

let savedData = {};

let weatherForecastData = {};

// var cityInput = "sydney"

// let latLonUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&appid=" + APIKey;

let cityInputVal = document.getElementById("city-search-input");

let cityName = document.getElementById("current-city-name");

let todayForecast = document.getElementById("today-forecast");
let forecastDetails = document.getElementById("forecast-details");
let futureForecast = document.getElementById("future-forecast");

let searchBtn = document.getElementById("search-btn");

let previousSearches = document.getElementById("previous-searches");

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];



//prevent form from refreshing page and prevent user from not entering a city

function formSubmitHandler(event) {
    event.preventDefault();

    cityInputVal = document.getElementById("city-search-input").value;

    if (!cityInputVal) {
        alert("Please enter a city");
        return;
    }

    console.log(cityInputVal)

    // searchHistory();


    getApi();

}


//get the API

function getApi() {

    //API request based on city name to obtain the latitude and longitude

    console.log(cityInputVal)

    let queryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInputVal + "&appid=" + APIKey;

    fetch(queryUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
            }
            return response.json();
        })

        //save the data from the latitude and longitude API request
        .then(function (data) {
            console.log(data)

            savedData = data;

            //API request based on latitude and longitude from our first API request

            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + savedData[0].lat + "&lon=" + savedData[0].lon + "&units=metric&exclude=hourly,minutely&appid=" + APIKey)

        })
        .then(function (response) {
            if (response.ok) {
                console.log(response);
            }
            return response.json();
        })
        .then(function (data) {

            weatherForecastData = data

            if (!Object.keys(weatherForecastData).length) {
                console.log("No weather")
            } else {
                // todayForecast = ""

                printWeather();

            }
        })
}


function printWeather() {

    //print the current weather conditions as per the JSON response from the APIs

    let todayForecastContainer = document.createElement("div");
    todayForecastContainer.classList.add("card", "bg-light", "text-dark", "p-2");
    todayForecastContainer.setAttribute("id", "current-container");
    todayForecast.append(todayForecastContainer);

    let todayForecastCard = document.createElement('div');
    todayForecastCard.classList.add("card-body");

    //current time  here

    let currentDate = new Date(weatherForecastData.current.dt * 1000);

    let day = currentDate.getDate();

    let month = currentDate.getMonth() + 1;

    let year = currentDate.getFullYear();


    cityName.innerHTML = savedData[0].name + " on " + day + "/" + month + "/" + year

    // let currentCity = document.createElement("h2");
    // currentCity.textContent = savedData[0].name + " ";
    // cityName.appendChild(currentCity);

    let currentForecast = document.getElementById("current-container")

    let currentForecastFragment = document.createDocumentFragment();

    let weatherIcon = document.createElement("img");
    weatherIcon.classList.add("weather-icon");
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForecastData.current.weather[0].icon + "@2x.png");
    weatherIcon.setAttribute("alt", "Icon showing current weather status of " + weatherForecastData.current.weather[0].description);
    currentForecast.appendChild(weatherIcon);

    let currentForecastDetails = ["Conditions: " + weatherForecastData.current.weather[0].main, "Temp: " + weatherForecastData.current.temp, "Wind: " + weatherForecastData.current.wind_speed, "Humidity: " + weatherForecastData.current.humidity, "Uv Index: " + weatherForecastData.current.uvi];

    currentForecastDetails.forEach(function (current) {
        let liEl = document.createElement("p");
        liEl.textContent = current;
        currentForecastFragment.appendChild(liEl);

        //ADD STYLING FOR YOUR LI STUFF HERE
    })

    currentForecast.appendChild(currentForecastFragment);

    // let cityEl = document.createElement('h3');
    // cityEl.textContent = savedData[0].name + " - " + weatherForecastData.current.weather[0].main;
    // todayForecastCard.appendChild(cityEl);

    // let tempEl = document.createElement('li');
    // tempEl.textContent = "Temp: " + weatherForecastData.current.temp;
    // todayForecastCard.appendChild(tempEl);

    // let windEl = document.createElement('li');
    // windEl.textContent = "Wind speed: " + weatherForecastData.current.wind_speed;
    // todayForecastCard.appendChild(windEl);


    // let humidityEl = document.createElement('li');
    // humidityEl.textContent = "Humidity: " + weatherForecastData.current.humidity;
    // todayForecastCard.appendChild(humidityEl);

    // let uvEl = document.createElement('li');
    // uvEl.textContent = "UV Index: " + weatherForecastData.current.uvi;
    // todayForecastCard.appendChild(uvEl);

    //future forecast. Loop over the weatherForecastData.daily object and return conditions, temp, wind, humidity and UV for the next five days

    for (let i = 1; i < Object.keys(weatherForecastData.daily)[6]; i++) {

        //create bootstrap card for the five-day future forecast

        let fiveDayForecastContainer = document.createElement("div");
        fiveDayForecastContainer.classList.add("card", "bg-light", "text-dark", "p-2", "m-1", "d-inline-flex");
        fiveDayForecastContainer.setAttribute("id", "five-day-container");
        futureForecast.append(fiveDayForecastContainer);

        //create indivudal card elements with five-day forecast details on them


        // fiveDayForecastCard.textContent = weatherForecastData.daily[i].humidity;
        // fiveDayForecastContainer.appendChild(fiveDayForecastCard);

        // let fiveDayFutureForecast = document.getElementById("five-day-container")

        //future dates

        let futureDate = new Date(weatherForecastData.daily[i].dt * 1000);

        let futureday = futureDate.getDate();

        let futuremonth = futureDate.getMonth() + 1;

        let futureyear = futureDate.getFullYear();


        // cityName.innerHTML = savedData[0].name + " on " + day + "/" + month + "/" + year

        let futureWeatherIcon = document.createElement("img");
        futureWeatherIcon.classList.add("future-weather-icon");
        futureWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForecastData.daily[i].weather[0].icon + "@2x.png");
        futureWeatherIcon.setAttribute("alt", "Icon showing current weather status of " + weatherForecastData.daily[i].weather[0].description);
        fiveDayForecastContainer.appendChild(futureWeatherIcon);

        let futureForecastFragment = document.createDocumentFragment();

        let futureForecastDetails = ["Date: " + futureday + "/" + futuremonth + "/" + futureyear, "Conditions: " + weatherForecastData.daily[i].weather[0].main, "Temp: " + weatherForecastData.current.temp, "Wind: " + weatherForecastData.daily[i].wind_speed, "Humidity: " + weatherForecastData.daily[i].humidity, "Uv Index: " + weatherForecastData.daily[i].uvi];

        futureForecastDetails.forEach(function (future) {

            // let fiveDayFutureForecastCard = document.createElement('div');
            // fiveDayFutureForecastCard.classList.add("card-body");
            // fiveDayFutureForecast.appendChild(fiveDayFutureForecastCard);

            let liEl = document.createElement("li");
            liEl.textContent = future;
            futureForecastFragment.appendChild(liEl);

            //ADD STYLING FOR YOUR LI STUFF HERE
        })

        fiveDayForecastContainer.appendChild(futureForecastFragment);
    }
}


// searchBtn.addEventListener("click", function () {

//     let searchInput = cityInputVal.value;
//     getApi(searchInput);
//     searchHistory.push(searchInput);
//     localStorage.setItem("search", JSON.stringify(searchHistory));

//     renderSearchHistory();

// })

// function renderSearchHistory() {
//     previousSearches.innerHTML = "";

//     for (let i = 0; i < searchHistory.length; i++) {

//         let prevSearchItem = document.createElement("p");

//         previousSearches.appendChild(prevSearchItem);
//     }

// }

// function savePreviousSearches() {

//     let prevHistory = [];
//     prevHistory = JSON.parse(localStorage.getItem("History")) || [];

//     prevHistory.push;

//     alert(prevHistory);

//     localStorage.setItem("History", JSON.stringify(prevHistory));
// }

// function searchHistory() {
//     previousSearches.city.push.(cityInputVal);
//     localStorage.setItem("City Name", JSON.stringify(cityInputVal));
// }

// function onLoad() {
//     if (localStorage.getItem("History")) {
//         previousSearches = JSON.parse(localStorage.getItem("History"));

//     }
// }

// function addHistory(previousSearchHistory) {
//     previousSearches.city.push(previousSearchHistory);
//     localStorage.setItem("History", JSON.stringify(previousSearches));
// }

// function showDate() {

//     let currentTimestamp = parseInt(weatherForecastData.current.dt);

//     let currentMilliseconds = currentTimestamp * 1000;

//     let currentDate = new Date(currentMilliseconds);

//     currentDateArray = currentDate.toLocaleString("en-UK");

//     console.log(currentDateArray);

// }

// function currentDate() {

//     let todayDate = document.createElement("h2");
//     todayDate.text(moment.unix(parseInt(weatherForecastData.current.dt)).format("DD MM YYYY"));
//     currentCity.appendChild(currentDate);
// }


searchFormEl.addEventListener("submit", formSubmitHandler);