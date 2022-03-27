console.log("This script has loaded");

//API key

const APIKey = "6b826d4c34586e17f4f669d088a91aed";

// setting global variables

let searchFormEl = document.getElementById("search-form");

// let cityInputVal = document.getElementById("city-search-input");

let cityInputVal = [];

let cityName = document.getElementById("current-city-name");

let todayForecast = document.getElementById("today-forecast");
let forecastDetails = document.getElementById("forecast-details");
let futureForecast = document.getElementById("future-forecast");

let searchBtn = document.getElementById("search-btn");


let previousSearches = document.getElementById("previous-searches");

let i = 0;

// empty objects to store JSON data received from API

let savedData = {};

let weatherForecastData = {};


//prevent form from refreshing page and prevent user from not entering a city

function formSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    cityInputVal = document.getElementById("city-search-input").value;

    if (!cityInputVal) {
        alert("Please enter a city");
        return;
    }

    console.log(cityInputVal)

    readThingy();

    getApi();

}

// function storeThingy() {

//     localStorage.setItem("Thingy", cityInputVal);


// }


function readThingy() {

    let retrieveThingy = [];

    let savedCity = cityInputVal;

    retrieveThingy.push(savedCity);

    localStorage.setItem(savedCity, savedCity);



    retrieveThingy = localStorage.getItem(savedCity, savedCity);

    let printThingy = document.createElement("button");
    printThingy.setAttribute("class", "searchHistoryBtn")
    printThingy.textContent = cityInputVal;
    printThingy.value = cityInputVal;
    previousSearches.appendChild(printThingy);


    // let searchInput = cityInputVal.value;
    //     getApi(searchInput);
    //     searchHistory.push(searchInput);
    //     localStorage.setItem("search", JSON.stringify(searchHistory));
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

        //save the data from the latitude and longitude API request to empty object

        .then(function (data) {
            console.log(data)

            savedData = data;

            //Second API request based on latitude and longitude that we obtained from our first API request

            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + savedData[0].lat + "&lon=" + savedData[0].lon + "&units=metric&exclude=hourly,minutely&appid=" + APIKey)

        })
        .then(function (response) {
            if (response.ok) {
                console.log(response);
            }
            return response.json();
        })

        //save the second API request's data to the second empty object
        .then(function (data) {

            weatherForecastData = data

            if (!Object.keys(weatherForecastData).length) {
                console.log("No weather")
            } else {

                printWeather();

            }
        })
}


