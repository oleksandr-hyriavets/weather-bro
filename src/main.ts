import "dotenv/config";

import Koa from "koa";
import Router from "@koa/router";

import { dailyInfoController } from "./controllers/daily-info.controller";
import { ConfigService } from "./services/config.service";

class DailyInfo {
    port = ConfigService.get('PORT') || 5000;

    constructor(
        private router: Router<Koa.DefaultState, Koa.DefaultContext>,
        private app: Koa<Koa.DefaultState, Koa.DefaultContext>,
    ) {}

    defineEndpoints(): void {
        this.router.get("/daily-info", dailyInfoController);
    }

    start(): void {
        const handleListening = () => console.log(`Listening on port ${this.port}`);

        this.app.use(this.router.routes())
            .use(this.router.allowedMethods())
            .listen(this.port)
            .on('listening', handleListening);
    }
}

const app = new Koa();
const router = new Router();

const dailyInfo = new DailyInfo(router, app);

dailyInfo.defineEndpoints();
dailyInfo.start();