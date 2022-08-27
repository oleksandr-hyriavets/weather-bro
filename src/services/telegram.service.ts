import { Telegraf } from "telegraf";
import { ACTIVITY_HOURS_START, ACTIVITY_HOURS_END } from "./weather.service";

interface SendMessageOptions {
  botToken: string;
  chatId: string;
}

interface CreateMessageDto {
  city: string;
  date: string;
  minTemp: string;
  maxTemp: string;
  avgTemp: string;
  rainChance: string;
  zlotyToHryvniaRate: string;
}

class TelegramService {
  async sendMessage(message: string, options: SendMessageOptions) {
    try {
      const tgBot = new Telegraf(options.botToken);
      await tgBot.telegram.sendMessage(options.chatId, message);
    } catch (err) {
      console.error("Unexpected error while sending message", err);
      throw err;
    }
  }

  createMessage(dto: CreateMessageDto) {
    return `${dto.city} 🇵🇱 - ${dto.date}\n\nMin: ${dto.minTemp}°C\nMax: ${
      dto.maxTemp
    }°C\nAvg. (${ACTIVITY_HOURS_START}am - ${ACTIVITY_HOURS_END - 1}pm): ${
      dto.avgTemp
    }°C\n\n🌧️ Rain Chance: ${dto.rainChance}%\n\n🇺🇦 -> 🇵🇱: ${
      dto.zlotyToHryvniaRate
    }`;
  }
}

const telegramService = new TelegramService();
export { telegramService as TelegramService };
