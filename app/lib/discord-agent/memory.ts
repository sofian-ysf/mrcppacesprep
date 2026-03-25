import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';

// Supabase admin client singleton
let supabaseAdmin: SupabaseClient | null = null;

/**
 * Get Supabase admin client (service role)
 */
function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!url || !serviceKey) {
      throw new Error('Missing Supabase credentials');
    }

    supabaseAdmin = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdmin;
}

/**
 * Thread data structure
 */
export interface Thread {
  id: string;
  discordUserId: string;
  discordChannelId: string | null;
  isDm: boolean;
  context: Record<string, unknown>;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Message data structure
 */
export interface Message {
  id: string;
  threadId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: unknown[];
  toolCallId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Get or create a thread for a Discord user
 */
export async function getOrCreateThread(
  discordUserId: string,
  discordChannelId?: string,
  isDm = true
): Promise<string> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc('get_or_create_discord_thread', {
    p_discord_user_id: discordUserId,
    p_discord_channel_id: discordChannelId || null,
    p_is_dm: isDm,
  });

  if (error) {
    console.error('Error getting/creating thread:', error);
    throw error;
  }

  return data as string;
}

/**
 * Add a message to a thread
 */
export async function addMessage(
  threadId: string,
  role: 'user' | 'assistant' | 'system' | 'tool',
  content: string,
  toolCalls?: unknown[],
  toolCallId?: string,
  metadata: Record<string, unknown> = {}
): Promise<string> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc('add_discord_message', {
    p_thread_id: threadId,
    p_role: role,
    p_content: content,
    p_tool_calls: toolCalls ? JSON.stringify(toolCalls) : null,
    p_tool_call_id: toolCallId || null,
    p_metadata: JSON.stringify(metadata),
  });

  if (error) {
    console.error('Error adding message:', error);
    throw error;
  }

  return data as string;
}

/**
 * Get messages from a thread
 */
export async function getThreadMessages(
  threadId: string,
  limit = 20
): Promise<Message[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc('get_discord_thread_messages', {
    p_thread_id: threadId,
    p_limit: limit,
  });

  if (error) {
    console.error('Error getting thread messages:', error);
    throw error;
  }

  // Reverse to get chronological order
  return (data as Message[]).reverse();
}

/**
 * Convert database messages to LangChain format
 */
export function convertToLangChainMessages(messages: Message[]): BaseMessage[] {
  return messages.map(msg => {
    switch (msg.role) {
      case 'user':
        return new HumanMessage(msg.content);
      case 'assistant':
        return new AIMessage({
          content: msg.content,
          tool_calls: msg.toolCalls as AIMessage['tool_calls'],
        });
      case 'system':
        return new SystemMessage(msg.content);
      case 'tool':
        return new ToolMessage({
          content: msg.content,
          tool_call_id: msg.toolCallId || '',
        });
      default:
        return new HumanMessage(msg.content);
    }
  });
}

/**
 * Log tool execution
 */
export async function logToolExecution(
  threadId: string | null,
  discordUserId: string,
  toolName: string,
  toolInput: Record<string, unknown>,
  toolOutput?: unknown,
  status: 'pending' | 'success' | 'error' = 'pending',
  errorMessage?: string,
  executionTimeMs?: number
): Promise<string> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc('log_discord_tool_execution', {
    p_thread_id: threadId,
    p_discord_user_id: discordUserId,
    p_tool_name: toolName,
    p_tool_input: JSON.stringify(toolInput),
    p_tool_output: toolOutput ? JSON.stringify(toolOutput) : null,
    p_status: status,
    p_error_message: errorMessage || null,
    p_execution_time_ms: executionTimeMs || null,
  });

  if (error) {
    console.error('Error logging tool execution:', error);
    throw error;
  }

  return data as string;
}

/**
 * Check if a Discord user is authorized
 */
export async function isUserAuthorized(discordUserId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc('is_discord_user_authorized', {
    p_discord_user_id: discordUserId,
  });

  if (error) {
    console.error('Error checking user authorization:', error);
    return false;
  }

  return data as boolean;
}

/**
 * Update user's last active timestamp
 */
export async function updateUserActivity(discordUserId: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  await supabase
    .from('discord_users')
    .upsert({
      discord_user_id: discordUserId,
      last_active_at: new Date().toISOString(),
    }, {
      onConflict: 'discord_user_id',
    });
}

/**
 * Update thread context
 */
export async function updateThreadContext(
  threadId: string,
  context: Record<string, unknown>
): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('discord_threads')
    .update({ context })
    .eq('id', threadId);

  if (error) {
    console.error('Error updating thread context:', error);
    throw error;
  }
}

/**
 * Get thread context
 */
export async function getThreadContext(threadId: string): Promise<Record<string, unknown>> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('discord_threads')
    .select('context')
    .eq('id', threadId)
    .single();

  if (error) {
    console.error('Error getting thread context:', error);
    return {};
  }

  return (data?.context as Record<string, unknown>) || {};
}
