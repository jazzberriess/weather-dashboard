//API key

const APIKey = "6b826d4c34586e17f4f669d088a91aed";

// setting global variables

let searchFormEl = document.getElementById("search-form");

let cityName = document.getElementById("current-city-name");

let todayForecast = document.getElementById("today-forecast");

let forecastDetails = document.getElementById("forecast-details");

let futureForecast = document.getElementById("future-forecast");

let searchBtn = document.getElementById("search-btn");

let clearHistory = document.getElementById("clear-history-btn");

let previousSearches = document.getElementById("previous-searches");

let cityInputVal = [];

let i = 0;

// empty objects to store JSON data received from API

let savedData = {};

let weatherForecastData = {};


//prevent form from being cleared upon clicking search and prevent user from not entering a city

function formSubmitHandler(event) {
    event.preventDefault();

    cityInputVal = document.getElementById("city-search-input").value;

    if (!cityInputVal) {
        alert("Please enter a city");
        return;
    }

    saveHistory();

    getApi();

}

//call the API

function getApi() {

    //API request based on city name to obtain the latitude and longitude

    // console.log(cityInputVal)

    let queryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityInputVal + "&appid=" + APIKey;

    fetch(queryUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            } else {
                return response.json();
            }
        })

        //save the data from the latitude and longitude API request to empty object. Alert user if their input is invalid and resulted in the API promise not being fulfilled

        .then(function (data) {
            // console.log(data)

            savedData = data;

            //if no data was retrieved from the API call, alert the user that the input was invalid

            if (savedData.length === 0) {
                alert("Sorry! We couldn't find " + cityInputVal + ". Please try again");
                return;

            } else {

                //Second API request based on latitude and longitude that we obtained from our first API request to retrieve weather data for that location

                return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + savedData[0].lat + "&lon=" + savedData[0].lon + "&units=metric&exclude=hourly,minutely&appid=" + APIKey)
            }

        })
        .then(function (response) {
            if (response.ok) {
                console.log(response);
            }
            return response.json();
        })

        //save the second API request's data to the second empty object
        .then(function (data) {

            console.log(data);

            weatherForecastData = data

            //if no data was retrieved from second API call, alert user that there was an issue

            if (!Object.keys(weatherForecastData).length) {
                alert("Unable to display weather for that location. Please try again.")
            } else {

                printWeather();

            }
        })
        .catch(function (error) {
            console.log(error);
        });
}


