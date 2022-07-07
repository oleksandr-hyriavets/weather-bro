import "dotenv/config";

import Koa from "koa";
import Router from "@koa/router";

import { dailyForecastController } from "./controllers/daily-forecast.controller.js";

const app = new Koa();
const router = new Router();

router.get("/daily-forecast", dailyForecastController);

app.use(router.routes()).use(router.allowedMethods()).listen(3000);
