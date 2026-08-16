# SkyVibes 🌤️ — Weather Web Application

A colorful, Gen-Z styled weather app built for **Task-05: Weather App**, using the free Open-Meteo API (no API key required).

## Features

- **Live weather data** — fetches current conditions based on a searched city or the user's real location (geolocation)
- **Dynamic theming** — the entire page's colors shift to match real weather: warm sunny tones for clear skies, blue-purple for rain, icy blue for snow, moody purple for storms
- **Animated weather particles** — falling raindrops for rain, drifting snowflakes for snow, a pulsing glow for sun, floating leaves for the default cozy autumn state
- **Weather details card** — temperature, condition, feels-like, humidity, and wind speed
- **Playful copy** — Gen-Z style status messages that change based on conditions
- **Smart city matching** — trusts the API's relevance ranking by default, with a fallback to catch obscure/mismatched small-town results
- **Fully responsive** — layout adapts down to mobile screens

## Files

| File          | Purpose                                      |
|---------------|-----------------------------------------------|
| `Task5.html`  | Page structure (search bar, weather card, particle layer) |
| `Task5.css`   | Theme palettes, particle animations, card/button styling |
| `Task5.js`    | Geocoding + weather fetch logic, theme switching, particle generation |

## APIs used

- **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)** — converts a searched city name into coordinates
- **[Open-Meteo Forecast API](https://open-meteo.com/en/docs)** — fetches current weather conditions for given coordinates
- Both are free and require no API key or sign-up

## How to run

1. Keep all three files (`Task5.html`, `Task5.css`, `Task5.js`) in the **same folder**.
2. Open `Task5.html` in any browser (double-click it, or use a Live Server extension).
3. An internet connection is required — for the Google Fonts (Fredoka, Nunito) and the live weather API calls.
4. Click "use my spot" to allow geolocation, or type a city name and hit search.

## Tech used

- HTML5
- CSS3 (CSS variables, gradients, keyframe animations, media queries)
- Vanilla JavaScript (no frameworks/libraries) — `fetch()` for API calls, Geolocation API for location access
