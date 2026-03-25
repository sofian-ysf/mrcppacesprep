import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import * as nacl from 'tweetnacl';
import {
  InteractionType,
  InteractionResponseType,
  APIInteraction,
  APIChatInputApplicationCommandInteraction,
  APIMessageComponentInteraction,
  ApplicationCommandType,
  MessageFlags,
} from 'discord-api-types/v10';
import { handleSlashCommand } from '@/app/lib/discord-agent/handlers/commands';
import { handleDMMessage } from '@/app/lib/discord-agent/handlers/dm';

/**
 * Verify Discord request signature using Ed25519
 */
function verifyDiscordRequest(
  body: string,
  signature: string | null,
  timestamp: string | null
): boolean {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  if (!publicKey || !signature || !timestamp) {
    return false;
  }

  try {
    const isValid = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex')
    );
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Create a Discord interaction response
 */
function createResponse(type: InteractionResponseType, data?: object) {
  return NextResponse.json({ type, data });
}

/**
 * Create a deferred response (for long-running operations)
 */
function createDeferredResponse(ephemeral = false) {
  return createResponse(InteractionResponseType.DeferredChannelMessageWithSource, {
    flags: ephemeral ? MessageFlags.Ephemeral : 0,
  });
}

/**
 * Send a followup message after deferring
 */
async function sendFollowup(
  applicationId: string,
  interactionToken: string,
  content: string,
  ephemeral = false
) {
  const url = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`;

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      flags: ephemeral ? MessageFlags.Ephemeral : 0,
    }),
  });
}

/**
 * Main Discord interactions endpoint
 * This handles all slash commands and interactions via HTTP
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');

  // Verify request signature
  if (!verifyDiscordRequest(body, signature, timestamp)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const interaction: APIInteraction = JSON.parse(body);

  // Handle PING (verification from Discord)
  if (interaction.type === InteractionType.Ping) {
    return createResponse(InteractionResponseType.Pong);
  }

  // Handle Application Commands (slash commands)
  if (interaction.type === InteractionType.ApplicationCommand) {
    const commandInteraction = interaction as APIChatInputApplicationCommandInteraction;

    // Only handle chat input (slash) commands
    if (commandInteraction.data.type === ApplicationCommandType.ChatInput) {
      try {
        // Defer the response immediately for long-running operations
        const isHelpCommand = commandInteraction.data.name === 'help';

        if (isHelpCommand) {
          // Help command is fast, respond directly
          const helpResponse = getHelpMessage();
          return createResponse(InteractionResponseType.ChannelMessageWithSource, {
            content: helpResponse,
            flags: MessageFlags.Ephemeral,
          });
        }

        // For other commands, defer and process
        const applicationId = process.env.DISCORD_APPLICATION_ID!;
        const token = commandInteraction.token;

        // Use Next.js after() to run processing after response is sent
        // This keeps the serverless function alive until processing completes
        after(async () => {
          await processCommandAsync(commandInteraction, applicationId, token);
        });

        return createDeferredResponse();
      } catch (error) {
        console.error('Error handling command:', error);
        return createResponse(InteractionResponseType.ChannelMessageWithSource, {
          content: 'An error occurred while processing your command.',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }

  // Handle Message Components (buttons, select menus)
  if (interaction.type === InteractionType.MessageComponent) {
    const componentInteraction = interaction as APIMessageComponentInteraction;

    // Handle component interactions here
    console.log('Component interaction:', componentInteraction.data.custom_id);

    return createResponse(InteractionResponseType.DeferredMessageUpdate);
  }

  // Handle Modal Submits
  if (interaction.type === InteractionType.ModalSubmit) {
    // Handle modal submissions here
    return createResponse(InteractionResponseType.DeferredMessageUpdate);
  }

  // Unknown interaction type
  return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 });
}

/**
 * Process slash command asynchronously
 */
async function processCommandAsync(
  interaction: APIChatInputApplicationCommandInteraction,
  applicationId: string,
  token: string
) {
  try {
    const response = await handleSlashCommand(interaction);
    await sendFollowup(applicationId, token, response);
  } catch (error) {
    console.error('Error processing command:', error);
    await sendFollowup(
      applicationId,
      token,
      'An error occurred while processing your command. Please try again.',
      true
    );
  }
}

/**
 * Get help message with all available commands
 */
function getHelpMessage(): string {
  return `# PreRegExamPrep Discord Bot

## Email Commands
\`/email inbox\` - Show recent emails
\`/email search <query>\` - Search emails
\`/email read <id>\` - Read specific email
\`/email send <to> <subject> <body>\` - Send email
\`/email reply <id> <body>\` - Reply to email

## Calendar Commands
\`/calendar today\` - Today's events
\`/calendar week\` - This week's events
\`/calendar add <title> <date> <time>\` - Create event
\`/calendar free [date]\` - Find free slots

## AI Assistant
\`/ask <question>\` - Ask anything (e.g., "What's in my inbox?")

## Tips
- DM me directly for natural language conversations
- I can help with emails, calendar, and general questions about PreRegExamPrep`;
}
