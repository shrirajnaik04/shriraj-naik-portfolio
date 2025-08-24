import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/nodemailer'
import { generateEmailTemplate } from '@/lib/email-template'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get email configuration from environment variables
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'nykshriraj4nov@gmail.com'
    
    // Generate HTML email template
    const htmlContent = generateEmailTemplate({
      FNAME: name,
      EMAIL: email,
      SUBJECT: subject,
      MESSAGE: message
    })

    // Send email using Nodemailer
    const emailResult = await sendEmail({
      to: recipientEmail,
      subject: `New Enquiry from Shriraj Naik's Website`,
      html: htmlContent,
      replyTo: email,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER
    })

    console.log('Email sent successfully:', emailResult)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully!',
        messageId: emailResult.messageId 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    // Handle specific nodemailer errors
    if (error instanceof Error) {
      if (error.message.includes('Email configuration is missing')) {
        return NextResponse.json(
          { error: 'Email service configuration is missing' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
