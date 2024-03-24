import { google } from 'googleapis';
import fs from 'fs';
import { IPlugin } from '../../daily-bro/daily-bro';
import { ConfigService } from '../../config.service';

export class CalendarEventsPlugin implements IPlugin {
    private async getEvents(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                const credentials = JSON.parse(
                    fs.readFileSync(ConfigService.get('GC_PATH'), 'utf-8'),
                );

                const { client_id, client_secret, redirect_uris } =
                    credentials.installed;
                const oAuth2Client = new google.auth.OAuth2(
                    client_id,
                    client_secret,
                    redirect_uris[0],
                );

                oAuth2Client.setCredentials(
                    JSON.parse(
                        fs.readFileSync(ConfigService.get('GT_PATH'), 'utf-8'),
                    ),
                );

                const calendar = google.calendar({
                    version: 'v3',
                    auth: oAuth2Client,
                });

                // Get today's date
                const today = new Date().toISOString().split('T')[0];

                // Make the API request
                calendar.events.list(
                    {
                        calendarId: 'primary',
                        timeMin: today + 'T00:00:00Z',
                        timeMax: today + 'T23:59:59Z',
                        singleEvents: true,
                        orderBy: 'startTime',
                    },
                    (err, res) => {
                        if (err) return reject(err);

                        if (!res) return reject('no res');

                        const events = res.data.items;

                        if (!events) return reject('no events');

                        resolve(events.map((event) => event.summary ?? ''));
                    },
                );
            } catch (e) {
                Promise.reject(e);
            }
        });
    }

    async getMessage(): Promise<string> {
        const eventsForMessage: string[] = await this.getEvents();
        return eventsForMessage.join('\n');
    }
}
