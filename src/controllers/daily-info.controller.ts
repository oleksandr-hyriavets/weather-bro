import { Context } from "koa";
import { ConfigService } from "../services/config.service";
import { CurrencyRateService } from "../services/currency-rate.service";

import { TelegramService } from "../services/telegram.service";
import { WeatherService } from "../services/weather.service";
import { TgMessageFormatter } from "../formatters/tg-message.formatter";
import { WordOfTheDayService } from "../services/word-of-the-day.service";

export const dailyInfoController = async (ctx: Context) => {
  const { city } = ctx.request.query;

  if (typeof city !== "string") {
    ctx.body = "Query param 'city' is not found";
    ctx.status = 400;

    return ctx;
  }

  const currencyRateService = new CurrencyRateService();
  const weatherService = new WeatherService();
  const telegramService = new TelegramService();
  const tgMessageFormatter = new TgMessageFormatter();
  const wordOfTheDayService = new WordOfTheDayService();

  try {
    const [
      zlotyToHryvniaRate,
      dailyWeatherForecast,
      wordOfTheDay,
    ] = await Promise.all([
      currencyRateService.getZlotyToHryvniaCurrencyRate(),
      weatherService.getDailyForecast({ city }),
      wordOfTheDayService.getWordOfTheDay(),
    ]);

    const message = tgMessageFormatter.format({
      city: dailyWeatherForecast.city,
      date: dailyWeatherForecast.date,
      minTemp: dailyWeatherForecast.minTemp,
      maxTemp: dailyWeatherForecast.maxTemp,
      avgTemp: dailyWeatherForecast.avgTemp,
      rainChance: dailyWeatherForecast.rainChance,
      zlotyToHryvniaRate,
      // @todo change to Array.prototype.at
      activityHoursStart: weatherService.getActivityHours()[0],
      activityHoursEnd: weatherService.getActivityHours()[1],
      wordOfTheDayUkranian: wordOfTheDay.ukranian,
      wordOfTheDayPolish: wordOfTheDay.polish,
    });

    await telegramService.sendMessage(message, {
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
