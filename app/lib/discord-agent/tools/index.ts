import { gmailTools } from './gmail';
import { calendarTools } from './calendar';
import { signupTools } from './signups';

export { gmailTools } from './gmail';
export { calendarTools } from './calendar';
export { signupTools } from './signups';

/**
 * All available tools for the Discord agent
 */
export const allTools = [...gmailTools, ...calendarTools, ...signupTools];
