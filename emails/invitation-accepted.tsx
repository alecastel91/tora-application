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

interface InvitationAcceptedEmailProps {
  firstName?: string;
  invitationCode?: string;
  tierTitle?: string;
  tierBenefit?: string;
  tierDescription?: string;
  /** Where the "Create Your Account" CTA links to. Pass dev URL in dev, prod URL in prod. */
  appUrl?: string;
}

export const InvitationAcceptedEmail = ({
  firstName = 'there',
  invitationCode = '',
  tierTitle = 'Artist Membership',
  tierBenefit = 'Founding Member • Complimentary Premium Access',
  tierDescription = '',
  appUrl = 'https://app.torahub.io',
}: InvitationAcceptedEmailProps) => {
  // Strip the protocol for the visible "Go to ..." text in step 1, but keep it on the href.
  const appHostname = appUrl.replace(/^https?:\/\//, '');
  return (
  <Html>
    <Head>
      {/* Force dark theme on mobile clients that auto-invert (Gmail iOS,
          some Outlook builds). The meta tag alone is insufficient for some
          clients — the style block with prefers-color-scheme media queries
          + !important overrides the inversion algorithm. */}
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
      <style>{`
        :root {
          color-scheme: dark only;
          supported-color-schemes: dark;
        }
        body, table, td, div, .body-bg {
          background-color: #000000 !important;
          color: #FFFFFF !important;
        }
        @media (prefers-color-scheme: light) {
          body, table, td, div, .body-bg {
            background-color: #000000 !important;
            color: #FFFFFF !important;
          }
          h1, h2, h3, p, span, a:not(.cta-button) {
            color: #FFFFFF !important;
          }
        }
        @media (prefers-color-scheme: dark) {
          body, table, td, div, .body-bg {
            background-color: #000000 !important;
            color: #FFFFFF !important;
          }
        }
      `}</style>
    </Head>
    <Preview>Your TORA application has been accepted - welcome!</Preview>
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
        <Heading style={heading}>APPLICATION ACCEPTED!</Heading>

        {/* Body Text */}
        <Text style={paragraph}>
          Hi {firstName},
        </Text>

        <Text style={paragraph}>
          Congratulations! Your application has been approved. We're excited to invite you to join TORA - the exclusive network where the music industry connects.
        </Text>

        <Text style={paragraph}>
          As one of our founding members, you're joining TORA during its beta launch phase and will enjoy complimentary Premium access throughout this entire period.
        </Text>

        <Text style={{ ...paragraph, margin: '0 0 32px 0' }}>
          Your experience, feedback, and active participation will be crucial in shaping the platform as we grow together. We're continuously improving, and your contribution during this formative stage will help us build the most valuable network in the club music industry.
        </Text>

        {/* Membership Card */}
        <Section style={membershipCard}>
          <Text style={tierTitleStyle}>{tierTitle}</Text>
          <Text style={tierBenefitStyle}>{tierBenefit}</Text>
          <Text style={tierDescriptionStyle}>{tierDescription}</Text>
        </Section>

        {/* Invitation Code Section */}
        <Text style={invitationLabel}>
          Your Exclusive Invitation Code:
        </Text>
        <Text style={invitationCodeStyle}>
          {invitationCode}
        </Text>
        <Text style={invitationHint}>
          Use this code during signup to activate your membership
        </Text>

        {/* CTA Button */}
        <Section style={{ textAlign: 'center' as const, paddingBottom: '32px' }}>
          <Link
            href={appUrl}
            style={ctaButton}
          >
            Create Your Account
          </Link>
        </Section>

        {/* How to Join Card */}
        <Section style={card}>
          <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '700' as const, margin: '0 0 16px 0' }}>
            How to Join:
          </Text>

          <Text style={stepTitle}>1. Visit</Text>
          <Text style={stepText}>
            Go to <Link href={appUrl} style={link}>{appHostname}</Link>
          </Text>

          <Text style={stepTitle}>2. Enter Your Code</Text>
          <Text style={stepText}>
            Enter your exclusive invitation code during the signup process
          </Text>

          <Text style={stepTitle}>3. Complete Your Profile</Text>
          <Text style={{ ...stepText, margin: '0' }}>
            Set up your profile and start connecting with the music industry
          </Text>
        </Section>

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
};

export default InvitationAcceptedEmail;

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

const membershipCard = {
  border: '1px solid #FF3366',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 32px 0',
};

const tierTitleStyle = {
  color: '#FF3366',
  fontSize: '14px',
  fontWeight: '700' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 8px 0',
};

const tierBenefitStyle = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: '700' as const,
  lineHeight: '1.4',
  margin: '0 0 8px 0',
};

const tierDescriptionStyle = {
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0',
};

const invitationLabel = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '700' as const,
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '0 0 8px 0',
};

const invitationCodeStyle = {
  color: '#FF3366',
  fontSize: '28px',
  fontWeight: '700' as const,
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: '0.15em',
  textAlign: 'center' as const,
  margin: '0 0 8px 0',
};

const invitationHint = {
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '0 0 32px 0',
};

const ctaButton = {
  display: 'inline-block',
  padding: '16px 48px',
  backgroundColor: '#FF3366',
  borderRadius: '8px',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '700' as const,
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
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
