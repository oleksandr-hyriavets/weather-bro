import Koa from "koa";
import Router from "@koa/router";

import { dailyInfoController } from "./controllers/daily-info.controller";
import { ConfigService } from "./services/config.service";
import { TelegramService } from "./services/telegram.service";
import { LocationService } from "./services/location.service";
import { DailyInfoService } from "./services/daily-info.service";
import { WeatherService } from "./services/weather.service";

export class DailyInfoApp {
    port = ConfigService.get('PORT') || 5000;

    constructor(
        private router: Router<Koa.DefaultState, Koa.DefaultContext>,
        private app: Koa<Koa.DefaultState, Koa.DefaultContext>,
        private telegramService: TelegramService,
        private locationService: LocationService,
    ) {}

    defineEndpoints(): void {
        this.router.get("/daily-info", (ctx) => dailyInfoController(ctx, {
            telegramService: this.telegramService
        }));
    }

    defineCommands(): void {
        this.telegramService.defineCommands([
            {
                name: '/location',
                handler: ({ messageText }) => {
                    const city = messageText.split(' ').at(1);

                    if (city) {
                        this.locationService.setLocation(city);
                    }
                }
            },
            {
                name: '/dailyInfo',
                handler: async ({ chatId }) => {
                    const dailyInfoService = new DailyInfoService(this.telegramService)
                    try {
                        await dailyInfoService.post({
                            city: this.locationService.getLocation(),
                            chatId,
                        })
                    } catch (err) {
                        console.error(err)
                    }
                }
            },
            {
                name: '/weather',
                handler: async ({ chatId, messageText }) => {
                    const weatherService = new WeatherService();

                    const city = messageText.split(' ').at(1) ?? this.locationService.getLocation();
                    
                    try {
                        const message = await weatherService.getMessage({ city })
                        await this.telegramService.sendMessage(message, {
                            chatId,
                        })
                    } catch (err) {
                        console.error(err)
                    }
                }
            }
        ])
    }

    start(): void {
        const handleListening = () => console.log(`Listening on port ${this.port}`);

        this.app.use(this.router.routes())
            .use(this.router.allowedMethods())
            .listen(this.port)
            .on('listening', handleListening);
    }
}