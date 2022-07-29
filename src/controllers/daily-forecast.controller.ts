import { Context } from "koa";

import { TelegramService } from "../services/telegram.service";
import { WeatherService } from "../services/weather.service";

export const dailyForecastController = async (ctx: Context) => {
  const { city } = ctx.request.query;

  if (typeof city !== "string") {
    ctx.body = "Query param 'city' is not found";
    ctx.status = 400;

    return ctx;
  }

  try {
    const dailyForecast = await WeatherService.getDailyForecast({ city });
    const message = WeatherService.createMessage(dailyForecast);

    await TelegramService.sendMessage(message, {
      botToken: process.env.TG_BOT_TOKEN as string,
      chatId: process.env.CHAT_ID as string,
    });

    ctx.status = 200;
    ctx.body = "SUCCESS";
  } catch (err) {
    ctx.body = "Unexpected error";
    ctx.status = 400;
  }
};
