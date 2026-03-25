export function getTrialReminderEmail(userEmail: string, firstName?: string): string {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
  return `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <title>Continue Your Exam Prep</title>
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
                                                                    MRCPPACESPREP
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
                                                                    <h2 class="header-text" style="margin: 0 0 20px 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 24px; color: #333333; font-weight: 600; transform: scaleY(0.85); transform-origin: top;">
                                                                        Keep the Momentum Going
                                                                    </h2>

                                                                    <p style="margin: 0 0 20px 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; color: #333333; line-height: 1.6;">
                                                                        ${greeting}
                                                                    </p>

                                                                    <p style="margin: 0 0 20px 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; color: #333333; line-height: 1.6;">
                                                                        Preparing for the MRCP PACES exam requires consistent practice. We noticed you haven't logged in recently, and we wanted to remind you that your free trial is still active.
                                                                    </p>

                                                                    <div style="background-color: #e8e9eb; border-radius: 6px; padding: 20px; margin: 25px 0;">
                                                                        <p class="header-text" style="margin: 0 0 15px 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; color: #333333; font-weight: 600; transform: scaleY(0.85); transform-origin: top;">
                                                                            Why practice regularly?
                                                                        </p>
                                                                        <ul style="margin: 0; padding-left: 20px; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 14px; color: #555555; line-height: 1.8;">
                                                                            <li>Build confidence with real exam-style questions</li>
                                                                            <li>Identify knowledge gaps early</li>
                                                                            <li>Track your progress over time</li>
                                                                            <li>Improve your time management skills</li>
                                                                        </ul>
                                                                    </div>

                                                                    <!-- CTA Button -->
                                                                    <table class="button_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td style="text-align: left; padding: 10px 0;">
                                                                                <a href="https://www.mrcppacesprep.com/questions" target="_blank" style="text-decoration: none; display: inline-block; color: #ffffff; background-color: #000000; border-radius: 4px; width: auto; border: 0; padding: 12px 24px; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; text-align: center; mso-border-alt: none; word-break: keep-all;">
                                                                                    Continue Practising
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>

                                                                    <p style="margin: 25px 0 0 0; font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
                                                                        Questions? Reply to this email or contact us at <a href="mailto:team@mrcppacesprep.com" style="color: #000000;">team@mrcppacesprep.com</a>
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
                                                                    <a href="https://www.mrcppacesprep.com/" target="_blank" style="color: #666666; text-decoration: none;">mrcppacesprep.com</a>
                                                                </div>
                                                                <div style="font-family: 'Archivo', Arial, Helvetica, sans-serif; font-size: 12px; color: #999999; margin-top: 10px;">
                                                                    You're receiving this because you signed up for MRCPPACESPREP (${userEmail}).
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
