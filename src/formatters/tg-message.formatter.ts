import { BaseFormatter } from "./base-formatter";

interface FormatTgMessageDto {
    city: string;
    date: string;
    minTemp: string;
    maxTemp: string;
    avgTemp: string;
    rainChance: string;
    zlotyToHryvniaRate: string;
    activityHoursStart: number;
    activityHoursEnd: number;
}

export class TgMessageFormatter implements BaseFormatter {
    format(dto: FormatTgMessageDto): string {
        return `${dto.city} 🇵🇱 - ${dto.date}\n\nMin: ${dto.minTemp}°C\nMax: ${
            dto.maxTemp
          }°C\nAvg. (${dto.activityHoursStart}am - ${dto.activityHoursEnd - 1}pm): ${
            dto.avgTemp
          }°C\n\n🌧️ Rain Chance: ${dto.rainChance}%\n\n🇺🇦 -> 🇵🇱: ${
            dto.zlotyToHryvniaRate
          }`;
    }
}