import "dotenv/config";

import Koa from "koa";
import Router from "@koa/router";

import { DailyInfoApp } from "./daily-info.app";
import { TelegramService } from "./services/telegram.service";
import { ConfigService } from "./services/config.service";
import { LocationService } from "./services/location.service";

const app = new Koa();
const router = new Router();

const telegramService = new TelegramService(ConfigService.get('TG_BOT_TOKEN'))
const locationService = new LocationService();

const dailyInfo = new DailyInfoApp(
    router,
    app,
    telegramService,
    locationService,
);

dailyInfo.defineEndpoints();
dailyInfo.defineCommands();
dailyInfo.start();