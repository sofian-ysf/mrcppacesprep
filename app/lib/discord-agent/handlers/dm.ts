import { runAgent } from '../graph';
import {
  getOrCreateThread,
  addMessage,
  getThreadMessages,
  convertToLangChainMessages,
  updateUserActivity,
  isUserAuthorized,
} from '../memory';

/**
 * Handle direct message to the bot
 */
export async function handleDMMessage(
  discordUserId: string,
  discordUsername: string,
  message: string
): Promise<string> {
  try {
    // Check if user is authorized
    const authorized = await isUserAuthorized(discordUserId);
    if (!authorized) {
      return `Sorry, you're not authorized to use this bot. Please contact an administrator.`;
    }

    // Update user activity
    await updateUserActivity(discordUserId);

    // Get or create thread
    const threadId = await getOrCreateThread(discordUserId, undefined, true);

    // Get previous messages from thread
    const previousMessages = await getThreadMessages(threadId, 10);
    const langChainMessages = convertToLangChainMessages(previousMessages);

    // Add the new user message to the thread
    await addMessage(threadId, 'user', message, undefined, undefined, {
      discordUsername,
    });

    // Run the agent
    const response = await runAgent(
      message,
      discordUserId,
      threadId,
      langChainMessages
    );

    // Add the assistant response to the thread
    await addMessage(threadId, 'assistant', response);

    // Truncate if too long for Discord (max 2000 chars)
    if (response.length > 1900) {
      return response.substring(0, 1900) + '\n\n...(truncated)';
    }

    return response;
  } catch (error) {
    console.error('Error handling DM:', error);
    return `Sorry, I encountered an error processing your message. Please try again.`;
  }
}

/**
 * Handle channel message (when bot is mentioned)
 */
export async function handleChannelMessage(
  discordUserId: string,
  discordUsername: string,
  channelId: string,
  message: string
): Promise<string> {
  try {
    // Check if user is authorized
    const authorized = await isUserAuthorized(discordUserId);
    if (!authorized) {
      return `Sorry, you're not authorized to use this bot.`;
    }

    // Update user activity
    await updateUserActivity(discordUserId);

    // Get or create thread for this channel
    const threadId = await getOrCreateThread(discordUserId, channelId, false);

    // Get previous messages (fewer for channel context)
    const previousMessages = await getThreadMessages(threadId, 5);
    const langChainMessages = convertToLangChainMessages(previousMessages);

    // Add the new user message
    await addMessage(threadId, 'user', message, undefined, undefined, {
      discordUsername,
      channelId,
    });

    // Run the agent
    const response = await runAgent(
      message,
      discordUserId,
      threadId,
      langChainMessages
    );

    // Add the assistant response
    await addMessage(threadId, 'assistant', response);

    // Truncate if too long
    if (response.length > 1900) {
      return response.substring(0, 1900) + '\n\n...(truncated)';
    }

    return response;
  } catch (error) {
    console.error('Error handling channel message:', error);
    return `Sorry, I encountered an error. Please try again.`;
  }
}
