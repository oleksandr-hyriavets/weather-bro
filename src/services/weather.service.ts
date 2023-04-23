import axios from "axios";
import { getArithmeticMean } from "../utils/math";
import { ConfigService } from "./config.service";
import { IMessageable } from "../interfaces/messageable.interface";

const API_KEY = ConfigService.get('WEATHER_API_KEY');
const BASE_URL = "http://api.weatherapi.com/v1";

interface CreateMessageDto {
  city: string;
  date: string;
  minTemp: string;
  maxTemp: string;
  avgTemp: string;
  rainChance: string;
}

export class WeatherService implements IMessageable {
  private activityHoursStart = 9;
  private activityHoursEnd = 20;

  async getMessage({ city }: { city: string }): Promise<string>  {
    const weather = await this.getDailyForecast({ city });

    return `${weather.city} 🇵🇱 - ${weather.date}\n\nMin: ${weather.minTemp}°C\nMax: ${
      weather.maxTemp
    }°C\nAvg. (${this.activityHoursStart}am - ${this.activityHoursEnd - 1}pm): ${
      weather.avgTemp
    }°C\n\n🌧️ Rain Chance: ${weather.rainChance}%`
  }

  private async getDailyForecast({ city }: { city: string }) {
    try {
      const response = await axios.get(this.getFetchUrl(city));
      return this.parseResponse(response);
    } catch (err) {
      console.error("Unexpected error while fetching daily forecast");
      throw err;
    }
  }

  getActivityHours(): [number, number] {
    return [this.activityHoursStart, this.activityHoursEnd]
  }

  private getFetchUrl(city: string) {
    return `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no`;
  }

  private parseResponse(response: any) {
    const {
      data: {
        forecast: { forecastday },
        location,
      },
    } = response;

    const today = forecastday.at(0);

    const avgTemp = getArithmeticMean(
      today.hour
        .slice(this.activityHoursStart, this.activityHoursEnd)
        .map((hour: { temp_c: number }) => hour.temp_c)
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
