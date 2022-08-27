import "dotenv/config";

import Koa from "koa";
import Router from "@koa/router";

import { dailyInfoController } from "./controllers/daily-info.controller";

const PORT = process.env.PORT || 5000;

const app = new Koa();
const router = new Router();

router.get("/daily-info", dailyInfoController);

app.use(router.routes()).use(router.allowedMethods()).listen(PORT);