function printWeather() {

    //print the current weather conditions as per the JSON response from the APIs

    todayForecast.innerHTML = "";

    futureForecast.innerHTML = "";

    let todayForecastContainer = document.createElement("div");
    todayForecastContainer.classList.add("card", "text-dark", "p-2", "colour-changes", "pt-3");
    todayForecastContainer.setAttribute("id", "current-container");
    todayForecast.append(todayForecastContainer);

    let todayForecastCard = document.createElement('div');
    todayForecastCard.classList.add("card-body");

    //get the current date from the UNIX code from the saved weatherForecastData stored in the weatherForecastData object

    let currentDate = new Date(weatherForecastData.current.dt * 1000);

    //get the weekday and format it as the full weekday name

    let weekdayOptions = { weekday: "long" };

    let currentWeekday = new Intl.DateTimeFormat("en-GB", weekdayOptions).format(currentDate);

    //get the current date

    let day = currentDate.getDate();

    // get the current month and format it as the full month name

    let currentMonthOptions = { month: "long" };

    let currentMonthFull = new Intl.DateTimeFormat("en-GB", currentMonthOptions).format(currentDate);

    //get the year and display it as the full year

    let year = currentDate.getFullYear();

    //dispay the city name and country from the search and the current date

    let countryName = new Intl.DisplayNames(["en"], { type: "region" });

    cityName.innerHTML = savedData[0].name + ", " + countryName.of(savedData[0].country);

    //display the date

    let displayDate = document.createElement("p");
    displayDate.classList.add("display-date");
    displayDate.textContent = currentWeekday + ", " + day + " " + currentMonthFull + " " + year;

    cityName.appendChild(displayDate);

    //create elements to display the desired weather details (weather icon, conditions, temp, wind speed, humidity and UV index)

    let currentForecast = document.getElementById("current-container")

    let currentForecastFragment = document.createDocumentFragment();

    let weatherIcon = document.createElement("img");
    weatherIcon.classList.add("weather-icon");
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForecastData.current.weather[0].icon + "@2x.png");
    weatherIcon.setAttribute("alt", "Icon showing current weather status of " + weatherForecastData.current.weather[0].description);
    currentForecast.appendChild(weatherIcon);

    let currentForecastDetails = ["Conditions: " + weatherForecastData.current.weather[0].main, "Temp: " + weatherForecastData.current.temp + " ℃", "Feels like: " + weatherForecastData.current.feels_like + " ℃", "Wind: " + weatherForecastData.current.wind_speed + " kmph", "Humidity: " + weatherForecastData.current.humidity + " %", "UV Index: " + weatherForecastData.current.uvi];

    //create an li element for each weather attribute conditions, temp, wind speed, humidity and UV index

    let ulEl = document.createElement("ul");

    currentForecastDetails.forEach(function (current) {

        let liEl = document.createElement("li");
        liEl.setAttribute("class", "li-items");
        liEl.textContent = current;
        ulEl.appendChild(liEl)
        currentForecastFragment.appendChild(ulEl);

    })

    currentForecast.appendChild(currentForecastFragment);

    //add colour-coding to the li element that has the UV Index rating. Create an array from nodeObjects

    let liEls = Array.from(document.querySelectorAll(".li-items"));

    if (weatherForecastData.current.uvi <= 2) {

        liEls[5].classList.add("bg-success", "text-white");

    } else if (weatherForecastData.current.uvi >= 2 && weatherForecastData.current.uvi <= 5) {

        liEls[5].classList.add("bg-warning");

    }
    else if (weatherForecastData.current.uvi >= 5 && weatherForecastData.current.uvi <= 7) {

        liEls[5].classList.add("bg-danger", "bg-opacity-50", "text-white");

    } else {

        liEls[5].classList.add("bg-danger", "text-white");

    }

    //function to make the background of today's forecast change depending on the weather condition

    currentWeatherColour();

    displayFutureForecast();
}

// Display details for 5 day forecast

function displayFutureForecast() {



    for (let i = 1; i < Object.keys(weatherForecastData.daily)[6]; i++) {

        //create bootstrap card for the five-day future forecast

        let fiveDayForecastContainer = document.createElement("div");
        fiveDayForecastContainer.classList.add("col", "card", "text-white", "flex-grow-1");
        fiveDayForecastContainer.setAttribute("id", "five-day-container");
        let ulEl = document.createElement("ul");
        fiveDayForecastContainer.appendChild(ulEl);
        futureForecast.append(fiveDayForecastContainer);

        //display future dates

        let futureDate = new Date(weatherForecastData.daily[i].dt * 1000);

        let futureDay = futureDate.getDate();

        let futureMonthOptions = { month: "long" };

        let futureMonthFull = new Intl.DateTimeFormat("en-GB", futureMonthOptions).format(futureDate);

        let futureYear = futureDate.getFullYear();

        // create weather icons for future weather forecast

        let futureWeatherIcon = document.createElement("img");
        futureWeatherIcon.classList.add("future-weather-icon");
        futureWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForecastData.daily[i].weather[0].icon + "@2x.png");
        futureWeatherIcon.setAttribute("alt", "Icon showing current weather status of " + weatherForecastData.daily[i].weather[0].description);
        fiveDayForecastContainer.appendChild(futureWeatherIcon);


        //create indivudal card elements with five-day forecast details on them

        let futureForecastFragment = document.createDocumentFragment();

        let futureForecastDetails = [futureDay + " " + futureMonthFull + " " + futureYear, "Conditions: " + weatherForecastData.daily[i].weather[0].main, "Min: " + weatherForecastData.daily[i].temp.min + " ℃", "Max: " + weatherForecastData.daily[i].temp.max + " ℃", "Wind: " + weatherForecastData.daily[i].wind_speed + " kmph", "Humidity: " + weatherForecastData.daily[i].humidity + " %"];


        futureForecastDetails.forEach(function (future) {

            let liEl = document.createElement("li");
            liEl.textContent = future;
            futureForecastFragment.appendChild(liEl);

        })

        fiveDayForecastContainer.appendChild(futureForecastFragment);
    }

}

