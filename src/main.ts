import 'dotenv/config';

import { DailyBro } from './daily-bro/daily-bro';

import { TelegramService } from './message-brokers/telegram.service';
import { ConfigService } from './config.service';

import { WeatherPlugin } from './plugins/weather/weather.plugin';
import { CurrencyRatePlugin } from './plugins/currency-rate/currency-rate.plugin';
// import { AstrologyPlugin } from './plugins/astrology/astrology.plugin';

const dailyBro = new DailyBro({
    messageBroker: new TelegramService(ConfigService.get('TG_BOT_TOKEN')),

    plugins: [
        new WeatherPlugin(),
        new CurrencyRatePlugin(),
        // new AstrologyPlugin(),
    ],
});

dailyBro.start();

// test
