import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface AddProfileReceivedEmailProps {
  firstName?: string;
  role?: string;
  profileName?: string;
}

export const AddProfileReceivedEmail = ({
  firstName = 'there',
  role = 'Artist',
  profileName = '',
}: AddProfileReceivedEmailProps) => (
  <Html>
    <Head>
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
    </Head>
    <Preview>Your new profile application has been received</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo */}
        <Section style={{ textAlign: 'center' as const, paddingBottom: '40px' }}>
          <Img
            src="https://resend-attachments.s3.amazonaws.com/65ee3b03-1772-4168-9ce0-5625c3b15dca"
            width="255"
            height="78"
            alt="TORA"
            style={{ display: 'block', margin: '0 auto', width: '255px', height: '78px' }}
          />
        </Section>

        {/* Check Icon */}
        <Section style={{ textAlign: 'center' as const, paddingBottom: '32px' }}>
          <Img
            src="https://resend-attachments.s3.amazonaws.com/64377867-89f3-4cd1-b14a-fe57f9636d55"
            width="140"
            height="140"
            alt="Check"
            style={{ display: 'block', margin: '0 auto', width: '140px', height: '140px' }}
          />
        </Section>

        {/* Heading */}
        <Heading style={heading}>NEW PROFILE APPLICATION</Heading>

        {/* Body Text */}
        <Text style={paragraph}>
          Hi {firstName},
        </Text>

        <Text style={paragraph}>
          We've received your application for a new {role} profile ({profileName}) on TORA.
        </Text>

        <Text style={{ ...paragraph, margin: '0 0 24px 0' }}>
          Our team will review your request and get back to you shortly. Here's what happens next:
        </Text>

        {/* Steps Card */}
        <Section style={card}>
          <Text style={stepTitle}>1. Review</Text>
          <Text style={stepText}>
            Our team reviews your new profile application
          </Text>

          <Text style={stepTitle}>2. Approval</Text>
          <Text style={stepText}>
            If approved, the new profile will appear automatically in your account
          </Text>

          <Text style={stepTitle}>3. Confirmation</Text>
          <Text style={{ ...stepText, margin: '0' }}>
            You'll receive a confirmation email when it's ready
          </Text>
        </Section>

        {/* No Action Required */}
        <Text style={paragraph}>
          No further action is required from you at this time.
        </Text>

        {/* Support Text */}
        <Text style={paragraph}>
          If you have any questions, feel free to reach out to us at{' '}
          <Link href="mailto:support@torahub.io" style={link}>support@torahub.io</Link>
        </Text>

        {/* Signature */}
        <Text style={{ ...paragraph, margin: '0 0 8px 0' }}>
          Best regards,
        </Text>
        <Text style={{ ...paragraph, fontWeight: '700' as const, margin: '0 0 40px 0' }}>
          The TORA Team
        </Text>

        {/* Divider */}
        <Section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '32px' }} />

        {/* Instagram */}
        <Section style={{ textAlign: 'center' as const, paddingBottom: '24px' }}>
          <Link href="https://instagram.com/tora.hub" style={{ textDecoration: 'none' }}>
            <Img
              src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
              width="24"
              height="24"
              alt="Instagram"
              style={{ display: 'block', margin: '0 auto', width: '24px', height: '24px' }}
            />
          </Link>
        </Section>

        {/* Footer */}
        <Text style={footer}>&copy; 2026 TORA. All rights reserved.</Text>
        <Text style={tagline}>WHERE MUSIC MEETS</Text>
      </Container>
    </Body>
  </Html>
);

export default AddProfileReceivedEmail;

const main = {
  backgroundColor: '#000000',
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const paragraph = {
  color: '#FFFFFF',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const heading = {
  color: '#FFFFFF',
  fontSize: '28px',
  fontWeight: '700' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  textAlign: 'center' as const,
  margin: '0 0 32px 0',
};

const card = {
  backgroundColor: 'rgba(30, 30, 30, 0.6)',
  borderRadius: '8px',
  padding: '24px',
  margin: '0 0 32px 0',
};

const stepTitle = {
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '700' as const,
  lineHeight: '1.5',
  margin: '0 0 4px 0',
};

const stepText = {
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 20px 0',
};

const link = {
  color: '#FF3366',
  textDecoration: 'none',
};

const footer = {
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0 0 8px 0',
};

const tagline = {
  color: 'rgba(255, 255, 255, 0.3)',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  textAlign: 'center' as const,
  margin: '0',
};
