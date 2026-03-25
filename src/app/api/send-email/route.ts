import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email, role } = await request.json();

    // Format submitted date (e.g., "March 25, 2026")
    const submittedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send confirmation email to applicant using Resend template
    const { data, error } = await resend.emails.send({
      from: 'TORA <noreply@mail.torahub.io>',
      to: [email],
      subject: 'Application Received - TORA',
      // Reference Resend template by ID with variables
      template: {
        id: 'c9ccf7de-fa7f-4c7f-b4cc-be917eb87b47',
        variables: {
          firstName: firstName,
          email: email,
          submittedDate: submittedDate,
        },
      },
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
