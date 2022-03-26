console.log("This script has loaded");

//API key

const APIKey = "6b826d4c34586e17f4f669d088a91aed";

let searchFormEl = document.getElementById("search-form");

let savedData = {};

let weatherForecastData = {};

// var cityInput = "sydney"

// let latLonUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&appid=" + APIKey;

let cityInputVal = document.getElementById("city-search-input");

let todayForecast = document.getElementById("today-forecast");
let forecastDetails = document.getElementById("forecast-details");
let futureForecast = document.getElementById("future-forecast");

let searchBtn = document.getElementById("search-btn");

//prevent form from refreshing page and prevent user from not entering a city

function formSubmitHandler(event) {
    event.preventDefault();

    cityInputVal = document.getElementById("city-search-input").value;

    if (!cityInputVal) {
        alert("Please enter a city");
        return;
    }

    console.log(cityInputVal)

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

            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + savedData[0].lat + "&lon=" + savedData[0].lon + "&appid=" + APIKey)

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
                todayForecast = ""

                for (var i = 0; i < Object.keys(weatherForecastData).length; i++) {

                    printWeather();
                    // var todayForecastEl = document.createElement("h2");
                    // todayForecastEl.textContent = weatherForecastData[i].timezone + " Lat: " + weatherForecastData[i].lat + " Lon: " + weatherForecastData[i].lon;
                    // todayForecastEl.textContent = weatherForecastData.timeZone;
                    // todayForecast.appendChild(todayForecastEl);
                }
            }
        })
}

function printWeather() {
    // let weatherCard = document.createElement("div");
    // weatherCard.classList.add("card", "bg-light", "text-dark")

    // let forecastBody = document.createElement("div");
    // forecastBody.classList.add("card-body");
    // weatherCard.append(forecastBody);

    let forecastBody = document.createElement("div")
    forecastBody.classList.add("forecast-body", "bg-dark", "text-light");
    let cityEl = document.createElement('p');
    cityEl.innerHTML = savedData.name;
    cityEl.appendChild(forecastBody);


}


searchFormEl.addEventListener("submit", formSubmitHandler);