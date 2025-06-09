import * as cheerio from 'cheerio';

type Sign = 'leo' | 'aquarius';

export class HoroscopeProvider {
    private readonly BASE_URL =
        'https://www.prokerala.com/astrology/horoscope/';

    private getUrl(sign: Sign) {
        return `${this.BASE_URL}?sign=${sign}`;
    }

    async loadHoroscope(sign: Sign) {
        const url = this.getUrl(sign);
        const $ = await cheerio.fromURL(url);
        return $('.horoscope-panel p:first').text();
    }
}
