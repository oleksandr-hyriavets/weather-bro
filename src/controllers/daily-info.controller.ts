import { Context } from "koa";
import { ConfigService } from "../services/config.service";
import { CurrencyRateService } from "../services/currency-rate.service";

import { TelegramService } from "../services/telegram.service";
import { WeatherService } from "../services/weather.service";

export const dailyInfoController = async (ctx: Context) => {
  const { city } = ctx.request.query;

  if (typeof city !== "string") {
    ctx.body = "Query param 'city' is not found";
    ctx.status = 400;

    return ctx;
  }

  try {
    const [zlotyToHryvniaRate, dailyWeatherForecast] = await Promise.all([
      CurrencyRateService.getZlotyToHryvniaCurrencyRate(),
      WeatherService.getDailyForecast({ city }),
    ]);
    const message = TelegramService.createMessage({
      city: dailyWeatherForecast.city,
      date: dailyWeatherForecast.date,
      minTemp: dailyWeatherForecast.minTemp,
      maxTemp: dailyWeatherForecast.maxTemp,
      avgTemp: dailyWeatherForecast.avgTemp,
      rainChance: dailyWeatherForecast.rainChance,
      zlotyToHryvniaRate,
    });

    await TelegramService.sendMessage(message, {
      botToken: ConfigService.get('TG_BOT_TOKEN'),
      chatId: ConfigService.get('CHAT_ID'),
    });

    ctx.status = 200;
    ctx.body = "SUCCESS";
  } catch (err) {
    ctx.body = "Unexpected error";
    ctx.status = 400;
  }
};
