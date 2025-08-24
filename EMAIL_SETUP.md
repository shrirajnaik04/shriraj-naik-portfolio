# Email Configuration for Nodemailer

This project uses Nodemailer for sending contact form emails. Follow these steps to configure email functionality:

## Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

### For Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Set these variables**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM="Shriraj Naik - Portfolio <your-email@gmail.com>"
   RECIPIENT_EMAIL=nykshriraj4nov@gmail.com
   ```

### For Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM="Shriraj Naik - Portfolio <your-email@outlook.com>"
RECIPIENT_EMAIL=nykshriraj4nov@gmail.com
```

### For Yahoo

1. **Enable App Passwords** in Yahoo Account Security settings
2. **Set these variables**:
   ```env
   EMAIL_HOST=smtp.mail.yahoo.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@yahoo.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM="Shriraj Naik - Portfolio <your-email@yahoo.com>"
   RECIPIENT_EMAIL=nykshriraj4nov@gmail.com
   ```

### For Custom SMTP Providers

For services like Mailgun, SendGrid, etc.:

```env
EMAIL_HOST=your-smtp-host.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASS=your-smtp-password
EMAIL_FROM="Shriraj Naik - Portfolio <your-email@domain.com>"
RECIPIENT_EMAIL=nykshriraj4nov@gmail.com
```

## Security Notes

- **Never commit your `.env.local` file** to version control
- **Use App Passwords** instead of your main account password when possible
- **Keep your SMTP credentials secure** and rotate them regularly

## Email Template

The email template is defined in `lib/email-template.ts` and matches the exact design you provided. It includes:

- Responsive design for mobile and desktop
- Professional branding with your portfolio colors
- Contact form data display
- Direct reply functionality
- Modern HTML email formatting

## Testing

To test the email functionality:

1. Set up your environment variables
2. Start the development server: `pnpm dev`
3. Navigate to your contact form
4. Submit a test message
5. Check your configured recipient email

The system will send beautifully formatted HTML emails with all the contact form details.
