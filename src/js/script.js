/* ====================> DOM ASSIGNMENTS <==================== */

const cards = document.querySelectorAll(".card");
const loading = document.querySelectorAll(".loading");
const notFound = document.querySelectorAll(".notFound");
const inputText = document.querySelector(".inputText");
const autocomppleteArea = document.querySelector(".autocomppleteArea");
const searchIcon = document.querySelector(".searchIcon");

const countryCode = document.querySelector(".countryCode");
const flagImg = document.querySelector(".flagImg");
const armsImg = document.querySelector(".armsImg");
const mapLink = document.querySelector(".mapLink");

const cityName = document.querySelector(".cityName");
const weatherSituation = document.querySelector(".weatherSituation");
const temp = document.querySelector(".temp");
const weatherIcon = document.querySelector(".weatherIcon");

const hours = document.querySelectorAll(".hour");

const feelsLike = document.querySelector(".feelsLike");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const uvIndex = document.querySelector(".uvIndex");

const days = document.querySelectorAll(".day");

const logo = document.querySelector(".logo");

/* ====================> HELPER FUNCTIONS <==================== */

const getToday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const loadingDisplay = (command) => {
  loading.forEach((item) => {
    item.classList.toggle("hide", !command);
  });
};

const notFoundDisplay = (command) => {
  notFound.forEach((item) => {
    item.classList.toggle("hide", !command);
  });
};

const cardsDisplay = (command) => {
  cards.forEach((item) => {
    item.classList.toggle("hide", !command);
  });
};

/* ====================> FUNCTIONS FOR FETCHING DATA <==================== */

const fetchWeatherData = async (city) => {
  try {
    const apiSettings = {
      apiKey: "aa8e563533ad4d4ea5b140044240405",
      days: 7,
      aqi: "no",
      alerts: "no",
    };
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiSettings.apiKey}&q=${city}&days=${apiSettings.days}&aqi=${apiSettings.aqi}&alerts=${apiSettings.alerts}`;
    const resposne = await fetch(url, { method: "GET" });

    if (!resposne.ok) throw new Error("weather data not found");

    const weatherData = await resposne.json();

    return weatherData;
  } catch (error) {
    // do something
  }
};

const fetchAutoComplete = async (cityName) => {
  try {
    const apiSettings = {
      apiKey: "aa8e563533ad4d4ea5b140044240405",
    };
    const url = `https://api.weatherapi.com/v1/search.json?key=${apiSettings.apiKey}&q=${cityName}`;

    const resposne = await fetch(url, { method: "GET" });

    if (!resposne.ok) throw new Error("city not found");

    const data = await resposne.json();

    return data;
  } catch (error) {}
};

const startFetch = async (city) => {
  notFoundDisplay(false);
  cardsDisplay(false);
  loadingDisplay(true);

  await fetchWeatherData(city)
    .then((data) => {
      console.log(data);
      weatherData(data);

      cardsDisplay(true);
    })
    .catch(() => {
      notFoundDisplay(true);
    })
    .finally(() => {
      loadingDisplay(false);
      inputText.value = "";
    });
};

/* ====================> HANDLE FETCHING DATAS <==================== */

const weatherData = (data) => {
  cityName.textContent = `${data.location.name} (${data.location.country})`;
  weatherSituation.textContent = data.current.condition.text;
  temp.textContent = `${Math.round(data.current.temp_c)}°C`;
  weatherIcon.src = data.current.condition.icon;

  hours.forEach((item, index) => {
    item.children[0].textContent = data.forecast.forecastday[0].hour[index * 4][
      "time"
    ].slice(11, 16);

    item.children[1].children[0].src =
      data.forecast.forecastday[0].hour[index * 4].condition.icon;

    item.children[2].textContent =
      Math.round(data.forecast.forecastday[0].hour[index * 4]["temp_c"]) + "°C";
  });

  feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
  humidity.textContent = `${data.current.humidity}%`;
  wind.textContent = `${Math.round(data.current.wind_kph)} km/h`;
  uvIndex.textContent = `${data.current.uv}`;

  days.forEach((item, index) => {
    item.children[0].textContent =
      getToday[new Date(data.forecast.forecastday[index].date).getDay()];

    item.children[1].children[0].children[0].src =
      data.forecast.forecastday[index].day.condition.icon;
    item.children[1].children[1].textContent =
      data.forecast.forecastday[index].day.condition.text;

    item.children[2].textContent =
      Math.round(data.forecast.forecastday[index].day.avgtemp_c) + "°C";
  });

  cardsDisplay(true);
};

const autoComplete = (data) => {
  if (data.length != 0) {
    autocomppleteArea.classList.add("cusBorder");
    const listItems = data.reduce(
      (acc, x) =>
        acc +
        `<li onclick="searchIt('${x.name}')">
        <h1>${x.name}</h1> 
      <p>${x.country}</p>
      </li>`,
      ""
    );

    autocomppleteArea.innerHTML = "<ul>" + listItems + "</ul>";
  } else {
    autocomppleteArea.innerHTML = "";
  }
};

function searchIt(cityName) {
  autocomppleteArea.innerHTML = "";

  startFetch(cityName);
}

/* ====================> FIRST FETCH <==================== */

startFetch("Baku");

/* ====================> SEARCH CITIES <==================== */

searchIcon.addEventListener("click", async () => {
  const city = inputText.value;

  if (city) {
    await startFetch(city);
    autocomppleteArea.innerHTML = "";
  }
});

inputText.addEventListener("keyup", async (e) => {
  const value = e.target.value;

  if (e.key == "Enter" && value) {
    await startFetch(value);
    autocomppleteArea.innerHTML = "";

    setTimeout(function () {
      inputText.blur(); // hide mobile keyboard when click enter
    }, 50);
  }
});

/* ====================> AUTOCOMPLETE <==================== */

inputText.addEventListener("keyup", (e) => {
  const value = e.target.value;

  if (value) {
    fetchAutoComplete(value)
      .then((data) => {
        autoComplete(data);
      })
      .catch(() => {
        // do something
      });
  } else {
    autocomppleteArea.innerHTML = "";
  }
});

/* ====================> REFRESH PAGE <==================== */

logo.addEventListener("click", () => {
  window.location.reload();
});
