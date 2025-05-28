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
    private auth;
    private refreshToken?: string;

    constructor(accessToken: string, refreshToken?: string) {
        this.auth = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );
        this.auth.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
        this.refreshToken = refreshToken;
        this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    }

    async createEvent(event: CalendarEvent) {
        try {
            let accessToken;
            try {
                const tokenInfo = await this.auth.getAccessToken();
                accessToken = tokenInfo?.token;
            } catch (error) {
                if (this.refreshToken) {
                    // Try to refresh the token
                    try {
                        const { credentials } = await this.auth.refreshAccessToken();
                        accessToken = credentials.access_token;
                        this.auth.setCredentials({ access_token: accessToken, refresh_token: this.refreshToken });
                    } catch (refreshError) {
                        throw new Error('Invalid or expired refresh token. Please reconnect your Google Calendar.');
                    }
                } else {
                    throw new Error('Invalid or expired access token. Please reconnect your Google Calendar.');
                }
            }

            // Filter attendees FIRST, before creating the calendar event
            const validAttendees = event.attendees
                .filter(attendee => attendee.email && attendee.email.trim() !== '')
                .map(attendee => ({
                    email: attendee.email,
                    displayName: attendee.name,
                }));

            console.log('Valid attendees being added:', validAttendees); // Debug log

            // Better date formatting that handles invalid dates
            const formatDateForGoogle = (date: Date): string => {
                // Check if date is valid first
                if (!date || isNaN(date.getTime())) {
                    throw new Error('Invalid date provided to formatDateForGoogle');
                }

                // Get the components in the local timezone (since we're specifying Asia/Colombo separately)
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            // Create calendar event with Google Meet using ACTUAL event times
            const calendarEvent = {
                summary: event.summary,
                description: event.description,
                start: {
                    dateTime: formatDateForGoogle(event.startTime), // Use actual start time
                    timeZone: 'Asia/Colombo'
                },
                end: {
                    dateTime: formatDateForGoogle(event.endTime), // Use actual end time
                    timeZone: 'Asia/Colombo'
                },
                attendees: validAttendees,
                conferenceData: {
                    createRequest: {
                        requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                },
            };

            console.log('Calendar event being created:', calendarEvent); // Debug log
            // Validate dates before processing
            console.log('Event times DEBUG:', {
                originalStartTime: event.startTime,
                originalEndTime: event.endTime,
                startTimeValid: event.startTime instanceof Date && !isNaN(event.startTime.getTime()),
                endTimeValid: event.endTime instanceof Date && !isNaN(event.endTime.getTime()),
                startTimeString: event.startTime?.toString(),
                endTimeString: event.endTime?.toString(),
                serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });

            // Check if dates are valid before proceeding
            if (!event.startTime || !event.endTime) {
                throw new Error('Start time and end time are required');
            }

            if (!(event.startTime instanceof Date) || isNaN(event.startTime.getTime())) {
                throw new Error(`Invalid start time: ${event.startTime}`);
            }

            if (!(event.endTime instanceof Date) || isNaN(event.endTime.getTime())) {
                throw new Error(`Invalid end time: ${event.endTime}`);
            }

            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                requestBody: calendarEvent,
                conferenceDataVersion: 1,
                sendUpdates: 'all',
                sendNotifications: true
            });

            console.log('Calendar API response:', response.data); // Debug log

            if (!response.data) {
                throw new Error('Failed to create calendar event');
            }

            const createdEvent = response.data;
            const meetUrl = createdEvent.conferenceData?.entryPoints?.[0]?.uri;

            if (!meetUrl) {
                console.warn('No Google Meet URL generated for the event');
            }

            return {
                eventId: createdEvent.id,
                meetLink: meetUrl,
                htmlLink: createdEvent.htmlLink,
                newAccessToken: accessToken // Return new access token if refreshed
            };
        } catch (error) {
            console.error('Error creating calendar event:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid Credentials')) {
                    throw new Error('Your Google Calendar connection has expired. Please reconnect your calendar.');
                }
                throw new Error(`Failed to create calendar event: ${error.message}`);
            }
            throw new Error('An unexpected error occurred while creating the calendar event');
        }
    }
}