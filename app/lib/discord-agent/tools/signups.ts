import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Supabase admin client
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * User signup info
 */
interface SignupUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  raw_user_meta_data: Record<string, unknown>;
}

/**
 * Tool: Get recent sign-ups
 */
export const getRecentSignupsTool = tool(
  async ({ days, limit }) => {
    try {
      const supabase = getSupabaseAdmin();

      // Calculate date threshold
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      // Query auth.users table for recent sign-ups
      const { data: users, error } = await supabase
        .from('users_view')
        .select('id, email, created_at, last_sign_in_at, email_confirmed_at, raw_user_meta_data')
        .gte('created_at', dateThreshold.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);

      // If view doesn't exist, try direct auth query
      if (error) {
        // Use auth admin API instead
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
          perPage: limit,
        });

        if (authError) {
          return `Error fetching users: ${authError.message}`;
        }

        const recentUsers = authData.users
          .filter(u => new Date(u.created_at) >= dateThreshold)
          .slice(0, limit);

        if (recentUsers.length === 0) {
          return `No sign-ups found in the last ${days} days.`;
        }

        let response = `📋 **Recent Sign-ups** (Last ${days} days)\n\n`;
        response += `Found **${recentUsers.length}** users:\n\n`;

        for (const user of recentUsers) {
          const signupDate = new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          const confirmed = user.email_confirmed_at ? '✅' : '⏳';
          const lastLogin = user.last_sign_in_at
            ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'Never';

          response += `${confirmed} **${user.email}**\n`;
          response += `   Signed up: ${signupDate}\n`;
          response += `   Last login: ${lastLogin}\n\n`;
        }

        return response;
      }

      if (!users || users.length === 0) {
        return `No sign-ups found in the last ${days} days.`;
      }

      let response = `📋 **Recent Sign-ups** (Last ${days} days)\n\n`;
      response += `Found **${users.length}** users:\n\n`;

      for (const user of users as SignupUser[]) {
        const signupDate = new Date(user.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const confirmed = user.email_confirmed_at ? '✅' : '⏳';
        const lastLogin = user.last_sign_in_at
          ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'Never';

        response += `${confirmed} **${user.email}**\n`;
        response += `   Signed up: ${signupDate}\n`;
        response += `   Last login: ${lastLogin}\n\n`;
      }

      return response;
    } catch (error) {
      console.error('Error fetching signups:', error);
      return `Error fetching sign-ups: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'get_recent_signups',
    description: 'Get recent user sign-ups from the database. Returns email addresses and signup dates.',
    schema: z.object({
      days: z.number().min(1).max(90).default(7).describe('Number of days to look back'),
      limit: z.number().min(1).max(100).default(50).describe('Maximum number of users to return'),
    }),
  }
);

/**
 * Tool: Get users who signed up but never logged in (abandoned)
 */
export const getAbandonedSignupsTool = tool(
  async ({ days, limit }) => {
    try {
      const supabase = getSupabaseAdmin();

      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      const { data: authData, error } = await supabase.auth.admin.listUsers({
        perPage: 500,
      });

      if (error) {
        return `Error fetching users: ${error.message}`;
      }

      // Filter for users who signed up in the period but never logged in after signup
      const abandonedUsers = authData.users
        .filter(u => {
          const createdAt = new Date(u.created_at);
          const isRecent = createdAt >= dateThreshold;
          // Never logged in, or only logged in once (at signup)
          const neverReturned = !u.last_sign_in_at ||
            (u.last_sign_in_at === u.created_at);
          return isRecent && neverReturned;
        })
        .slice(0, limit);

      if (abandonedUsers.length === 0) {
        return `No abandoned sign-ups found in the last ${days} days.`;
      }

      let response = `⚠️ **Abandoned Sign-ups** (Last ${days} days)\n`;
      response += `Users who signed up but never returned:\n\n`;
      response += `Found **${abandonedUsers.length}** users:\n\n`;

      for (const user of abandonedUsers) {
        const signupDate = new Date(user.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        response += `• **${user.email}** - Signed up ${signupDate}\n`;
      }

      response += `\n💡 These users might benefit from a follow-up email!`;

      return response;
    } catch (error) {
      console.error('Error fetching abandoned signups:', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'get_abandoned_signups',
    description: 'Get users who signed up but never logged in again. Good for follow-up emails.',
    schema: z.object({
      days: z.number().min(1).max(90).default(7).describe('Number of days to look back'),
      limit: z.number().min(1).max(100).default(50).describe('Maximum number of users to return'),
    }),
  }
);

/**
 * Tool: Get signup emails as a list (for bulk operations)
 */
export const getSignupEmailListTool = tool(
  async ({ days, onlyAbandoned }) => {
    try {
      const supabase = getSupabaseAdmin();

      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      const { data: authData, error } = await supabase.auth.admin.listUsers({
        perPage: 500,
      });

      if (error) {
        return `Error fetching users: ${error.message}`;
      }

      let users = authData.users.filter(u => new Date(u.created_at) >= dateThreshold);

      if (onlyAbandoned) {
        users = users.filter(u => !u.last_sign_in_at || u.last_sign_in_at === u.created_at);
      }

      if (users.length === 0) {
        return `No users found matching criteria.`;
      }

      const emails = users.map(u => u.email).filter(Boolean);

      return `📧 **Email List** (${emails.length} users)\n\n${emails.join('\n')}`;
    } catch (error) {
      console.error('Error fetching email list:', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'get_signup_email_list',
    description: 'Get a plain list of emails from recent sign-ups for bulk email operations.',
    schema: z.object({
      days: z.number().min(1).max(90).default(7).describe('Number of days to look back'),
      onlyAbandoned: z.boolean().default(false).describe('Only include users who never returned'),
    }),
  }
);

export const signupTools = [
  getRecentSignupsTool,
  getAbandonedSignupsTool,
  getSignupEmailListTool,
];
