import { Context, NarrowedContext, Telegraf } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { MountMap } from "telegraf/typings/telegram-types";
import { IMessageBroker } from "../interfaces/message-broker.interface";

interface SendMessageOptions {
  chatId: string;
}

type RawCommandCtx = NarrowedContext<Context<Update>, {
  message: Update.New & Update.NonChannel & Message.TextMessage;
  update_id: number;
}>

export type CommandCtx = {
  messageText: string;
  chatId: number;
}

type Command = {
  name: string;
  handler: (ctx: CommandCtx) => void
}

export class TelegramService implements IMessageBroker {
  private bot: Telegraf<Context<Update>>;

  constructor(botToken: string) {
    this.bot = new Telegraf(botToken);
    this.bot.launch();
  }

  async defineCommands(commands: Command[]): Promise<void> {
     commands.forEach(({ name, handler }) => {
        this.bot.command(name, (ctx) => handler(this.parseCommandCtx(ctx)))
     })
  }

  async sendMessage(message: string, options: SendMessageOptions) {
    try {
      await this.bot.telegram.sendMessage(options.chatId, message);
    } catch (err) {
      console.error("Unexpected error while sending message", err);
      throw err;
    }
  }

  private parseCommandCtx(ctx: RawCommandCtx): CommandCtx {
    return {
      messageText: ctx.update.message.text,
      chatId: ctx.chat.id,
    }
  }
}
