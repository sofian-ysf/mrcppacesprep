import { Resend } from 'resend'
import { getSubscriptionActiveEmail, PlanDetails } from './templates/subscription-active'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendSubscriptionActiveEmail(userEmail: string, plan?: PlanDetails) {
  try {
    const planName = plan?.name || 'your plan'
    const { data, error } = await resend.emails.send({
      from: 'MRCPPACESPREP <team@mrcppacesprep.com>',
      to: userEmail,
      subject: `Your MRCPPACESPREP ${planName} Plan is Active!`,
      html: getSubscriptionActiveEmail(userEmail, plan),
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
