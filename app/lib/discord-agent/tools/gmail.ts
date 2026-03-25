import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  listEmails,
  readEmail,
  searchEmails,
  sendEmail,
  replyToEmail,
  getUnreadCount,
  EmailMessage,
} from '@/app/lib/google/gmail';

/**
 * Format email for display
 */
function formatEmail(email: EmailMessage, includeBody = false): string {
  const unreadMarker = email.isUnread ? '🔵 ' : '';
  const date = new Date(email.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let formatted = `${unreadMarker}**${email.subject}**\n`;
  formatted += `From: ${email.from}\n`;
  formatted += `Date: ${date}\n`;
  formatted += `ID: \`${email.id}\`\n`;

  if (includeBody && email.body) {
    const body = email.body.length > 500
      ? email.body.substring(0, 500) + '...'
      : email.body;
    formatted += `\n${body}\n`;
  } else {
    formatted += `Preview: ${email.snippet}\n`;
  }

  return formatted;
}

/**
 * Tool: List recent emails from inbox
 */
export const listEmailsTool = tool(
  async ({ count }) => {
    try {
      const emails = await listEmails({ maxResults: count });

      if (emails.length === 0) {
        return 'No emails found in inbox.';
      }

      const unreadCount = await getUnreadCount();
      let response = `📬 **Inbox** (${unreadCount} unread)\n\n`;

      for (const email of emails) {
        response += formatEmail(email) + '\n---\n';
      }

      return response;
    } catch (error) {
      console.error('Error listing emails:', error);
      return `Error fetching emails: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'list_emails',
    description: 'List recent emails from the inbox',
    schema: z.object({
      count: z.number().min(1).max(20).default(5).describe('Number of emails to retrieve'),
    }),
  }
);

/**
 * Tool: Read a specific email
 */
export const readEmailTool = tool(
  async ({ emailId }) => {
    try {
      const email = await readEmail(emailId);

      if (!email) {
        return `Email with ID \`${emailId}\` not found.`;
      }

      return formatEmail(email, true);
    } catch (error) {
      console.error('Error reading email:', error);
      return `Error reading email: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'read_email',
    description: 'Read the full content of a specific email',
    schema: z.object({
      emailId: z.string().describe('The ID of the email to read'),
    }),
  }
);

/**
 * Tool: Search emails
 */
export const searchEmailsTool = tool(
  async ({ query, count }) => {
    try {
      const emails = await searchEmails(query, count);

      if (emails.length === 0) {
        return `No emails found matching: "${query}"`;
      }

      let response = `🔍 **Search results for:** "${query}"\n\n`;

      for (const email of emails) {
        response += formatEmail(email) + '\n---\n';
      }

      return response;
    } catch (error) {
      console.error('Error searching emails:', error);
      return `Error searching emails: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'search_emails',
    description: 'Search emails with a query. Supports Gmail search syntax (from:, to:, subject:, has:attachment, etc.)',
    schema: z.object({
      query: z.string().describe('Search query (supports Gmail search syntax)'),
      count: z.number().min(1).max(20).default(10).describe('Maximum number of results'),
    }),
  }
);

/**
 * Tool: Send an email
 */
export const sendEmailTool = tool(
  async ({ to, subject, body }) => {
    try {
      const result = await sendEmail({ to, subject, body });

      return `✅ **Email sent successfully!**\nTo: ${to}\nSubject: ${subject}\nMessage ID: \`${result.id}\``;
    } catch (error) {
      console.error('Error sending email:', error);
      return `Error sending email: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'send_email',
    description: 'Send a new email',
    schema: z.object({
      to: z.string().email().describe('Recipient email address'),
      subject: z.string().describe('Email subject line'),
      body: z.string().describe('Email body content'),
    }),
  }
);

/**
 * Tool: Reply to an email
 */
export const replyToEmailTool = tool(
  async ({ emailId, body }) => {
    try {
      const result = await replyToEmail(emailId, body);

      return `✅ **Reply sent successfully!**\nThread ID: \`${result.threadId}\`\nMessage ID: \`${result.id}\``;
    } catch (error) {
      console.error('Error replying to email:', error);
      return `Error replying to email: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'reply_to_email',
    description: 'Reply to an existing email thread',
    schema: z.object({
      emailId: z.string().describe('The ID of the email to reply to'),
      body: z.string().describe('The reply message content'),
    }),
  }
);

/**
 * Tool: Get unread email count
 */
export const getUnreadCountTool = tool(
  async () => {
    try {
      const count = await getUnreadCount();
      return `You have **${count}** unread emails.`;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return `Error getting unread count: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
  {
    name: 'get_unread_count',
    description: 'Get the number of unread emails in the inbox',
    schema: z.object({}),
  }
);

/**
 * Export all Gmail tools
 */
export const gmailTools = [
  listEmailsTool,
  readEmailTool,
  searchEmailsTool,
  sendEmailTool,
  replyToEmailTool,
  getUnreadCountTool,
];
