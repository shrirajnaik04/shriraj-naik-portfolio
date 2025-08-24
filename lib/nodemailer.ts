import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export function createEmailTransporter() {
  // Get configuration from environment variables
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');
  const emailSecure = process.env.EMAIL_SECURE === 'true';
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailHost || !emailUser || !emailPass) {
    throw new Error('Email configuration is missing. Please check your environment variables.');
  }

  const config: EmailConfig = {
    host: emailHost,
    port: emailPort,
    secure: emailSecure, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  };

  return nodemailer.createTransport(config);
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: options.from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
