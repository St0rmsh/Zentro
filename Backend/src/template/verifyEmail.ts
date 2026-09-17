export const verifyEmail = (otp: string)=>{
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email – Zentro</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0f0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#0a0f0a;padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:480px;background-color:#111612;border-radius:12px;
                      border:1px solid #1f2b1f;overflow:hidden;">

          <!-- Top accent bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#22c55e,#4ade80);
                       font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 24px;border-bottom:1px solid #1f2b1f;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:34px;height:34px;background:#22c55e;border-radius:8px;
                             text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:18px;font-weight:700;line-height:34px;">Z</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#e5e5e5;font-size:17px;font-weight:600;
                                 letter-spacing:0.3px;">Zentro</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 0;">

              <!-- Icon circle -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td style="width:52px;height:52px;background-color:#0d1f12;
                             border:1px solid #1f3a22;border-radius:50%;
                             text-align:center;vertical-align:middle;">
                    <span style="font-size:24px;line-height:52px;">✉️</span>
                  </td>
                </tr>
              </table>

              <!-- Eyebrow -->
              <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:1.5px;
                         text-transform:uppercase;color:#22c55e;">
                Email Verification
              </p>

              <!-- Headline -->
              <h1 style="margin:0 0 14px;font-size:26px;font-weight:700;
                          line-height:1.25;color:#f0f0f0;">
                Confirm your email address
              </h1>

              <!-- Body copy -->
              <p style="margin:0 0 32px;font-size:15px;line-height:1.65;color:#7a8c7a;">
                Thanks for signing up for Zentro. Enter the code below to verify your
                email address and activate your account.
              </p>

              <!-- OTP Block -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#0d1a0d;border:1px solid #1f3a22;
                             border-top:3px solid #22c55e;
                             border-radius:8px;padding:28px 24px;text-align:center;">

                    <p style="margin:0 0 10px;font-size:11px;font-weight:600;
                               letter-spacing:1.5px;text-transform:uppercase;color:#4a6b4a;">
                      Verification Code
                    </p>

                    <!-- OTP Value -->
                    <p style="margin:0;font-size:42px;font-weight:700;letter-spacing:12px;
                               color:#f0f0f0;font-family:'Courier New',Courier,monospace;">
                      ${otp}
                    </p>

                    <!-- Expiry badge -->
                    <table cellpadding="0" cellspacing="0" border="0"
                           style="margin:14px auto 0;">
                      <tr>
                        <td style="background-color:#0a1f10;border:1px solid #1a4025;
                                   border-radius:20px;padding:4px 14px;">
                          <span style="font-size:12px;color:#4ade80;font-weight:500;">
                            ⏱ Expires in 1 minute
                          </span>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Steps hint -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin-bottom:32px;">
                <tr>
                  <td style="padding:16px 18px;background-color:#0d1a0d;
                             border:1px solid #1f3a22;border-radius:8px;">

                    <!-- Step 1 -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%"
                           style="margin-bottom:10px;">
                      <tr>
                        <td style="width:24px;height:24px;background:#1a3a1a;border-radius:50%;
                                   text-align:center;vertical-align:middle;">
                          <span style="font-size:11px;font-weight:700;color:#4ade80;">1</span>
                        </td>
                        <td style="padding-left:12px;font-size:13px;color:#7a9a7a;
                                   vertical-align:middle;">
                          Go back to the Zentro verification page
                        </td>
                      </tr>
                    </table>

                    <!-- Step 2 -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="width:24px;height:24px;background:#1a3a1a;border-radius:50%;
                                   text-align:center;vertical-align:middle;">
                          <span style="font-size:11px;font-weight:700;color:#4ade80;">2</span>
                        </td>
                        <td style="padding-left:12px;font-size:13px;color:#7a9a7a;
                                   vertical-align:middle;">
                          Enter the 6-digit code above to complete sign-up
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin-bottom:36px;">
                <tr>
                  <td style="background-color:#1a1108;border:1px solid #3a2e14;
                             border-radius:8px;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#b89a5a;">
                      <strong style="color:#d4a94e;">Didn't create an account?</strong>&nbsp;
                      You can safely ignore this email. No account will be created
                      without entering this code.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #1f2b1f;">
              <p style="margin:0;font-size:12px;line-height:1.7;color:#3a4a3a;text-align:center;">
                This is an automated message from <strong style="color:#4a5e4a;">Zentro</strong>.
                Please do not reply to this email.
              </p>
              <p style="margin:10px 0 0;font-size:12px;color:#2a352a;text-align:center;">
                © 2025 Zentro. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}