//add coloured backgrounds to the current forecast card based on weather description from the API call

function currentWeatherColour() {

    let colourChanges = document.getElementById("current-container");
    if (weatherForecastData.current.weather[0].main === "Thunderstorm") {
        colourChanges.classList.add("class", "thunderstorm");
    } else if (weatherForecastData.current.weather[0].main === "Drizzle") {
        colourChanges.classList.add("class", "drizzle");
    } else if (weatherForecastData.current.weather[0].main === "Rain") {
        colourChanges.classList.add("class", "rain");
    } else if (weatherForecastData.current.weather[0].main === "Snow") {
        colourChanges.classList.add("class", "snow");
    } else if (weatherForecastData.current.weather[0].main === "Clear") {
        colourChanges.classList.add("class", "clear");
    } else if (weatherForecastData.current.weather[0].main === "Clouds") {
        colourChanges.classList.add("class", "clouds");
    } else {
        colourChanges.classList.add("class", "atmosphere");
    }
}

//Save search history

function saveHistory() {

    //object to store in local storage that saves the cityInputVal

    let savedCity = {

        searchedCity: cityInputVal
    }

    //retrieve the info from local storage

    let savedCities = JSON.parse(localStorage.getItem("searchHistory"));

    //if there's no saved cities, then create an empty array

    if (savedCities === null) {
        savedCities = [];
    }

    //add the users input into the array and then save it to local storage

    savedCities.push(savedCity);

    localStorage.setItem("searchHistory", JSON.stringify(savedCities));

    //create buttons for user to click on in the previous searches section

    let printHistory = document.createElement("button");
    printHistory.setAttribute("class", "searchHistoryBtn")
    printHistory.textContent = savedCity.searchedCity;
    printHistory.value = savedCity.searchedCity;
    previousSearches.appendChild(printHistory);

}

//display search history

function displayHistory() {

    //retrieve the search history from local storage and if there's nothing stored, end the function

    let searchData = JSON.parse(localStorage.getItem("searchHistory"));

    if (!searchData) {
        return;

    }
    //create a button for each item in the array
    for (i = 0; i < searchData.length; i++) {
        console.log(searchData.length)

        let printHistoryBtn = document.createElement("button");
        printHistoryBtn.setAttribute("class", "searchHistoryBtn");
        printHistoryBtn.textContent = searchData[i].searchedCity;
        printHistoryBtn.value = searchData[i].searchedCity;
        previousSearches.appendChild(printHistoryBtn);

    }
}

//event handlers for the previous history buttons so that the user can click on them to display previously searched city weather details

previousSearches.addEventListener("click", function (event) {
    if (event.target.className === "searchHistoryBtn") {
        // console.log("click!");
        event.stopPropagation;

        cityInputVal = event.target.value;

        getApi();
    }

});

//event handler for clear history button

clearHistory.addEventListener("click", function () {

    // console.log("click!");
    localStorage.clear();
    previousSearches.innerHTML = "";

})

//submit button event listener to start everything off

searchFormEl.addEventListener("submit", formSubmitHandler);

function init() {
    displayHistory();
}

init();