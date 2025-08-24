// Test utility to verify email configuration
// Run this in your API route or as a standalone test

import { sendEmail } from '@/lib/nodemailer'
import { generateEmailTemplate } from '@/lib/email-template'

export async function testEmailConfiguration() {
  const testParams = {
    FNAME: 'Test User',
    EMAIL: 'test@example.com',
    SUBJECT: 'Test Email Configuration',
    MESSAGE: 'This is a test message to verify that the Nodemailer configuration is working correctly.'
  }

  const htmlContent = generateEmailTemplate(testParams)

  try {
    const result = await sendEmail({
      to: process.env.RECIPIENT_EMAIL || 'nykshriraj4nov@gmail.com',
      subject: 'Portfolio Contact Test: Email Configuration',
      html: htmlContent,
      replyTo: 'test@example.com'
    })

    console.log('✅ Email test successful:', result)
    return { success: true, result }
  } catch (error) {
    console.error('❌ Email test failed:', error)
    return { success: false, error }
  }
}

// Uncomment the line below to run the test
// testEmailConfiguration()
