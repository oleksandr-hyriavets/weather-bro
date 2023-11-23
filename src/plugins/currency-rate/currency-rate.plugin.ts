import axios from "axios";

import { IPlugin } from "../../daily-bro/daily-bro";

// https://api.monobank.ua/docs/
const CURRENCY_RATE_URL = "https://api.monobank.ua/bank/currency";

const enum CurrencyPair {
    UahEur = 'UahEur',
    UahZlt = 'UahZlt'
}

type CurrencyData = {
  title: string;
  code: number;
  flag: string;
}

type CurrencyPairData = {
  from: CurrencyData,
  to: CurrencyData,
}

const CURRENCY_PAIR_DATA_MAP: Record<CurrencyPair, CurrencyPairData> = {
  [CurrencyPair.UahEur]: {
    from: {
      title: 'UAH',
      code: 980,
      flag: '🇺🇦',
    },
    to: {
      title: 'EUR',
      code: 978,
      flag: '🇪🇺',
    }
  },
  [CurrencyPair.UahZlt]: {
    from: {
      title: 'UAH',
      code: 980,
      flag: '🇺🇦',
    },
    to: {
      title: 'ZLT',
      code: 985,
      flag: '🇵🇱',
    }
  }
}

export class CurrencyRatePlugin implements IPlugin {
  async getMessage(): Promise<string> {
    const pairData = CURRENCY_PAIR_DATA_MAP[CurrencyPair.UahEur];
    const rate = await this.getRateByCode(pairData.from.code, pairData.to.code);
    return `${pairData.from.flag} -> ${pairData.to.flag}: ${rate}`
  }

  async getRateByCode(
    currencyFromCode: CurrencyPairData['to']['code'],
    currencyToCode: CurrencyPairData['from']['code']
  ): Promise<string> {
    try {
      const response = await axios.get(CURRENCY_RATE_URL);
      const { rate } = this.parseResponse(response, {
        fromCode: currencyFromCode,
        toCode: currencyToCode
      });
      return rate;
    } catch (e) {
      console.error(`Unexpected error while getting ${currencyFromCode} to ${currencyToCode} rate`, e);
      throw e;
    }
  }

  async getRateByPair(pair: CurrencyPair): Promise<string> {
    const pairData = CURRENCY_PAIR_DATA_MAP[pair]

    try {
      const response = await axios.get(CURRENCY_RATE_URL);
      const { rate } = this.parseResponse(response, {
        fromCode: pairData.from.code,
        toCode: pairData.to.code,
      });
      return rate;
    } catch (e) {
      console.error(`Unexpected error while getting ${pair} rate`, e);
      throw e;
    }
  }

  // @todo - avoid any
  private parseResponse(
    { data }: any,
    pairData: { fromCode: CurrencyPairData['from']['code'], toCode: CurrencyPairData['to']['code'] }
  ) {
    const isTargetPair = (item: any) =>
      item.currencyCodeA === pairData.toCode &&
      item.currencyCodeB == pairData.fromCode;

    const { rateSell } = data.find(isTargetPair);

    return {
      rate: rateSell as string,
    };
  }
}
