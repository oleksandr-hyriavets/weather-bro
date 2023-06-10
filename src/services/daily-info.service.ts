import { ConcatMessageFormatter } from "../formatters/concat-message.formatter";
import { IMessageBroker } from "../interfaces/message-broker.interface";
import { CurrencyRateService } from "./currency-rate.service";
import { EventsService } from "./events.service";
import { WeatherService } from "./weather.service";

type PostParams = {
    city: string;
    chatId: string;
}

export class DailyInfoService {

    constructor(
        private messageBroker: IMessageBroker
    ) {}

    async post(params: PostParams): Promise<void> {
        const currencyRateService = new CurrencyRateService();
        const weatherService = new WeatherService();
        const concatMessageService = new ConcatMessageFormatter();
        const eventsService = new EventsService();      

        try {
            const messages = await Promise.all([
              weatherService.getMessage({ city: params.city }),
              currencyRateService.getMessage('uah-eur'),
              eventsService.getMessage()
            ].map(promise => promise.catch(() => '')));
        
            const message = concatMessageService.format(messages)
        
            await this.messageBroker.sendMessage(message, {
              chatId: params.chatId,
            });
        } catch (err) {
            throw err;
        }
    }
}