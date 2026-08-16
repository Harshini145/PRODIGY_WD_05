// ============================================
// SkyVibes — Gen-Z Weather App
// Uses Open-Meteo (free, no API key) for geocoding + forecast
// ============================================

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locateBtn = document.getElementById('locateBtn');
const hint = document.getElementById('hint');
const particleLayer = document.getElementById('particleLayer');

const weatherIcon = document.getElementById('weatherIcon');
const weatherTemp = document.getElementById('weatherTemp');
const weatherCondition = document.getElementById('weatherCondition');
const weatherLocation = document.getElementById('weatherLocation');
const metaFeels = document.getElementById('metaFeels');
const metaHumidity = document.getElementById('metaHumidity');
const metaWind = document.getElementById('metaWind');

// ---------- Weather code -> category, icon, label, playful message ----------
function classifyWeather(code) {
  if (code === 0) return { theme: 'clear', icon: '☀️', label: 'clear skies', vibe: "it's giving main character energy ☀️" };
  if ([1, 2, 3].includes(code)) return { theme: 'cloudy', icon: '⛅', label: 'partly cloudy', vibe: "soft cloudy mood today ⛅" };
  if ([45, 48].includes(code)) return { theme: 'fog', icon: '🌫️', label: 'foggy', vibe: "mysterious foggy vibes rn 🌫️" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { theme: 'rain', icon: '🌧️', label: 'rainy', vibe: "grab an umbrella bestie ☔" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { theme: 'snow', icon: '❄️', label: 'snowy', vibe: "snow day energy incoming ❄️" };
  if ([95, 96, 99].includes(code)) return { theme: 'storm', icon: '⛈️', label: 'thunderstorm', vibe: "stay in, it's dramatic out there ⛈️" };
  return { theme: 'cloudy', icon: '🌥️', label: 'unclear skies', vibe: "the sky can't decide either 🤷" };
}

function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  buildParticles(theme);
}

// ---------- Particle builder ----------
function clearParticles() {
  particleLayer.innerHTML = '';
}

function buildParticles(theme) {
  clearParticles();

  if (theme === 'rain' || theme === 'storm') {
    for (let i = 0; i < 40; i++) {
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      drop.style.left = `${Math.random() * 100}vw`;
      drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      drop.style.animationDelay = `${Math.random() * 2}s`;
      particleLayer.appendChild(drop);
    }
  } else if (theme === 'snow') {
    const flakes = ['❄', '❅', '❆'];
    for (let i = 0; i < 30; i++) {
      const flake = document.createElement('div');
      flake.className = 'snowflake';
      flake.textContent = flakes[Math.floor(Math.random() * flakes.length)];
      flake.style.left = `${Math.random() * 100}vw`;
      flake.style.fontSize = `${0.7 + Math.random() * 0.9}rem`;
      flake.style.animationDuration = `${4 + Math.random() * 4}s`;
      flake.style.animationDelay = `${Math.random() * 4}s`;
      particleLayer.appendChild(flake);
    }
  } else if (theme === 'fall') {
    const leaves = ['🍁', '🍂', '🍃'];
    for (let i = 0; i < 16; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
      leaf.style.left = `${Math.random() * 100}vw`;
      leaf.style.animationDuration = `${5 + Math.random() * 4}s`;
      leaf.style.animationDelay = `${Math.random() * 5}s`;
      particleLayer.appendChild(leaf);
    }
  } else if (theme === 'clear') {
    const ray = document.createElement('div');
    ray.className = 'sunray';
    particleLayer.appendChild(ray);
  }
}

// ---------- Rendering ----------
function renderWeather(data, locationName) {
  const { theme, icon, label, vibe } = classifyWeather(data.weather_code);

  setTheme(theme);
  weatherIcon.textContent = icon;
  weatherTemp.textContent = `${Math.round(data.temperature_2m)}°C`;
  weatherCondition.textContent = label;
  weatherLocation.textContent = locationName;
  metaFeels.textContent = `${Math.round(data.apparent_temperature)}°C`;
  metaHumidity.textContent = `${Math.round(data.relative_humidity_2m)}%`;
  metaWind.textContent = `${Math.round(data.wind_speed_10m)} km/h`;
  hint.textContent = vibe;
}

async function fetchWeather(lat, lon, locationName) {
  hint.textContent = 'fetching the vibes... ⏳';
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const json = await res.json();
    renderWeather(json.current, locationName);
  } catch (err) {
    hint.textContent = "couldn't fetch weather rn, try again? 😭";
  }
}
async function searchCity(city) {
  if (!city.trim()) return;
  hint.textContent = 'looking that place up... 🔎';
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en`;
    const res = await fetch(geoUrl);
    const json = await res.json();

    if (!json.results || json.results.length === 0) {
      hint.textContent = "couldn't find that place, try another spelling? 🤔";
      return;
    }

    const results = json.results;
    const topResult = results[0];
    const topPop = topResult.population || 0;

    // Trust the API's own top (relevance-ranked) result by default.
    // Only override it if that top match looks like an obscure/tiny place
    // AND a clearly bigger, well-known match exists among the other results.
    let place = topResult;
    const OBSCURE_THRESHOLD = 50000;

    if (topPop < OBSCURE_THRESHOLD) {
      const biggerMatch = results.find(r => (r.population || 0) > topPop * 5 && (r.population || 0) > OBSCURE_THRESHOLD);
      if (biggerMatch) {
        place = biggerMatch;
      }
    }

    const locationLabel = [place.name, place.admin1, place.country].filter(Boolean).join(', ');
    fetchWeather(place.latitude, place.longitude, locationLabel);
  } catch (err) {
    hint.textContent = "something broke looking that up 😵‍💫 try again";
  }
}


function useMyLocation() {
  if (!navigator.geolocation) {
    hint.textContent = "your browser won't share location 😔";
    return;
  }
  hint.textContent = 'finding you... 📍';
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude, 'your location');
    },
    () => {
      hint.textContent = "couldn't get your location, search a city instead 🗺️";
    }
  );
}

searchBtn.addEventListener('click', () => searchCity(cityInput.value));
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchCity(cityInput.value);
});
locateBtn.addEventListener('click', useMyLocation);

// ---------- Init: cozy fall theme by default ----------
buildParticles('fall');