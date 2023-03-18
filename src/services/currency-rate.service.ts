import axios from "axios";

const CURRENCY_RATE_URL = "https://api.monobank.ua/bank/currency";

const ZLOTY_CURRENCY_CODE = 985;
const HRYVNIA_CURRENCY_CODE = 980;

class CurrencyRateService {
  async getZlotyToHryvniaCurrencyRate(): Promise<string> {
    try {
      const response = await axios.get(CURRENCY_RATE_URL);
      const { zlotyToHryvniaRate } = this.parseResponse(response);
      return zlotyToHryvniaRate;
    } catch (e) {
      console.error("Unexpected error while getting zloty to hryvnia rate", e);
      throw e;
    }
  }

  // @todo - avoid any
  private parseResponse({ data }: any) {
    const isZlotyToHryvnia = (item: any) =>
      item.currencyCodeA === ZLOTY_CURRENCY_CODE &&
      item.currencyCodeB == HRYVNIA_CURRENCY_CODE;

    const { rateCross } = data.find(isZlotyToHryvnia);

    return {
      zlotyToHryvniaRate: rateCross as string,
    };
  }
}

const currencyRateService = new CurrencyRateService();
export { currencyRateService as CurrencyRateService };
