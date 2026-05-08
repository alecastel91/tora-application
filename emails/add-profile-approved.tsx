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

interface AddProfileApprovedEmailProps {
  firstName?: string;
  role?: string;
  profileName?: string;
}

export const AddProfileApprovedEmail = ({
  firstName = 'there',
  role = 'Artist',
  profileName = '',
}: AddProfileApprovedEmailProps) => (
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
    <Preview>Your new {role} profile is now active on TORA</Preview>
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

        {/* Globe/Geometric Art */}
        <Section style={{ textAlign: 'center' as const, paddingBottom: '32px' }}>
          <Img
            src="https://resend-attachments.s3.amazonaws.com/d266cb6a-5596-436a-8e2b-49c1c377840e"
            width="300"
            height="290"
            alt="TORA Globe"
            style={{ display: 'block', margin: '0 auto', width: '300px', height: '290px' }}
          />
        </Section>

        {/* Heading */}
        <Heading style={heading}>PROFILE APPROVED!</Heading>

        {/* Body Text */}
        <Text style={paragraph}>
          Hi {firstName},
        </Text>

        <Text style={paragraph}>
          Great news! Your new {role} profile ({profileName}) has been approved and is now active on TORA.
        </Text>

        <Text style={{ ...paragraph, margin: '0 0 32px 0' }}>
          You can switch to your new profile right away from your profile switcher in the app. No additional sign-up or code is needed.
        </Text>

        {/* Instruction Card */}
        <Section style={card}>
          <Text style={{ color: '#FFFFFF', fontSize: '15px', lineHeight: '1.6', margin: '0' }}>
            Open TORA and tap on your profile icon to switch to your new {role} profile.
          </Text>
        </Section>

        {/* Welcome Text */}
        <Text style={paragraph}>
          Welcome to your expanded TORA experience!
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

export default AddProfileApprovedEmail;

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
