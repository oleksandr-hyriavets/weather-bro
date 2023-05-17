import "dotenv/config";

import Koa from "koa";
import Router from "@koa/router";

import { DailyInfo } from "./daily-info.app";

const app = new Koa();
const router = new Router();

const dailyInfo = new DailyInfo(router, app);

dailyInfo.defineEndpoints();
dailyInfo.start();