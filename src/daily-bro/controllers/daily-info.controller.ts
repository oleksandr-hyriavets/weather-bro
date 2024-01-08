import { Context } from 'koa';
import { ConfigService } from '../../config.service';

import { ConcatMessageFormatter } from '../formatters/concat-message.formatter';
import { IPlugin } from '../daily-bro';
import { IMessageBroker } from '../interfaces/message-broker.interface';

type Params = {
    plugins: IPlugin[];
    messageBroker: IMessageBroker;
};

export const dailyInfoController = async (
    ctx: Context,
    { messageBroker, plugins }: Params,
) => {
    const { city } = ctx.request.query;

    if (typeof city !== 'string') {
        ctx.body = "Query param 'city' is not found";
        ctx.status = 400;

        return ctx;
    }

    const pluginParams = {
        city,
    };

    try {
        const promises = plugins
            .map((plugin) => plugin.getMessage(pluginParams))
            .map((promise) => promise.catch(() => ''));

        const messages = await Promise.all(promises);

        const concatMessageFormatter = new ConcatMessageFormatter();
        const message = concatMessageFormatter.format(messages);

        await messageBroker.sendMessage(message, {
            chatId: ConfigService.get('CHAT_ID'),
        });

        ctx.status = 200;
        ctx.body = 'SUCCESS';
    } catch (err) {
        ctx.body = 'Unexpected error';
        ctx.status = 500;
    }
};
