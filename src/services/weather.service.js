import axios from "axios";

const API_KEY = process.env.API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";

class WeatherService {
  async getDailyForecast({ city }) {
    try {
      const response = await axios.get(this._getFetchUrl(city));
      return this._parseResponse(response);
    } catch (err) {
      console.error("Unexpected error while fetching daily forecast");
    }
  }

  createMessage(dto) {
    return `${dto.city} - ${dto.date}\n\nMin: ${dto.minTemp}°C\nMax: ${dto.maxTemp}°C\nAvg.: ${dto.avgTemp}°C\n\nRain chance: ${dto.rainChance}%`;
  }

  _getFetchUrl(city) {
    return `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no`;
  }

  _parseResponse(response) {
    const {
      data: {
        forecast: { forecastday },
        location,
      },
    } = response;

    const today = forecastday.at(0);

    return {
      city: location.name,
      date: today.date,
      minTemp: today.day.mintemp_c,
      maxTemp: today.day.maxtemp_c,
      avgTemp: today.day.avgtemp_c,
      rainChance: today.day.daily_chance_of_rain,
    };
  }
}

const weatherService = new WeatherService();
export { weatherService as WeatherService };
