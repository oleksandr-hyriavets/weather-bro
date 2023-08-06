import { Context } from "koa";
import { CurrencyPair } from "../types/CurrencyPair";
import { CurrencyRateService } from "../services/currency-rate.service";

const parseToCurrencyPair = (currencyPairQuery: string | string[] | undefined): CurrencyPair => {
    if (typeof currencyPairQuery !== 'string') throw new Error('Query param currencyPair is not correct')

    const MAP: Record<string, CurrencyPair> = {
        'uah-eur': CurrencyPair.UahEur,
        'uah-zlt': CurrencyPair.UahZlt
    }

    const pair = MAP[currencyPairQuery]

    if (!pair) throw new Error('Query param "pair" is not correct')

    return pair
}

type Params = {
    currencyRateService: CurrencyRateService
}

export const getCurrencyRateController = async (ctx: Context, { currencyRateService }: Params) => {
    const { pair: currencyPairQuery } = ctx.request.query

    try {
        const currencyPair = parseToCurrencyPair(currencyPairQuery)

        const rate = await currencyRateService.getRateByPair(currencyPair);
        ctx.status = 200;
        ctx.body = Number(rate);
    // @todo - handle different types of errors
    } catch (err) {
        ctx.body = "Unexpected error";
        ctx.status = 400;
    }
};
