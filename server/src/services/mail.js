import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { db } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from both server dir and root dir
dotenv.config();
const rootEnvPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

/**
 * Get active mail configuration
 */
export async function getMailConfig() {
  const profile = await db.profile.get().catch(() => null);
  const fallbackEmail = profile?.email || 'dhamodharanr08@gmail.com';

  const smtpUser = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
  const smtpPass = rawPass.replace(/\s+/g, '').trim();
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const receiverEmail = (process.env.CONTACT_RECEIVER_EMAIL || smtpUser || fallbackEmail).trim();

  const isConfigured = Boolean(smtpUser && smtpPass);

  return {
    isConfigured,
    smtpUser,
    smtpPass,
    smtpHost,
    smtpPort,
    receiverEmail
  };
}

/**
 * Dispatch contact notification email directly to Dhamodharan's inbox
 */
export async function sendContactNotification({ name, email, subject, message }) {
  const config = await getMailConfig();

  // Construct mailto link for direct mail fallback
  const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject || 'Project Inquiry'} from ${name}`);
  const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n--\nSent via Dhamodharan's Portfolio`);
  const mailtoUrl = `mailto:${config.receiverEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  if (!config.isConfigured) {
    console.log(`[MAIL SERVICE] Notice: Message from "${name}" (${email}) recorded in database.`);
    console.log(`[MAIL SERVICE] To forward messages directly to ${config.receiverEmail}, configure SMTP_USER and SMTP_PASS in your .env file.`);
    return {
      sent: false,
      reason: 'smtp_not_configured',
      receiver: config.receiverEmail,
      mailtoUrl
    };
  }

  try {
    const isSecure = config.smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: isSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailSubject = `📬 Portfolio Contact: ${subject || 'New Inquiry'} from ${name}`;
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Message</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07090e; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #0e121b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 28px 24px; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
    .header p { margin: 4px 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.85); font-mono; }
    .body { padding: 28px 24px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); color: #818cf8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; }
    .meta-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; }
    .meta-row { display: flex; flex-direction: column; gap: 4px; }
    .meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600; }
    .meta-value { font-size: 14px; color: #f8fafc; font-weight: 500; }
    .meta-value a { color: #38bdf8; text-decoration: none; }
    .message-container { background: #141a26; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-top: 8px; }
    .message-text { font-size: 14px; line-height: 1.65; color: #e2e8f0; white-space: pre-wrap; margin: 0; }
    .action-row { margin-top: 26px; text-align: center; }
    .btn { display: inline-block; padding: 12px 28px; background: #6366f1; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 10px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); }
    .footer { padding: 18px 24px; background: #07090e; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 Incoming Portfolio Message</h1>
      <p>Direct communication dispatch from your live portfolio</p>
    </div>
    <div class="body">
      <span class="badge">Verified Form Dispatch</span>
      
      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">From (Name)</span>
          <span class="meta-value">${name}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Sender Email</span>
          <span class="meta-value"><a href="mailto:${email}">${email}</a></span>
        </div>
        ${subject ? `
        <div class="meta-row">
          <span class="meta-label">Subject</span>
          <span class="meta-value">${subject}</span>
        </div>` : ''}
        <div class="meta-row">
          <span class="meta-label">Received At</span>
          <span class="meta-value">${timestamp}</span>
        </div>
      </div>

      <div class="meta-row">
        <span class="meta-label">Message Payload</span>
        <div class="message-container">
          <p class="message-text">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      </div>

      <div class="action-row">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Portfolio Inquiry')}" class="btn">
          Reply Directly to ${name} (${email}) →
        </a>
      </div>
    </div>
    <div class="footer">
      Dhamodharan R Portfolio • Auto-forwarding Engine • Puducherry, India
    </div>
  </div>
</body>
</html>
`;

    const textContent = `
[NEW PORTFOLIO MESSAGE]
From: ${name} <${email}>
Subject: ${subject || 'New Inquiry'}
Date: ${timestamp}

Message:
${message}

Reply-To: ${email}
`;

    const info = await transporter.sendMail({
      from: `"${name} (Portfolio)" <${config.smtpUser}>`,
      to: config.receiverEmail,
      replyTo: `"${name}" <${email}>`,
      subject: emailSubject,
      text: textContent,
      html: htmlContent
    });

    console.log(`[MAIL SERVICE] Email sent successfully to ${config.receiverEmail}. MessageId: ${info.messageId}`);
    return {
      sent: true,
      messageId: info.messageId,
      receiver: config.receiverEmail,
      mailtoUrl
    };
  } catch (err) {
    console.error('[MAIL SERVICE] Failed to send email via SMTP:', err.message);
    return {
      sent: false,
      error: err.message,
      receiver: config.receiverEmail,
      mailtoUrl
    };
  }
}
