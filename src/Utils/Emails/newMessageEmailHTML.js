export const creativeMessageTemplateArabic = (messageSnippet) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Cairo', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0f4f8;
    }
    .email-container {
      max-width: 480px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-top: 6px solid #f59e0b;
    }
    .email-header {
      text-align: center;
      padding: 25px 15px;
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
      color: #fff;
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
      background-color: #fef3c7;
      border-left: 5px solid #f59e0b;
      border-radius: 8px;
      margin: 20px 0;
      font-style: italic;
      font-size: 16px;
    }
    .view-button {
      display: inline-block;
      text-align: center;
      padding: 14px 28px;
      background-color: #f59e0b;
      color: #fff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      border-radius: 8px;
      transition: all 0.2s ease-in-out;
    }
    .view-button:hover {
      background-color: #d97706;
      transform: translateY(-2px);
    }
    .email-footer {
      text-align: center;
      padding: 15px;
      background-color: #f0f4f8;
      font-size: 13px;
      color: #555;
    }
    .email-footer a {
      color: #f59e0b;
      text-decoration: none;
      margin: 0 5px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="emoji">📬✨</div>
      <h1>💌 يلا! جاتلك رسالة جديدة!</h1>
    </div>
    <div class="email-body">
      <p>أهه شوف مين جابلك المفاجأة 😎</p>
      <div class="message-snippet">
        ${messageSnippet}
      </div>
      <a href="${messageSnippet}" class="view-button">افتح رسائلي</a>
      <p style="margin-top:20px; font-size:14px; color:#777;">لو مش متوقع الرسالة دي، ممكن تتجاهلها بأمان.</p>
      <p style="margin-top:10px;">— فريق تطبيق صراحة</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2026 تطبيق صراحة. كل الحقوق محفوظة</p>
      <p><a href="[SupportLink]">تواصل مع الدعم</a> | <a href="[UnsubscribeLink]">إلغاء  الاشتراك</a></p>
    </div>
  </div>
</body>
</html>
`;