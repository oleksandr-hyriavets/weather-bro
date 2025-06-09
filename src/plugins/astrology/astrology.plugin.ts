import { IPlugin } from '../../daily-bro/daily-bro';
import { HoroscopeProvider } from './horoscope.provider';

export class AstrologyPlugin implements IPlugin {
    async getMessage(): Promise<string> {
        const provider = new HoroscopeProvider();

        try {
            const [leo, aquarius] = await Promise.all([
                provider.loadHoroscope('leo'),
                provider.loadHoroscope('aquarius'),
            ]);

            return `🦁 Leo\n${leo}\n\n💧 Aquarius\n${aquarius}`;
        } catch (err) {
            console.error('AstrologyPlugin error', err);
            throw err;
        }
    }
}
