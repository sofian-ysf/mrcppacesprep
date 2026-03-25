import { google, calendar_v3 } from 'googleapis';
import { getGoogleAuth } from './auth';

// Calendar client singleton
let calendarClient: calendar_v3.Calendar | null = null;

/**
 * Get or create Calendar client
 */
function getCalendarClient(): calendar_v3.Calendar {
  if (calendarClient) {
    return calendarClient;
  }

  const auth = getGoogleAuth();
  calendarClient = google.calendar({ version: 'v3', auth });
  return calendarClient;
}

/**
 * Calendar event structure
 */
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  status: string;
  htmlLink?: string;
  attendees?: { email: string; responseStatus?: string }[];
  organizer?: { email: string; displayName?: string };
}

/**
 * Parse Google Calendar event to our format
 */
function parseEvent(event: calendar_v3.Schema$Event): CalendarEvent {
  const isAllDay = !event.start?.dateTime;

  return {
    id: event.id!,
    summary: event.summary || '(No title)',
    description: event.description || undefined,
    location: event.location || undefined,
    start: new Date(event.start?.dateTime || event.start?.date || ''),
    end: new Date(event.end?.dateTime || event.end?.date || ''),
    isAllDay,
    status: event.status || 'confirmed',
    htmlLink: event.htmlLink || undefined,
    attendees: event.attendees?.map(a => ({
      email: a.email!,
      responseStatus: a.responseStatus || undefined,
    })),
    organizer: event.organizer
      ? {
          email: event.organizer.email!,
          displayName: event.organizer.displayName || undefined,
        }
      : undefined,
  };
}

/**
 * Get start and end of a day in ISO format
 */
function getDayBounds(date: Date): { start: string; end: string } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Get start and end of the current week
 */
function getWeekBounds(date: Date): { start: string; end: string } {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * List events within a time range
 */
export async function listEvents(options: {
  calendarId?: string;
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
  singleEvents?: boolean;
  orderBy?: 'startTime' | 'updated';
} = {}): Promise<CalendarEvent[]> {
  const calendar = getCalendarClient();

  const {
    calendarId = 'primary',
    timeMin,
    timeMax,
    maxResults = 50,
    singleEvents = true,
    orderBy = 'startTime',
  } = options;

  const response = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    maxResults,
    singleEvents,
    orderBy,
  });

  const events = response.data.items || [];
  return events.map(parseEvent);
}

/**
 * Get today's events
 */
export async function getTodayEvents(): Promise<CalendarEvent[]> {
  const bounds = getDayBounds(new Date());
  return listEvents({
    timeMin: bounds.start,
    timeMax: bounds.end,
  });
}

/**
 * Get this week's events
 */
export async function getWeekEvents(): Promise<CalendarEvent[]> {
  const bounds = getWeekBounds(new Date());
  return listEvents({
    timeMin: bounds.start,
    timeMax: bounds.end,
  });
}

/**
 * Get events for a specific date
 */
