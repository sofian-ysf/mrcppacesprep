export function getTrialExpiringEmail(userEmail: string, daysRemaining: number, firstName?: string): string {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
  const urgencyText = daysRemaining <= 1
    ? 'Your trial expires tomorrow!'
    : `Your trial expires in ${daysRemaining} days`

  return `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <title>Your Trial is Expiring</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }

        p {
            line-height: inherit
        }

        .header-text {
            transform: scaleY(0.85);
            transform-origin: top;
        }

        @media (max-width:620px) {
            .row-content {
                width: 100% !important;
            }

            .column {
                width: 100%;
                display: block;
            }

            .content-padding {
                padding: 20px !important;
            }
        }
    </style>
</head>

<body style="background-color: #f2f3f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f2f3f5;">
        <tbody>
            <tr>
                <td>
                    <!-- Header with Logo -->
                    <table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f2f3f5;">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #f2f3f5; width: 600px; margin: 0 auto;" width="600">
                                        <tbody>
                                            <tr>
                                                <td class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 40px 20px 30px 20px; vertical-align: top;">
                                                    <table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td style="text-align: left;">
                                                                <div class="header-text" style="font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 700; color: #333333; transform: scaleY(0.85); transform-origin: top;">
                                                                    PreRegExamPrep
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Main Content -->
                    <table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f2f3f5;">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #f2f3f5; width: 600px; margin: 0 auto;" width="600">
                                        <tbody>
                                            <tr>
                                                <td class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 0 20px 40px 20px; vertical-align: top;">
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td>
                                                                <div class="content-padding" style="padding: 10px 0;">
                                                                    <!-- Urgency Banner -->
                                                                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 0 6px 6px 0;">
                                                                        <p style="margin: 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; color: #92400e; font-weight: 600;">
                                                                            ${urgencyText}
                                                                        </p>
                                                                    </div>

                                                                    <h2 class="header-text" style="margin: 0 0 20px 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 24px; color: #333333; font-weight: 600; transform: scaleY(0.85); transform-origin: top;">
                                                                        Don't Lose Your Progress
                                                                    </h2>

                                                                    <p style="margin: 0 0 20px 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; color: #333333; line-height: 1.6;">
                                                                        ${greeting}
                                                                    </p>

                                                                    <p style="margin: 0 0 20px 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; color: #333333; line-height: 1.6;">
                                                                        Your free trial of PreRegExamPrep is coming to an end. Subscribe now to maintain access to all our GPhC exam preparation resources.
                                                                    </p>

                                                                    <div style="background-color: #e8e9eb; border-radius: 6px; padding: 20px; margin: 25px 0;">
                                                                        <p class="header-text" style="margin: 0 0 15px 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; color: #333333; font-weight: 600; transform: scaleY(0.85); transform-origin: top;">
                                                                            What you'll keep with a subscription
                                                                        </p>
                                                                        <ul style="margin: 0; padding-left: 20px; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 14px; color: #555555; line-height: 1.8;">
                                                                            <li>Unlimited access to 2000+ practice questions</li>
                                                                            <li>Full mock exams simulating the real GPhC assessment</li>
                                                                            <li>Detailed explanations for every question</li>
                                                                            <li>Performance tracking and analytics</li>
                                                                            <li>Study guides and resources</li>
                                                                        </ul>
                                                                    </div>

                                                                    <!-- CTA Button -->
                                                                    <table class="button_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td style="text-align: left; padding: 10px 0;">
                                                                                <a href="https://www.preregexamprep.com/pricing" target="_blank" style="text-decoration: none; display: inline-block; color: #ffffff; background-color: #000000; border-radius: 4px; width: auto; border: 0; padding: 12px 24px; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; text-align: center; mso-border-alt: none; word-break: keep-all;">
                                                                                    Subscribe Now
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>

                                                                    <div style="border-top: 1px solid #d1d3d6; margin-top: 25px; padding-top: 20px;">
                                                                        <p style="margin: 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 14px; color: #666666;">
                                                                            <strong>Account:</strong> ${userEmail}
                                                                        </p>
                                                                    </div>

                                                                    <p style="margin: 25px 0 0 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
                                                                        Questions? Reply to this email or contact us at <a href="mailto:team@preregexamprep.com" style="color: #000000;">team@preregexamprep.com</a>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f2f3f5;">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #f2f3f5; width: 600px; margin: 0 auto;" width="600">
                                        <tbody>
                                            <tr>
                                                <td class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: center; padding: 20px 20px 40px 20px; vertical-align: top;">
                                                    <table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                        <tr>
                                                            <td style="text-align: left;">
                                                                <div style="font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 14px; color: #666666;">
                                                                    <a href="https://www.preregexamprep.com/" target="_blank" style="color: #666666; text-decoration: none;">preregexamprep.com</a>
                                                                </div>
                                                                <div style="font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 12px; color: #999999; margin-top: 10px;">
                                                                    You're receiving this because you signed up for PreRegExamPrep.
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`
}
