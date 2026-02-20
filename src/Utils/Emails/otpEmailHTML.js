export const template = (code, firstName, subject) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #eef2f7;
    }
    .email-container {
      max-width: 500px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .email-header {
      background-color: #1e3a8a;
      color: #ffffff;
      text-align: center;
      padding: 25px 15px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
    .email-body {
      padding: 20px;
      color: #333333;
      line-height: 1.5;
    }
    .email-body h2 {
      margin-top: 0;
      font-size: 18px;
      color: #082c46;
      font-weight: 500;
    }
    .activation-code {
      display: block;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin: 20px 0;
      padding: 12px 0;
      background-color: #e0e7ff;
      border-radius: 6px;
      color: #1e3a8a;
      letter-spacing: 2px;
    }

    .email-footer {
      text-align: center;
      padding: 15px;
      background-color: #f4f6fb;
      font-size: 13px;
      color: #555555;
    }
    .email-footer a {
      color: #1e3a8a;
      text-decoration: none;
      margin: 0 5px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${subject}</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${firstName},</h2>
      <p>Thank you for signing up with Route Academy. To complete your registration, please use the following code to activate your account:</p>
      <span class="activation-code">${code}</span>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br>Sara7a Application Team</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2026 Route Academy. All rights reserved.</p>
      <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;