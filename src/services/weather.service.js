import axios from "axios";
import { getArithmeticMean } from "../utils/math.js";

const API_KEY = process.env.API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";

const ACTIVITY_HOURS_START = 9;
const ACTIVITY_HOURS_END = 20;

class WeatherService {
  async getDailyForecast({ city }) {
    try {
      const response = await axios.get(this._getFetchUrl(city));
      return this._parseResponse(response);
    } catch (err) {
      console.error("Unexpected error while fetching daily forecast");
      throw err;
    }
  }

  createMessage(dto) {
    return `${dto.city} - ${dto.date}\n\nMin: ${dto.minTemp}°C\nMax: ${
      dto.maxTemp
    }°C\nAvg. (${ACTIVITY_HOURS_START}am - ${ACTIVITY_HOURS_END - 1}pm): ${
      dto.avgTemp
    }°C\n\nRain chance: ${dto.rainChance}%`;
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

    const avgTemp = getArithmeticMean(
      today.hour
        .slice(ACTIVITY_HOURS_START, ACTIVITY_HOURS_END)
        .map((hour) => hour.temp_c)
    );

    return {
      city: location.name,
      date: today.date,
      minTemp: today.day.mintemp_c,
      maxTemp: today.day.maxtemp_c,
      avgTemp: avgTemp.toFixed(1),
      rainChance: today.day.daily_chance_of_rain,
    };
  }
}

const weatherService = new WeatherService();
export { weatherService as WeatherService };