export async function getEventsForDate(date: Date): Promise<CalendarEvent[]> {
  const bounds = getDayBounds(date);
  return listEvents({
    timeMin: bounds.start,
    timeMax: bounds.end,
  });
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(maxResults = 10): Promise<CalendarEvent[]> {
  return listEvents({
    timeMin: new Date().toISOString(),
    maxResults,
  });
}

/**
 * Get a specific event by ID
 */
export async function getEvent(
  eventId: string,
  calendarId = 'primary'
): Promise<CalendarEvent | null> {
  const calendar = getCalendarClient();

  try {
    const response = await calendar.events.get({
      calendarId,
      eventId,
    });

    return parseEvent(response.data);
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

/**
 * Create a new event
 */
export async function createEvent(options: {
  summary: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  isAllDay?: boolean;
  attendees?: string[];
  calendarId?: string;
}): Promise<CalendarEvent> {
  const calendar = getCalendarClient();

  const {
    summary,
    description,
    location,
    start,
    end,
    isAllDay = false,
    attendees,
    calendarId = 'primary',
  } = options;

  const eventResource: calendar_v3.Schema$Event = {
    summary,
    description,
    location,
    start: isAllDay
      ? { date: start.toISOString().split('T')[0] }
      : { dateTime: start.toISOString() },
    end: isAllDay
      ? { date: end.toISOString().split('T')[0] }
      : { dateTime: end.toISOString() },
    attendees: attendees?.map(email => ({ email })),
  };

  const response = await calendar.events.insert({
    calendarId,
    requestBody: eventResource,
    sendUpdates: attendees?.length ? 'all' : 'none',
  });

  return parseEvent(response.data);
}

/**
 * Quick add event using natural language
 */
export async function quickAddEvent(
  text: string,
  calendarId = 'primary'
): Promise<CalendarEvent> {
  const calendar = getCalendarClient();

  const response = await calendar.events.quickAdd({
    calendarId,
    text,
  });

  return parseEvent(response.data);
}

/**
 * Update an existing event
 */
export async function updateEvent(
  eventId: string,
  updates: {
    summary?: string;
    description?: string;
    location?: string;
    start?: Date;
    end?: Date;
  },
  calendarId = 'primary'
): Promise<CalendarEvent | null> {
  const calendar = getCalendarClient();

  try {
    // First get the existing event
    const existing = await calendar.events.get({
      calendarId,
      eventId,
    });

    const eventResource: calendar_v3.Schema$Event = {
      ...existing.data,
    };

    if (updates.summary) eventResource.summary = updates.summary;
    if (updates.description) eventResource.description = updates.description;
    if (updates.location) eventResource.location = updates.location;
    if (updates.start) eventResource.start = { dateTime: updates.start.toISOString() };
    if (updates.end) eventResource.end = { dateTime: updates.end.toISOString() };

    const response = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: eventResource,
    });

    return parseEvent(response.data);
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(
  eventId: string,
  calendarId = 'primary'
): Promise<boolean> {
  const calendar = getCalendarClient();

  try {
    await calendar.events.delete({
      calendarId,
      eventId,
    });
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
}

/**
 * Free/Busy slot structure
 */
export interface FreeSlot {
  start: Date;
  end: Date;
  durationMinutes: number;
}

/**
 * Find free time slots for a given date
 */
export async function findFreeSlots(
  date: Date,
  options: {
    workdayStart?: number; // Hour (0-23)
    workdayEnd?: number; // Hour (0-23)
    minDurationMinutes?: number;
    calendarId?: string;
  } = {}
): Promise<FreeSlot[]> {
  const calendar = getCalendarClient();

  const {
    workdayStart = 9,
    workdayEnd = 17,
    minDurationMinutes = 30,
    calendarId = 'primary',
  } = options;

  // Set up the workday bounds
  const dayStart = new Date(date);
  dayStart.setHours(workdayStart, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(workdayEnd, 0, 0, 0);

  // Get free/busy info
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      items: [{ id: calendarId }],
    },
  });

  const busySlots = response.data.calendars?.[calendarId]?.busy || [];

  // Convert busy slots to Date objects
  const busyPeriods = busySlots.map(slot => ({
    start: new Date(slot.start!),
    end: new Date(slot.end!),
  }));

  // Sort busy periods by start time
  busyPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Find free slots between busy periods
  const freeSlots: FreeSlot[] = [];
  let currentStart = dayStart;

  for (const busy of busyPeriods) {
    if (busy.start > currentStart) {
      const durationMinutes = (busy.start.getTime() - currentStart.getTime()) / (1000 * 60);
      if (durationMinutes >= minDurationMinutes) {
        freeSlots.push({
          start: currentStart,
          end: busy.start,
          durationMinutes,
        });
      }
    }
    if (busy.end > currentStart) {
      currentStart = busy.end;
    }
  }

  // Check for free time after the last busy period
  if (currentStart < dayEnd) {
    const durationMinutes = (dayEnd.getTime() - currentStart.getTime()) / (1000 * 60);
    if (durationMinutes >= minDurationMinutes) {
      freeSlots.push({
        start: currentStart,
        end: dayEnd,
        durationMinutes,
      });
    }
  }

  return freeSlots;
}

/**
 * List available calendars
 */
export async function listCalendars(): Promise<{ id: string; summary: string; primary: boolean }[]> {
  const calendar = getCalendarClient();

  const response = await calendar.calendarList.list();

  return (response.data.items || []).map(cal => ({
    id: cal.id!,
    summary: cal.summary!,
    primary: cal.primary || false,
  }));
}
