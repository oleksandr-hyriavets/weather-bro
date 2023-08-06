import "dotenv/config";

import Koa from "koa";
import Router from "@koa/router";

import { DailyInfoApp } from "./daily-info.app";
import { TelegramService } from "./services/telegram.service";
import { ConfigService } from "./services/config.service";
import { LocationService } from "./services/location.service";
import { CurrencyRateService } from "./services/currency-rate.service";

const app = new Koa();
const router = new Router();

const telegramService = new TelegramService(ConfigService.get('TG_BOT_TOKEN'))
const locationService = new LocationService();
const currencyRateService = new CurrencyRateService()

const dailyInfo = new DailyInfoApp(
    router,
    app,
    telegramService,
    locationService,
    currencyRateService,
);

dailyInfo.defineEndpoints();
dailyInfo.defineCommands();
dailyInfo.start();