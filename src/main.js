import "dotenv/config";

import Koa from "koa";
import Router from "@koa/router";

import { dailyForecastController } from "./controllers/daily-forecast.controller.js";

const PORT = process.env.PORT || 5000;

const app = new Koa();
const router = new Router();

router.get("/daily-forecast", dailyForecastController);

app.use(router.routes()).use(router.allowedMethods()).listen(PORT);
