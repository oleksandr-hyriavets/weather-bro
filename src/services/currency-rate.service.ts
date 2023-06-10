import axios from "axios";
import { IMessageable } from "../interfaces/messageable.interface";

const CURRENCY_RATE_URL = "https://api.monobank.ua/bank/currency";

type CurrencyPair = 'uah-eur' | 'uah-zlt'

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
  'uah-eur': {
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
  'uah-zlt': {
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

export class CurrencyRateService implements IMessageable {
  async getMessage(pair: CurrencyPair): Promise<string> {
    const pairData = CURRENCY_PAIR_DATA_MAP[pair];
    const rate = await this.getRate(pairData);
    return `${pairData.from.flag} -> ${pairData.to.flag}: ${rate}`
  }

  private async getRate(pairData: CurrencyPairData): Promise<string> {
    try {
      const response = await axios.get(CURRENCY_RATE_URL);
      const { rate } = this.parseResponse(response, pairData);
      return rate;
    } catch (e) {
      console.error(`Unexpected error while getting ${pairData.from.title} to ${pairData.to.title} rate`, e);
      throw e;
    }
  }

  // @todo - avoid any
  private parseResponse({ data }: any, pairData: CurrencyPairData) {
    const isTargetPair = (item: any) =>
      item.currencyCodeA === pairData.to.code &&
      item.currencyCodeB == pairData.from.code;

    const { rateSell } = data.find(isTargetPair);

    return {
      rate: rateSell as string,
    };
  }
}
