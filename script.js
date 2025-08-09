function getlocation() {

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        console.log("Latitude:", lat);
        console.log("Longitude:", lon);

        // Show on page
        document.getElementById("location").textContent =
            `Latitude: ${lat}, Longitude: ${lon}`;
        // Call weather API
        const apiKey = "e43e276b6a85a35682551f79e24d0669"; // API key
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data); // See full API response
                let city = data.name;
                let temp = data.main.temp;
                let weather = data.weather[0].main;
                // Change background dynamically based on temperature
                changeBackgroundByCondition(weather);


                document.querySelector(".recc").innerHTML =
                    `<p>City: ${city}</p>
                    <p>Temperature: ${temp}°C</p>
                     <p>Weather: ${weather}</p>
                      <p><strong>Recommendation:</strong> ${getClothingRecommendation(temp, weather)}</p>
            `;
            })
            .catch(err => {
                console.error("Error fetching weather:", err);
            });
    }
    function error() {
        console.log("Unable to retrieve location");
        document.getElementById("location").textContent =
            "❌ Location access denied";
    }
}
function getWeather() {
    let city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    fetchWeatherByCity(city);
}

function fetchWeatherByCity(city) {
    const apiKey = "e43e276b6a85a35682551f79e24d0669";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod === "404") {
                alert("City not found. Please check spelling.");
                return;
            }

            const temp = data.main.temp;
            const condition = data.weather[0].main;
            const City = data.name;
            // Change background dynamically based on temperature
            changeBackgroundByCondition(condition);
            if (condition == "Rain" || condition == "Clouds") {
                document.getElementById("header").style.color = "white";
                if(condition=="Rain"||condition=="Snow")
                 document.getElementById("content").style.textShadow = " none";
            }
            else if (condition == Clear) {
                document.getElementById("header").style.color = "black";
                

            }




            document.getElementById("recc").innerHTML = `
<p>City: ${City}</p>
                <p>Temperature: ${temp}°C</p>
                <p>Condition: ${condition}</p>
                <p><strong>Recommendation:</strong> ${getClothingRecommendation(temp, condition)}</p>
            `;
        })
        .catch(err => console.error("Error fetching weather:", err));
}

function getClothingRecommendation(temp, condition) {
    if (temp < 15) return "Wear a warm jacket.";
    if (temp >= 15 && temp < 25) return "Light jacket or sweater.";
    if (temp >= 25) return "T-shirt and shorts.";
    return "Dress comfortably.";
}
let vantaEffect = null;

function getColorScheme(condition) {
    switch (condition.toLowerCase()) {
        case "clear":
            return {
                backgroundColor: 0x87ceeb,
                skyColor: 0x68b8d7,
                cloudColor: 0xffffff,
                cloudShadowColor: 0x183550,
                sunColor: 0xff9919,
                sunGlareColor: 0xff6633,
                sunlightColor: 0xff9933,

            };
        case "clouds":
            return {
                 backgroundColor: 0x99b3cc,   // muted medium blue
        skyColor: 0x6f8fa6,          // cloudy sky tone
        cloudColor: 0xd0d6db,        // cool grey clouds
        cloudShadowColor: 0x5c6b78,  // deeper shadow
        sunColor: 0xffb84d,          // warm but slightly dimmed sun
        sunGlareColor: 0xffa64d,
        sunlightColor: 0xffbb66,     // softened sunlight
         };
        case "rain":
            return {
                backgroundColor: 0x2d3b47,
                skyColor: 0x3f4d59,
                cloudColor: 0x4b5a68,
                cloudShadowColor: 0x1f2a33,
                sunColor: 0xD9B96A,
                sunGlareColor: 0xff9966,
                sunlightColor: 0xffcc66

            };
        case "snow":
            return {
                backgroundColor: 0x0d1b2a, // dark bluish
                skyColor: 0x1b263b,
                cloudColor: 0x415a77,
                cloudShadowColor: 0x0d1b2a,
                sunColor: 0xe0e1dd,
                sunGlareColor: 0xc9d6df,
                sunlightColor: 0xe0e1dd
            };
        default:
            return {
                backgroundColor: 0x87ceeb,
                skyColor: 0x68b8d7,
                cloudColor: 0xffffff,
                cloudShadowColor: 0x183550,
                sunColor: 0xff9919,
                sunGlareColor: 0xff6633,
                sunlightColor: 0xff9933
            };
    }
}

function changeBackgroundByCondition(condition) {
    const colors = getColorScheme(condition);

    if (vantaEffect) vantaEffect.destroy(); // Remove previous effect

    vantaEffect = VANTA.CLOUDS({
        el: "body",
        mouseControls: true,
        touchControls: true,
        minHeight: 200.00,
        minWidth: 200.00,
        backgroundColor: colors.backgroundColor,
        skyColor: colors.skyColor,
        cloudColor: colors.cloudColor,
        cloudShadowColor: colors.cloudShadowColor,
        sunColor: colors.sunColor,
        sunGlareColor: colors.sunGlareColor,
        sunlightColor: colors.sunlightColor,

        speed: 1
    });
}