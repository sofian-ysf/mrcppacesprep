import { Resend } from 'resend'
import { getSubscriptionActiveEmail } from './templates/subscription-active'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendSubscriptionActiveEmail(userEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'PreRegExamPrep <team@preregexamprep.com>',
      to: userEmail,
      subject: 'Your PreRegExamPrep Subscription is Active!',
      html: getSubscriptionActiveEmail(userEmail),
    })

    if (error) {
      console.error('Failed to send subscription email:', error)
      throw error
    }

    console.log('Subscription email sent:', data)
    return data
  } catch (error) {
    console.error('Error sending subscription email:', error)
    throw error
  }
}
