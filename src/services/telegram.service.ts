import { Telegraf } from "telegraf";

interface SendMessageOptions {
  botToken: string;
  chatId: string;
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
}

const telegramService = new TelegramService();
export { telegramService as TelegramService };
