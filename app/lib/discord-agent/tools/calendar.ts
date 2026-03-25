import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  getTodayEvents,
  getWeekEvents,
  getEventsForDate,
  createEvent,
  findFreeSlots,
  CalendarEvent,
  FreeSlot,
} from '@/app/lib/google/calendar';

/**
 * Format time in 12-hour format
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format calendar event for display
 */
function formatEvent(event: CalendarEvent): string {
  let formatted = `📅 **${event.summary}**\n`;

  if (event.isAllDay) {
    formatted += `Date: ${formatDate(event.start)} (All day)\n`;
  } else {
    formatted += `Date: ${formatDate(event.start)}\n`;
    formatted += `Time: ${formatTime(event.start)} - ${formatTime(event.end)}\n`;
  }

  if (event.location) {
    formatted += `Location: ${event.location}\n`;
  }

  if (event.description) {
    const desc = event.description.length > 100
      ? event.description.substring(0, 100) + '...'
      : event.description;
    formatted += `Description: ${desc}\n`;
  }

  formatted += `ID: \`${event.id}\``;

  return formatted;
}

/**
 * Format free slot for display
 */
function formatFreeSlot(slot: FreeSlot): string {
  const hours = Math.floor(slot.durationMinutes / 60);
  const minutes = slot.durationMinutes % 60;
  const duration = hours > 0
    ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
    : `${minutes}m`;

  return `⬜ ${formatTime(slot.start)} - ${formatTime(slot.end)} (${duration})`;
}

/**
 * Group events by date
 */
function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const dateKey = formatDate(event.start);
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  }

  return grouped;
}

/**
 * Tool: Get today's events
 */
export const getTodayEventsTool = tool(
  async () => {
    try {
      const events = await getTodayEvents();

      if (events.length === 0) {
        return '📅 No events scheduled for today.';
      }

      let response = `📅 **Today's Events** (${events.length})\n\n`;

      for (const event of events) {
        response += formatEvent(event) + '\n\n';
      }

      return response;
    } catch (error) {
      console.error('Error getting today events:', error);
      return `Error fetching today's events: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'get_today_events',
    description: "Get all events scheduled for today",
    schema: z.object({}),
  }
);

/**
 * Tool: Get this week's events
 */
export const getWeekEventsTool = tool(
  async () => {
    try {
      const events = await getWeekEvents();

      if (events.length === 0) {
        return '📅 No events scheduled for this week.';
      }

      const grouped = groupEventsByDate(events);
      let response = `📅 **This Week's Events** (${events.length} total)\n\n`;

      for (const [date, dateEvents] of grouped) {
        response += `**${date}**\n`;
        for (const event of dateEvents) {
          if (event.isAllDay) {
            response += `  • ${event.summary} (All day)\n`;
          } else {
            response += `  • ${event.summary} - ${formatTime(event.start)}\n`;
          }
        }
        response += '\n';
      }

      return response;
    } catch (error) {
      console.error('Error getting week events:', error);
      return `Error fetching this week's events: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'get_week_events',
    description: "Get all events scheduled for the current week",
    schema: z.object({}),
  }
);

/**
 * Tool: Get events for a specific date
 */
export const getEventsForDateTool = tool(
  async ({ date }) => {
    try {
      const targetDate = new Date(date);

      if (isNaN(targetDate.getTime())) {
        return 'Invalid date format. Please use YYYY-MM-DD format.';
      }

      const events = await getEventsForDate(targetDate);

      if (events.length === 0) {
        return `📅 No events scheduled for ${formatDate(targetDate)}.`;
      }

      let response = `📅 **Events for ${formatDate(targetDate)}** (${events.length})\n\n`;

      for (const event of events) {
        response += formatEvent(event) + '\n\n';
      }

      return response;
    } catch (error) {
      console.error('Error getting events for date:', error);
      return `Error fetching events: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'get_events_for_date',
    description: 'Get events for a specific date',
    schema: z.object({
      date: z.string().describe('Date in YYYY-MM-DD format'),
    }),
  }
);

/**
 * Tool: Create a new event
 */
export const createEventTool = tool(
  async ({ title, date, time, durationMinutes, description }) => {
    try {
      // Parse date and time
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);

      const start = new Date(year, month - 1, day, hour, minute);

      if (isNaN(start.getTime())) {
        return 'Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time.';
      }

      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      const event = await createEvent({
        summary: title,
        start,
        end,
        description,
      });

      return `✅ **Event created!**\n\n${formatEvent(event)}`;
    } catch (error) {
      console.error('Error creating event:', error);
      return `Error creating event: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'create_event',
    description: 'Create a new calendar event',
    schema: z.object({
      title: z.string().describe('Event title'),
      date: z.string().describe('Event date in YYYY-MM-DD format'),
      time: z.string().describe('Event start time in HH:MM format (24-hour)'),
      durationMinutes: z.number().min(15).max(480).default(60).describe('Event duration in minutes'),
      description: z.string().optional().describe('Optional event description'),
    }),
  }
);

/**
 * Tool: Find free time slots
 */
export const findFreeSlotsTool = tool(
  async ({ date }) => {
    try {
      const targetDate = date ? new Date(date) : new Date();

      if (isNaN(targetDate.getTime())) {
        return 'Invalid date format. Please use YYYY-MM-DD format.';
      }

      const slots = await findFreeSlots(targetDate);

      if (slots.length === 0) {
        return `📅 No free slots available for ${formatDate(targetDate)} (9 AM - 5 PM).`;
      }

      let response = `📅 **Free Time Slots for ${formatDate(targetDate)}**\n`;
      response += `(Business hours: 9 AM - 5 PM)\n\n`;

      for (const slot of slots) {
        response += formatFreeSlot(slot) + '\n';
      }

      return response;
    } catch (error) {
      console.error('Error finding free slots:', error);
      return `Error finding free slots: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'find_free_slots',
    description: 'Find available time slots for a given date (defaults to today)',
    schema: z.object({
      date: z.string().optional().describe('Date in YYYY-MM-DD format (defaults to today)'),
    }),
  }
);

/**
 * Export all calendar tools
 */
export const calendarTools = [
  getTodayEventsTool,
  getWeekEventsTool,
  getEventsForDateTool,
  createEventTool,
  findFreeSlotsTool,
];
