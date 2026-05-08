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

interface ApplicationReceivedEmailProps {
  firstName?: string;
  email?: string;
  submittedDate?: string;
}

export const ApplicationReceivedEmail = ({
  firstName = 'there',
  email = '',
  submittedDate = '',
}: ApplicationReceivedEmailProps) => (
  <Html>
    <Head>
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
      <style>{`
        :root { color-scheme: dark only; supported-color-schemes: dark; }
        body, table, td, div, .body-bg {
          background-color: #000000 !important;
          color: #FFFFFF !important;
        }
        @media (prefers-color-scheme: light) {
          body, table, td, div, .body-bg {
            background-color: #000000 !important;
            color: #FFFFFF !important;
          }
          h1, h2, h3, p, span, a:not(.cta-button) { color: #FFFFFF !important; }
        }
        @media (prefers-color-scheme: dark) {
          body, table, td, div, .body-bg {
            background-color: #000000 !important;
            color: #FFFFFF !important;
          }
        }
      `}</style>
    </Head>
    <Preview>Your application to TORA has been received</Preview>
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

        {/* Check Icon (transparent SVG so it renders correctly on
            both dark email body and Gmail-iOS-inverted white body) */}
        <Section style={{ textAlign: 'center' as const, paddingBottom: '32px' }}>
          <Img
            src="https://torahub.io/email-assets/check.svg"
            width="140"
            height="140"
            alt="Check"
            style={{ display: 'block', margin: '0 auto', width: '140px', height: '140px' }}
          />
        </Section>

        {/* Heading */}
        <Heading style={heading}>APPLICATION RECEIVED</Heading>

        {/* Body Text */}
        <Text style={paragraph}>
          Hi {firstName},
        </Text>

        <Text style={paragraph}>
          Thank you for your interest in joining TORA - the exclusive network where the music industry connects.
        </Text>

        <Text style={{ ...paragraph, margin: '0 0 24px 0' }}>
          We've successfully received your application and our team will review it carefully. Here's what happens next:
        </Text>

        {/* Steps Card */}
        <Section style={card}>
          <Text style={stepTitle}>1. Review Process</Text>
          <Text style={stepText}>
            Our team carefully evaluates each application to ensure quality and relevance to our community.
          </Text>

          <Text style={stepTitle}>2. Approval</Text>
          <Text style={stepText}>
            If approved, you'll receive a confirmation email with a unique invitation code to join TORA.
          </Text>

          <Text style={stepTitle}>3. Launch Access</Text>
          <Text style={{ ...stepText, margin: '0' }}>
            Use your code to create your account when TORA launches.
          </Text>
        </Section>

        {/* Application Details Card */}
        <Section style={card}>
          <Text style={detailsLabel}>YOUR APPLICATION DETAILS</Text>
          <Text style={detailsRow}>
            Email: <span style={{ color: '#FFFFFF' }}>{email}</span>
          </Text>
          <Text style={{ ...detailsRow, margin: '0' }}>
            Submitted: <span style={{ color: '#FFFFFF' }}>{submittedDate}</span>
          </Text>
        </Section>

        {/* Patience Text */}
        <Text style={paragraph}>
          We appreciate your patience during the review process. If you have any questions, feel free to reach out to us at{' '}
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

export default ApplicationReceivedEmail;

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

const detailsLabel = {
  color: '#FF3366',
  fontSize: '14px',
  fontWeight: '700' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 16px 0',
};

const detailsRow = {
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
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
