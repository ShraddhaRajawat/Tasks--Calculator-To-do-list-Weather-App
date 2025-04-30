const base_url = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "0d827d83c4a8ca95d2d1eb09d2eb8c1e";

let city = document.querySelector("h2");
let temp = document.querySelector("h1");
let desp = document.getElementsByClassName("description")[0];
let humidity = document.getElementsByClassName("humidity")[0];
let windSpeed = document.getElementsByClassName("windSpeed")[0];

async function checkWeather(){
    const cityName = document.querySelector("input");
    

    if(cityName.value === ""){
        alert("Please enter City Name.");
        return;
    }
    const response = await fetch(base_url + `${cityName.value}&appid=${apiKey}&units=metric`);
    let data = await response.json();
    
    city.innerHTML = data["name"];
    city.style.opacity = 1;

    cityName.value = "";
    
    desp.innerHTML = data["weather"][0]["description"];
    desp.style.opacity = 0.8;

    temp.innerHTML = data["main"]["temp"] + "°C";
    temp.style.opacity = 1;

    humidity.innerHTML = data["main"]["humidity"] + " %";

    windSpeed.innerHTML = data["wind"]["speed"] + " km/hr";
}


