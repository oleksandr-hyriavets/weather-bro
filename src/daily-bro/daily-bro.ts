import Koa from "koa";
import Router from "@koa/router";

import { ConfigService } from "../config.service";
import { TelegramService } from "../message-brokers/telegram.service";
import { dailyInfoController } from "./controllers/daily-info.controller";
import { IMessageBroker } from "./interfaces/message-broker.interface";

type PluginParams = {
    city?: string;
}

export interface IPlugin {
    getMessage(params?: PluginParams): Promise<string>
}

type Params = {
    plugins: IPlugin[]
    messageBroker: IMessageBroker
}

export class DailyBro {
    private port = ConfigService.get('PORT') || 5000

    private router: Router<Koa.DefaultState, Koa.DefaultContext>
    private app: Koa<Koa.DefaultState, Koa.DefaultContext>

    private messageBroker: IMessageBroker

    private plugins: IPlugin[] = []

    constructor(params: Params) {
        this.plugins = params.plugins

        this.app = new Koa()
        this.router = new Router()
        this.messageBroker = params.messageBroker
    }

    start(): void {
        this.defineEndpoints()

        const handleListening = () => console.log(`Listening on port ${this.port}`)

        this.app.use(this.router.routes())
            .use(this.router.allowedMethods())
            .listen(this.port)
            .on('listening', handleListening)
    }

    defineEndpoints(): void {
        this.router.get("/daily-info", (ctx) => dailyInfoController(ctx, {
            messageBroker: this.messageBroker,
            plugins: this.plugins,
        }));
    }
}