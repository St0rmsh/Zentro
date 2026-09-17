 export const forgotPasswordTemplate =  (otp: string)=>{
    return  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset – OTP</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#0f0f0f;padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:480px;background-color:#1a1a1a;border-radius:12px;
                      border:1px solid #2e2e2e;overflow:hidden;">

          <!-- Top accent bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#6c63ff,#a78bfa);
                       font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 24px;border-bottom:1px solid #2e2e2e;">
              <!-- Logo / Brand -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:34px;height:34px;background:#6c63ff;border-radius:8px;
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

              <!-- Eyebrow -->
              <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:1.5px;
                         text-transform:uppercase;color:#6c63ff;">
                Security Request
              </p>

              <!-- Headline -->
              <h1 style="margin:0 0 14px;font-size:26px;font-weight:700;
                          line-height:1.25;color:#f0f0f0;">
                Reset your password
              </h1>

              <!-- Body copy -->
              <p style="margin:0 0 32px;font-size:15px;line-height:1.65;color:#999;">
                We received a request to reset the password for your Zentro account.
                Use the code below to proceed. Do not share this code with anyone.
              </p>

              <!-- OTP Block -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#111;border:1px solid #2e2e2e;
                             border-left:3px solid #6c63ff;
                             border-radius:8px;padding:28px 24px;text-align:center;">

                    <p style="margin:0 0 10px;font-size:11px;font-weight:600;
                               letter-spacing:1.5px;text-transform:uppercase;color:#666;">
                      One-Time Password
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
                        <td style="background-color:#1f1b33;border:1px solid #3d3466;
                                   border-radius:20px;padding:4px 14px;">
                          <span style="font-size:12px;color:#a78bfa;font-weight:500;">
                            ⏱ Expires in 1 minute
                          </span>
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
                      <strong style="color:#d4a94e;">Didn't request this?</strong>&nbsp;
                      You can safely ignore this email. Your password will not change
                      unless you enter this code.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #2e2e2e;">
              <p style="margin:0;font-size:12px;line-height:1.7;color:#555;text-align:center;">
                This is an automated message from <strong style="color:#666;">Zentro</strong>.
                Please do not reply to this email.
              </p>
              <p style="margin:10px 0 0;font-size:12px;color:#3a3a3a;text-align:center;">
                © 2025 Zentro. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`
 }