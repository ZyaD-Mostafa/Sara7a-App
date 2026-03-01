export const creativeMessageTemplateArabic = (messageSnippet) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Cairo', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #eef2f7;
    }
    .email-container {
      max-width: 480px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-top: 6px solid #1e3a8a;
    }
    .email-header {
      text-align: center;
      padding: 25px 15px;
      background-color: #1e3a8a;
      color: #ffffff;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .email-body {
      padding: 20px;
      color: #333;
      line-height: 1.6;
      text-align: center;
    }
    .emoji {
      font-size: 40px;
    }
    .message-snippet {
      padding: 14px;
      background-color: #e0e7ff;
      border-left: 5px solid #1e3a8a;
      border-radius: 8px;
      margin: 20px 0;
      font-style: italic;
      font-size: 16px;
    }
    .view-button {
      display: inline-block;
      text-align: center;
      padding: 14px 28px;
      background-color: #1e3a8a;
      color: #fff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      border-radius: 8px;
    }
    .view-button:hover {
      background-color: #1e40af;
    }
    .email-footer {
      text-align: center;
      padding: 15px;
      background-color: #f4f6fb;
      font-size: 13px;
      color: #555;
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
      <h1>جاتلك رسالة جديدة</h1>
    </div>
    <div class="email-body">
      <p>شوف مين باعتلك مفاجأة 😉</p>
      <div class="message-snippet">
        ${messageSnippet}
      </div>
      <a href="${messageSnippet}" class="view-button">افتح رسائلي</a>
      <p style="margin-top:20px; font-size:14px; color:#777;">لو مش متوقع الرسالة دي، ممكن تتجاهلها بأمان.</p>
      <p style="margin-top:10px;">— فريق تطبيق صراحة</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2026 تطبيق صراحة. كل الحقوق محفوظة</p>
      <p><a href="[SupportLink]">تواصل مع الدعم</a> | <a href="[UnsubscribeLink]">إلغاء الاشتراك</a></p>
    </div>
  </div>
</body>
</html>
`;