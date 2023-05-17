import { BaseFormatter } from "./base-formatter";

export class ConcatMessageFormatter implements BaseFormatter {
    format(dto: string[]): string {
        return dto
            .filter(Boolean)
            .join('\n\n')
    }
}