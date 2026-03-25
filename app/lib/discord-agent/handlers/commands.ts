import {
  APIChatInputApplicationCommandInteraction,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import { runAgentSingleTurn } from '../graph';
import {
  listEmails,
  readEmail,
  searchEmails,
  sendEmail,
  replyToEmail,
} from '@/app/lib/google/gmail';
import {
  getTodayEvents,
  getWeekEvents,
  createEvent,
  findFreeSlots,
} from '@/app/lib/google/calendar';

/**
 * Get option value from interaction
 */
function getOptionValue<T>(
  interaction: APIChatInputApplicationCommandInteraction,
  name: string,
  subcommand?: string
): T | undefined {
  const options = interaction.data.options || [];

  if (subcommand) {
    const sub = options.find(
      (o) => o.type === ApplicationCommandOptionType.Subcommand && o.name === subcommand
    );
    if (sub && 'options' in sub) {
      const opt = sub.options?.find((o) => o.name === name);
      return opt && 'value' in opt ? (opt.value as T) : undefined;
    }
  } else {
    const opt = options.find((o) => o.name === name);
    return opt && 'value' in opt ? (opt.value as T) : undefined;
  }

  return undefined;
}

/**
 * Get subcommand name from interaction
 */
function getSubcommand(
  interaction: APIChatInputApplicationCommandInteraction
): string | undefined {
  const options = interaction.data.options || [];
  const sub = options.find(
    (o) => o.type === ApplicationCommandOptionType.Subcommand
  );
  return sub?.name;
}

/**
 * Format email for Discord
 */
function formatEmailForDiscord(email: {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet?: string;
  body?: string;
  isUnread?: boolean;
}): string {
  const unread = email.isUnread ? '🔵 ' : '';
  const date = new Date(email.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let text = `${unread}**${email.subject}**\n`;
  text += `From: ${email.from}\n`;
  text += `Date: ${date}\n`;
  text += `ID: \`${email.id}\`\n`;

  if (email.body) {
    const body = email.body.length > 400 ? email.body.substring(0, 400) + '...' : email.body;
    text += `\n${body}`;
  } else if (email.snippet) {
    text += `Preview: ${email.snippet}`;
  }

  return text;
}

/**
 * Format calendar event for Discord
 */
function formatEventForDiscord(event: {
  id: string;
  summary: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  location?: string;
}): string {
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  let text = `📅 **${event.summary}**\n`;

  if (event.isAllDay) {
    text += `Date: ${formatDate(event.start)} (All day)\n`;
  } else {
    text += `Date: ${formatDate(event.start)}\n`;
    text += `Time: ${formatTime(event.start)} - ${formatTime(event.end)}\n`;
  }

  if (event.location) {
    text += `Location: ${event.location}\n`;
  }

  text += `ID: \`${event.id}\``;
  return text;
}

/**
 * Handle slash commands
 */
export async function handleSlashCommand(
  interaction: APIChatInputApplicationCommandInteraction
): Promise<string> {
  const commandName = interaction.data.name;

  try {
    switch (commandName) {
      case 'email':
        return await handleEmailCommand(interaction);
      case 'calendar':
        return await handleCalendarCommand(interaction);
      case 'ask':
        return await handleAskCommand(interaction);
      default:
        return `Unknown command: ${commandName}`;
    }
  } catch (error) {
    console.error(`Error handling command ${commandName}:`, error);
    return `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Handle /email commands
 */
async function handleEmailCommand(
  interaction: APIChatInputApplicationCommandInteraction
): Promise<string> {
  const subcommand = getSubcommand(interaction);

  switch (subcommand) {
    case 'inbox': {
      const count = getOptionValue<number>(interaction, 'count', 'inbox') || 5;
      const emails = await listEmails({ maxResults: count });

      if (emails.length === 0) {
        return '📬 Your inbox is empty!';
      }

      let response = `📬 **Recent Emails** (${emails.length})\n\n`;
      for (const email of emails) {
        response += formatEmailForDiscord(email) + '\n\n---\n\n';
      }
      return response;
    }

    case 'search': {
      const query = getOptionValue<string>(interaction, 'query', 'search');
      if (!query) return 'Please provide a search query.';

      const emails = await searchEmails(query, 10);

      if (emails.length === 0) {
        return `🔍 No emails found matching: "${query}"`;
      }

      let response = `🔍 **Search Results for:** "${query}"\n\n`;
      for (const email of emails) {
        response += formatEmailForDiscord(email) + '\n\n---\n\n';
      }
      return response;
    }

    case 'read': {
      const id = getOptionValue<string>(interaction, 'id', 'read');
      if (!id) return 'Please provide an email ID.';

      const email = await readEmail(id);
      if (!email) return `Email with ID \`${id}\` not found.`;

      return formatEmailForDiscord(email);
    }

    case 'send': {
      const to = getOptionValue<string>(interaction, 'to', 'send');
      const subject = getOptionValue<string>(interaction, 'subject', 'send');
      const body = getOptionValue<string>(interaction, 'body', 'send');

      if (!to || !subject || !body) {
        return 'Please provide recipient, subject, and body.';
      }

      const result = await sendEmail({ to, subject, body });
      return `✅ **Email sent!**\nTo: ${to}\nSubject: ${subject}\nID: \`${result.id}\``;
    }

    case 'reply': {
      const id = getOptionValue<string>(interaction, 'id', 'reply');
      const body = getOptionValue<string>(interaction, 'body', 'reply');

      if (!id || !body) {
        return 'Please provide email ID and reply message.';
      }

      const result = await replyToEmail(id, body);
      return `✅ **Reply sent!**\nThread ID: \`${result.threadId}\``;
    }

    default:
      return `Unknown email subcommand: ${subcommand}`;
  }
}

/**
 * Handle /calendar commands
 */
async function handleCalendarCommand(
  interaction: APIChatInputApplicationCommandInteraction
): Promise<string> {
  const subcommand = getSubcommand(interaction);

  switch (subcommand) {
    case 'today': {
      const events = await getTodayEvents();

      if (events.length === 0) {
        return '📅 No events scheduled for today.';
      }

      let response = `📅 **Today's Events** (${events.length})\n\n`;
      for (const event of events) {
        response += formatEventForDiscord(event) + '\n\n';
      }
      return response;
    }

    case 'week': {
      const events = await getWeekEvents();

      if (events.length === 0) {
        return '📅 No events scheduled for this week.';
      }

      // Group by date
      const grouped = new Map<string, typeof events>();
      for (const event of events) {
        const dateKey = event.start.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(event);
      }

      let response = `📅 **This Week** (${events.length} events)\n\n`;
      for (const [date, dateEvents] of grouped) {
        response += `**${date}**\n`;
        for (const event of dateEvents) {
          const time = event.isAllDay
            ? 'All day'
            : event.start.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
          response += `  • ${event.summary} - ${time}\n`;
        }
        response += '\n';
      }
      return response;
    }

    case 'add': {
      const title = getOptionValue<string>(interaction, 'title', 'add');
      const date = getOptionValue<string>(interaction, 'date', 'add');
      const time = getOptionValue<string>(interaction, 'time', 'add');
      const duration = getOptionValue<number>(interaction, 'duration', 'add') || 60;
      const description = getOptionValue<string>(interaction, 'description', 'add');

      if (!title || !date || !time) {
        return 'Please provide title, date, and time.';
      }

      // Parse date and time
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);
      const start = new Date(year, month - 1, day, hour, minute);

      if (isNaN(start.getTime())) {
        return 'Invalid date or time format. Use YYYY-MM-DD and HH:MM.';
      }

      const end = new Date(start.getTime() + duration * 60 * 1000);

      const event = await createEvent({
        summary: title,
        start,
        end,
        description,
      });

      return `✅ **Event created!**\n\n${formatEventForDiscord(event)}`;
    }

    case 'free': {
      const dateStr = getOptionValue<string>(interaction, 'date', 'free');
      const date = dateStr ? new Date(dateStr) : new Date();

      if (isNaN(date.getTime())) {
        return 'Invalid date format. Use YYYY-MM-DD.';
      }

      const slots = await findFreeSlots(date);

      if (slots.length === 0) {
        return `📅 No free slots available for ${date.toLocaleDateString()} (9 AM - 5 PM).`;
      }

      const formatTime = (d: Date) =>
        d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      let response = `📅 **Free Slots for ${date.toLocaleDateString()}**\n`;
      response += `(Business hours: 9 AM - 5 PM)\n\n`;

      for (const slot of slots) {
        const hours = Math.floor(slot.durationMinutes / 60);
        const mins = slot.durationMinutes % 60;
        const duration = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;
        response += `⬜ ${formatTime(slot.start)} - ${formatTime(slot.end)} (${duration})\n`;
      }

      return response;
    }

    default:
      return `Unknown calendar subcommand: ${subcommand}`;
  }
}

/**
 * Handle /ask command (AI assistant)
 */
async function handleAskCommand(
  interaction: APIChatInputApplicationCommandInteraction
): Promise<string> {
  const question = getOptionValue<string>(interaction, 'question');

  if (!question) {
    return 'Please provide a question.';
  }

  // Use the AI agent to process the question
  const response = await runAgentSingleTurn(question);

  // Truncate if too long for Discord (max 2000 chars)
  if (response.length > 1900) {
    return response.substring(0, 1900) + '\n\n...(truncated)';
  }

  return response;
}
