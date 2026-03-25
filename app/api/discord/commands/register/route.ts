import { NextRequest, NextResponse } from 'next/server';
import {
  RESTPostAPIApplicationCommandsJSONBody,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';

/**
 * Define all slash commands for the bot
 */
const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  // Email Commands
  {
    name: 'email',
    description: 'Email management commands',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'inbox',
        description: 'Show recent emails from inbox',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'count',
            description: 'Number of emails to show (default: 5)',
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: 1,
            max_value: 20,
          },
        ],
      },
      {
        name: 'search',
        description: 'Search emails',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'query',
            description: 'Search query (e.g., "from:john subject:meeting")',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: 'read',
        description: 'Read a specific email',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'id',
            description: 'Email ID to read',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: 'send',
        description: 'Send an email',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'to',
            description: 'Recipient email address',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'subject',
            description: 'Email subject',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'body',
            description: 'Email body',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: 'reply',
        description: 'Reply to an email',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'id',
            description: 'Email ID to reply to',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'body',
            description: 'Reply message',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    ],
  },

  // Calendar Commands
  {
    name: 'calendar',
    description: 'Calendar management commands',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'today',
        description: "Show today's events",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'week',
        description: "Show this week's events",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'add',
        description: 'Create a new event',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'title',
            description: 'Event title',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'date',
            description: 'Date (YYYY-MM-DD)',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'time',
            description: 'Start time (HH:MM, 24-hour format)',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'duration',
            description: 'Duration in minutes (default: 60)',
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: 15,
            max_value: 480,
          },
          {
            name: 'description',
            description: 'Event description',
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: 'free',
        description: 'Find free time slots',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'date',
            description: 'Date to check (YYYY-MM-DD, default: today)',
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
    ],
  },

  // AI Assistant Command
  {
    name: 'ask',
    description: 'Ask the AI assistant anything',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'question',
        description: 'Your question or request',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  // Help Command
  {
    name: 'help',
    description: 'Show all available commands',
    type: ApplicationCommandType.ChatInput,
  },
];

/**
 * Register slash commands with Discord
 * This endpoint should be called once to set up commands
 * Protected by API key check
 */
export async function POST(request: NextRequest) {
  // Check for admin authorization
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applicationId = process.env.DISCORD_APPLICATION_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!applicationId || !botToken) {
    return NextResponse.json(
      { error: 'Missing DISCORD_APPLICATION_ID or DISCORD_BOT_TOKEN' },
      { status: 500 }
    );
  }

  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

  try {
    // Register all commands globally
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${botToken}`,
      },
      body: JSON.stringify(commands),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Discord API error:', error);
      return NextResponse.json(
        { error: 'Failed to register commands', details: error },
        { status: response.status }
      );
    }

    const registeredCommands = await response.json();

    return NextResponse.json({
      success: true,
      message: `Registered ${registeredCommands.length} commands`,
      commands: registeredCommands.map((cmd: { name: string; id: string }) => ({
        name: cmd.name,
        id: cmd.id,
      })),
    });
  } catch (error) {
    console.error('Error registering commands:', error);
    return NextResponse.json(
      { error: 'Failed to register commands', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to view current commands
 */
export async function GET(request: NextRequest) {
  // Check for admin authorization
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applicationId = process.env.DISCORD_APPLICATION_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!applicationId || !botToken) {
    return NextResponse.json(
      { error: 'Missing DISCORD_APPLICATION_ID or DISCORD_BOT_TOKEN' },
      { status: 500 }
    );
  }

  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: 'Failed to fetch commands', details: error },
        { status: response.status }
      );
    }

    const registeredCommands = await response.json();

    return NextResponse.json({
      count: registeredCommands.length,
      commands: registeredCommands,
    });
  } catch (error) {
    console.error('Error fetching commands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commands', details: String(error) },
      { status: 500 }
    );
  }
}