function printWeather() {

    //print the current weather conditions as per the JSON response from the APIs

    todayForecast.innerHTML = "";

    let todayForecastContainer = document.createElement("div");
    todayForecastContainer.classList.add("card", "bg-light", "text-dark", "p-2");
    todayForecastContainer.setAttribute("id", "current-container");
    todayForecast.append(todayForecastContainer);

    let todayForecastCard = document.createElement('div');
    todayForecastCard.classList.add("card-body");

    //get the current date from the UNIX code from the saved weatherForecastData stored in the weatherForecastData object

    let currentDate = new Date(weatherForecastData.current.dt * 1000);

    let day = currentDate.getDate();

    let currentMonthOptions = { month: "long" };

    let currentMonthFull = new Intl.DateTimeFormat("en-GB", currentMonthOptions).format(currentDate);


    let year = currentDate.getFullYear();

    //dispay the city name from the search and the current date

    cityName.innerHTML = savedData[0].name + " on " + day + " " + currentMonthFull + " " + year

    //create elements to display the desired weather details (weather icon, conditions, temp, wind speed, humidity and UV index)

    let currentForecast = document.getElementById("current-container")

    let currentForecastFragment = document.createDocumentFragment();

    let weatherIcon = document.createElement("img");
    weatherIcon.classList.add("weather-icon");
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForecastData.current.weather[0].icon + "@2x.png");
    weatherIcon.setAttribute("alt", "Icon showing current weather status of " + weatherForecastData.current.weather[0].description);
    currentForecast.appendChild(weatherIcon);

    let currentForecastDetails = ["Conditions: " + weatherForecastData.current.weather[0].main, "Temp: " + weatherForecastData.current.temp + " ℃", "Wind: " + weatherForecastData.current.wind_speed + " kmph", "Humidity: " + weatherForecastData.current.humidity + " %", "UV Index: " + weatherForecastData.current.uvi];

    //create an li element for each weather attribute conditions, temp, wind speed, humidity and UV index

    currentForecastDetails.forEach(function (current) {
        let liEl = document.createElement("li");
        liEl.setAttribute("class", "li-items");
        liEl.textContent = current;
        currentForecastFragment.appendChild(liEl);

    })

    currentForecast.appendChild(currentForecastFragment);

    //add colour-coding to the li element that has the UV Index rating. Create an array from nodeObjects

    let liEls = Array.from(document.querySelectorAll(".li-items"));

    if (weatherForecastData.current.uvi <= 2) {

        liEls[4].setAttribute("class", "bg-success", "text-white");

        console.log(liEls[4]);

    } else if (weatherForecastData.current.uvi >= 3 && weatherForecastData.current.uvi <= 5) {

        liEls[4].setAttribute("class", "bg-warning");
        console.log(liEls[4]);
    }
    else if (weatherForecastData.current.uvi >= 6 && weatherForecastData.current.uvi <= 7) {

        liEls[4].setAttribute("class", "bg-danger", "bg-opacity-50", "text-white");

    } else {

        liEls[4].setAttribute("class", "bg-danger", "text-white");

    }

    // let liEls = Array.from(document.querySelectorAll(".li-items"));

    // console.log(liEls[5]);

    // liEls[5].setAttribute("class", "bg-danger");

    // alert("high uvi");
    // }

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

    //loop through the daily weatherForecastData to get the five-day forecast. Skip over index 0 as that contains current date's daily details

    for (let i = 1; i < Object.keys(weatherForecastData.daily)[6]; i++) {

        //create bootstrap card for the five-day future forecast

        let fiveDayForecastContainer = document.createElement("div");
        fiveDayForecastContainer.classList.add("card", "text-light", "p-2", "m-1", "d-inline-flex");
        fiveDayForecastContainer.setAttribute("id", "five-day-container");
        futureForecast.append(fiveDayForecastContainer);

        //display future dates

        let futureDate = new Date(weatherForecastData.daily[i].dt * 1000);

        // console.log(futureDate);

        let futureDay = futureDate.getDate();

        // console.log(futureday);

        let futureMonthOptions = { month: "long" };

        let futureMonthFull = new Intl.DateTimeFormat("en-GB", futureMonthOptions).format(futureDate);

        // console.log(futureMonthFull);

        let futureYear = futureDate.getFullYear();

        // console.log(futureyear);

        // create weather icons for future weather forecast

        let futureWeatherIcon = document.createElement("img");
        futureWeatherIcon.classList.add("future-weather-icon");
        futureWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForecastData.daily[i].weather[0].icon + "@2x.png");
        futureWeatherIcon.setAttribute("alt", "Icon showing current weather status of " + weatherForecastData.daily[i].weather[0].description);
        fiveDayForecastContainer.appendChild(futureWeatherIcon);


        //create indivudal card elements with five-day forecast details on them

        let futureForecastFragment = document.createDocumentFragment();

        let futureForecastDetails = [futureDay + " " + futureMonthFull + " " + futureYear, "Conditions: " + weatherForecastData.daily[i].weather[0].main, "Temp: " + weatherForecastData.current.temp + " ℃", "Wind: " + weatherForecastData.daily[i].wind_speed + " kmph", "Humidity: " + weatherForecastData.daily[i].humidity + " %"];

        futureForecastDetails.forEach(function (future) {

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

// function getHistory() {


// let historyItem = document.createElement("p");

// let searchItems = searchHistoryArray.push(cityInputVal);




// historyItem.textContent = searchItems;
// previousSearches.appendChild(historyItem);




// let retrieveHistory = JSON.parse(localStorage.getItem(searchHistory)) || [];

// searchHistory.push(retrieveHistory)



// }

// function init() {

//     readThingy;
// }


previousSearches.addEventListener("click", function (event) {
    if (event.target.className === "searchHistoryBtn") {
        console.log("click!");

        let savedHistory = Array.from(document.querySelectorAll(".searchHistoryBtn"));

        cityInputVal = savedHistory[i].value;
        // cityInputVal = "";
        // localStorage.getItem("Thingy");
        getApi();
    }

});
// searchHistoryBtn.addEventListener("click", function (event) {
//     event.stopPropagation();
//     event.target(getApi);

// });
//submit button event listener to start everything off

searchFormEl.addEventListener("submit", formSubmitHandler);