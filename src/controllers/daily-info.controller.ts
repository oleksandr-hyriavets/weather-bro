import { Context } from "koa";
import { ConfigService } from "../services/config.service";
import { CurrencyRateService } from "../services/currency-rate.service";

import { TelegramService } from "../services/telegram.service";
import { WeatherService } from "../services/weather.service";
// import { WordOfTheDayService } from "../services/word-of-the-day.service";
import { ConcatMessageFormatter } from "../formatters/concat-message.formatter";
import { EventsService } from "../services/events.service";

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
  // const wordOfTheDayService = new WordOfTheDayService();
  const concatMessageService = new ConcatMessageFormatter();
  const eventsService = new EventsService();

  try {
    const messages = await Promise.all([
      weatherService.getMessage({ city }),
      currencyRateService.getMessage(),
      eventsService.getMessage()
      // wordOfTheDayService.getMessage(),
    ]);

    const message = concatMessageService.format(messages)

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
