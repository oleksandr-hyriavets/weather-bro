import { IPlugin } from "../../daily-bro/daily-bro";
import { getDateDifferenceInDays } from "./utils/date";

type Event = {
    date: Date,
    name: string
}

export class EventsPlugin implements IPlugin {
    events: Event[] = [
        {
            date: new Date('2023-12-27'),
            name: 'Some test event will happen',
        },
    ]

    async getMessage(): Promise<string> {
        const messages = this.events
            .map(this.getEventMessage.bind(this))
            .filter(Boolean)
        return `Events 🗓️ \n` + messages.map(message => `- ${message}`).join('\n');
    }

    private getEventMessage(event: Event): string {
        const daysUntilEvent = getDateDifferenceInDays(new Date(), event.date)

        if (daysUntilEvent < 0) {
            return ''
        }

        if (daysUntilEvent === 0) {
            return `Today is the day of ${event.name}`
        }

        if (daysUntilEvent === 1) {
            return `The ${event.name} is tomorrow!`
        }

        if (daysUntilEvent < 5) {
            return `There are only ${daysUntilEvent} days until ${event.name}`
        }

        return `It is ${daysUntilEvent} days until ${event.name}`
    }
}