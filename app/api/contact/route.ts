import { NextRequest, NextResponse } from 'next/server'

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

    // Get Brevo configuration from environment variables
    const brevoApiKey = process.env.BREVO_API_KEY
    const brevoEndpoint = process.env.BREVO_EMAIL_ENDPOINT || 'https://api.brevo.com/v3/smtp/email'
    const templateId = 2 // Your Brevo template ID

    if (!brevoApiKey) {
      return NextResponse.json(
        { error: 'Email service configuration is missing' },
        { status: 500 }
      )
    }

    // Prepare email data for Brevo API using template
    const emailData = {
      sender: {
        name: "Shriraj Naik - Portfolio",
        email: "shriraj.naik04@gmail.com"
      },
      to: [
        {
          email: "nykshriraj4nov@gmail.com",
          name: "Shriraj Naik"
        }
      ],
      replyTo: {
        email: email,
        name: name
      },
      templateId: templateId,
      params: {
        SUBJECT: subject,
        MESSAGE: message,
        FNAME: name,
        EMAIL: email
      }
    }

    // Send email using Brevo API
    const response = await fetch(brevoEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(emailData),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Brevo API error:', responseData)
      return NextResponse.json(
        { error: 'Failed to send email', details: responseData },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', responseData)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully!',
        messageId: responseData.messageId 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
