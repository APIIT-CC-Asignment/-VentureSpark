import { google } from 'googleapis';
import { config } from './config';

interface CalendarEvent {
    summary: string;
    description: string;
    startTime: Date;
    endTime: Date;
    attendees: { email: string; name: string }[];
}

export class GoogleCalendarService {
    private calendar;

    constructor(accessToken: string) {
        const auth = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );
        auth.setCredentials({ access_token: accessToken });
        this.calendar = google.calendar({ version: 'v3', auth });
    }

    async createEvent(event: CalendarEvent) {
        try {
            // Create calendar event with Google Meet
            const calendarEvent = {
                summary: event.summary,
                description: event.description,
                start: {
                    dateTime: event.startTime.toISOString(),
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: event.endTime.toISOString(),
                    timeZone: 'UTC',
                },
                attendees: event.attendees.map(attendee => ({
                    email: attendee.email,
                    displayName: attendee.name,
                })),
                conferenceData: {
                    createRequest: {
                        requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                },
            };

            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                requestBody: calendarEvent,
                conferenceDataVersion: 1,
            });

            const createdEvent = response.data;
            const meetUrl = createdEvent.conferenceData?.entryPoints?.[0]?.uri;

            return {
                eventId: createdEvent.id,
                meetLink: meetUrl,
                htmlLink: createdEvent.htmlLink,
            };
        } catch (error) {
            console.error('Error creating calendar event:', error);
            throw error;
        }
    }
} 