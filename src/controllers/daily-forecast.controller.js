import axios from "axios";
import { Telegraf } from "telegraf";

const BASE_URL = "http://api.weatherapi.com/v1";

const parseDayResponse = (dayResponse) => ({
  date: dayResponse.date,
  minTemp: dayResponse.day.mintemp_c,
  maxTemp: dayResponse.day.maxtemp_c,
  avgTemp: dayResponse.day.avgtemp_c,
  rainChance: dayResponse.day.daily_chance_of_rain,
});

const createTgMessage = (today) => {
  return `Date: ${today.date}\n\nMin: ${today.minTemp}°C\nMax: ${today.maxTemp}°C\nAvg.: ${today.avgTemp}°C\n\nRain chance: ${today.rainChance}%`;
};

const sendTgMessage = (message) => {
  const tgBot = new Telegraf(process.env.TG_BOT_TOKEN);
  tgBot.telegram.sendMessage(Number(process.env.CHAT_ID), message, { disable_notification: true });
};

export const dailyForecastController = async (ctx) => {
  const { city } = ctx.request.query;

  try {
    const { data } = await axios.get(
      `${BASE_URL}/forecast.json?key=${process.env.API_KEY}&q=${city}&days=1&aqi=no&alerts=no`
    );

    const today = parseDayResponse(data.forecast.forecastday[0]);
    const tgMessage = createTgMessage(today);

    sendTgMessage(tgMessage);
  } catch (err) {
    console.error("Unexpected error", err);
  }
};
