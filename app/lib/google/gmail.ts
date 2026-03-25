import { google, gmail_v1 } from 'googleapis';
import { getGoogleAuth } from './auth';

// Gmail client singleton
let gmailClient: gmail_v1.Gmail | null = null;

/**
 * Get or create Gmail client
 */
function getGmailClient(): gmail_v1.Gmail {
  if (gmailClient) {
    return gmailClient;
  }

  const auth = getGoogleAuth();
  gmailClient = google.gmail({ version: 'v1', auth });
  return gmailClient;
}

/**
 * Email message structure
 */
export interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body?: string;
  isUnread: boolean;
  labels: string[];
}

/**
 * Parse email headers to get subject, from, to, date
 */
function parseHeaders(headers: gmail_v1.Schema$MessagePartHeader[] | undefined): {
  subject: string;
  from: string;
  to: string;
  date: string;
} {
  const result = { subject: '', from: '', to: '', date: '' };

  if (!headers) return result;

  for (const header of headers) {
    const name = header.name?.toLowerCase();
    const value = header.value || '';

    switch (name) {
      case 'subject':
        result.subject = value;
        break;
      case 'from':
        result.from = value;
        break;
      case 'to':
        result.to = value;
        break;
      case 'date':
        result.date = value;
        break;
    }
  }

  return result;
}

/**
 * Decode base64url encoded content
 */
function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Extract email body from message parts
 */
function extractBody(payload: gmail_v1.Schema$MessagePart): string {
  // Check if the body is directly in the payload
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // Check parts for multipart messages
  if (payload.parts) {
    // Prefer text/plain over text/html
    const textPart = payload.parts.find(part => part.mimeType === 'text/plain');
    if (textPart?.body?.data) {
      return decodeBase64Url(textPart.body.data);
    }

    const htmlPart = payload.parts.find(part => part.mimeType === 'text/html');
    if (htmlPart?.body?.data) {
      // Strip HTML tags for a cleaner view
      const html = decodeBase64Url(htmlPart.body.data);
      return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    // Recursively check nested parts
    for (const part of payload.parts) {
      const body = extractBody(part);
      if (body) return body;
    }
  }

  return '';
}

/**
 * List recent emails from inbox
 */
export async function listEmails(options: {
  maxResults?: number;
  query?: string;
  labelIds?: string[];
} = {}): Promise<EmailMessage[]> {
  const gmail = getGmailClient();
  const { maxResults = 10, query, labelIds = ['INBOX'] } = options;

  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    q: query,
    labelIds,
  });

  const messages = response.data.messages || [];
  const emailPromises = messages.map(msg => getEmail(msg.id!));
  const emails = await Promise.all(emailPromises);

  return emails.filter((email): email is EmailMessage => email !== null);
}

/**
 * Get a specific email by ID
 */
export async function getEmail(messageId: string, includeBody = false): Promise<EmailMessage | null> {
  const gmail = getGmailClient();

  try {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: includeBody ? 'full' : 'metadata',
      metadataHeaders: ['Subject', 'From', 'To', 'Date'],
    });

    const message = response.data;
    const headers = parseHeaders(message.payload?.headers);
    const labels = message.labelIds || [];

    const email: EmailMessage = {
      id: message.id!,
      threadId: message.threadId!,
      snippet: message.snippet || '',
      subject: headers.subject,
      from: headers.from,
      to: headers.to,
      date: headers.date,
      isUnread: labels.includes('UNREAD'),
      labels,
    };

    if (includeBody && message.payload) {
      email.body = extractBody(message.payload);
    }

    return email;
  } catch (error) {
    console.error('Error fetching email:', error);
    return null;
  }
}

/**
 * Read full email with body
 */
export async function readEmail(messageId: string): Promise<EmailMessage | null> {
  return getEmail(messageId, true);
}

/**
 * Search emails with query
 */
export async function searchEmails(query: string, maxResults = 10): Promise<EmailMessage[]> {
  return listEmails({ query, maxResults });
}

/**
 * Send an email
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  inReplyTo?: string;
  threadId?: string;
}): Promise<{ id: string; threadId: string }> {
  const gmail = getGmailClient();
  const targetEmail = process.env.GMAIL_TARGET_EMAIL || 'team@preregexamprep.com';

  const { to, subject, body, cc, bcc, inReplyTo, threadId } = options;

  // Build email headers
  const headers = [
    `From: ${targetEmail}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
  ];

  if (cc) headers.push(`Cc: ${cc}`);
  if (bcc) headers.push(`Bcc: ${bcc}`);
  if (inReplyTo) {
    headers.push(`In-Reply-To: ${inReplyTo}`);
    headers.push(`References: ${inReplyTo}`);
  }

  const emailContent = headers.join('\r\n') + '\r\n\r\n' + body;
  const encodedMessage = Buffer.from(emailContent).toString('base64url');

  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
      threadId,
    },
  });

  return {
    id: response.data.id!,
    threadId: response.data.threadId!,
  };
}

/**
 * Reply to an email
 */
export async function replyToEmail(
  originalMessageId: string,
  body: string
): Promise<{ id: string; threadId: string }> {
  const original = await readEmail(originalMessageId);
  if (!original) {
    throw new Error('Original email not found');
  }

  // Extract email address from "From" field
  const fromMatch = original.from.match(/<(.+)>/) || [null, original.from];
  const replyTo = fromMatch[1] || original.from;

  // Add "Re:" prefix if not already present
  const subject = original.subject.startsWith('Re:')
    ? original.subject
    : `Re: ${original.subject}`;

  return sendEmail({
    to: replyTo,
    subject,
    body,
    inReplyTo: `<${originalMessageId}>`,
    threadId: original.threadId,
  });
}

/**
 * Create a draft email
 */
export async function createDraft(options: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ id: string; messageId: string }> {
  const gmail = getGmailClient();
  const targetEmail = process.env.GMAIL_TARGET_EMAIL || 'team@preregexamprep.com';

  const { to, subject, body } = options;

  const headers = [
    `From: ${targetEmail}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
  ];

  const emailContent = headers.join('\r\n') + '\r\n\r\n' + body;
  const encodedMessage = Buffer.from(emailContent).toString('base64url');

  const response = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: {
      message: {
        raw: encodedMessage,
      },
    },
  });

  return {
    id: response.data.id!,
    messageId: response.data.message?.id!,
  };
}

/**
 * Mark email as read
 */
export async function markAsRead(messageId: string): Promise<void> {
  const gmail = getGmailClient();

  await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: {
      removeLabelIds: ['UNREAD'],
    },
  });
}

/**
 * Get unread email count
 */
export async function getUnreadCount(): Promise<number> {
  const gmail = getGmailClient();

  const response = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX', 'UNREAD'],
    maxResults: 1,
  });

  return response.data.resultSizeEstimate || 0;
}

/**
 * List available labels
 */
export async function listLabels(): Promise<{ id: string; name: string }[]> {
  const gmail = getGmailClient();

  const response = await gmail.users.labels.list({
    userId: 'me',
  });

  return (response.data.labels || []).map(label => ({
    id: label.id!,
    name: label.name!,
  }));
}
