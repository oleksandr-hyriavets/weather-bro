import { Context } from "koa";
import { ConfigService } from "../services/config.service";
import { CurrencyRateService } from "../services/currency-rate.service";

import { TelegramService } from "../services/telegram.service";
import { WeatherService } from "../services/weather.service";
// import { WordOfTheDayService } from "../services/word-of-the-day.service";
import { ConcatMessageFormatter } from "../formatters/concat-message.formatter";
import { EventsService } from "../services/events.service";
import { DailyInfoService } from "../services/daily-info.service";

type Params = {
  telegramService: TelegramService
}

export const dailyInfoController = async (ctx: Context, { telegramService }: Params) => {
  const { city } = ctx.request.query;

  if (typeof city !== "string") {
    ctx.body = "Query param 'city' is not found";
    ctx.status = 400;

    return ctx;
  }

  const dailyInfoService = new DailyInfoService(telegramService)
  
  try {
    await dailyInfoService.post({
      city,
      chatId: ConfigService.get('CHAT_ID'),
    })

    ctx.status = 200;
    ctx.body = "SUCCESS";
  } catch (err) {
    ctx.body = "Unexpected error";
    ctx.status = 400;
  }
};
