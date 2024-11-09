import axios, { AxiosResponse } from 'axios';
import { IPlugin } from '../../daily-bro/daily-bro';

type Sign = 'Leo' | 'aquarius';

const getUrl = (sign: Sign) =>
    `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`;

export class AstrologyPlugin implements IPlugin {
    async getMessage(): Promise<string> {
        try {
            const [leo, aquarius] = await Promise.all([
                this.getHoroscope('Leo'),
                this.getHoroscope('aquarius'),
            ]);

            return `🦁 Leo\n${leo}\n\n💧 Aquarius\n${aquarius}`;
        } catch (err) {
            console.error('AstrologyPlugin error', err);
            throw err;
        }
    }

    private async getHoroscope(sign: Sign): Promise<string> {
        const response = await axios.get(getUrl(sign));
        return this.getHoroscopeFromResponse(response);
    }

    private getHoroscopeFromResponse(response: AxiosResponse<unknown>): string {
        if (response.status !== 200) {
            throw new Error(`Invalid response status: ${response.status}`);
        }

        if (
            !response.data ||
            typeof response.data !== 'object' ||
            !('data' in response.data) ||
            !response.data.data ||
            typeof response.data.data !== 'object' ||
            !('horoscope_data' in response.data.data) ||
            typeof response.data.data.horoscope_data !== 'string'
        ) {
            throw new Error('Invalid response data');
        }

        return response.data.data.horoscope_data;
    }
}
