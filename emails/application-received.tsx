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
  role?: string;
}

export const ApplicationReceivedEmail = ({
  firstName = 'there',
  role = 'Artist',
}: ApplicationReceivedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your application to TORA has been received</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          {/* TORA Logo */}
          <Img
            src="https://tora-application.vercel.app/tora_logo_v2.png"
            width="180"
            height="auto"
            alt="TORA"
            style={logo}
          />

          {/* Main Content */}
          <Heading style={heading}>Application Received</Heading>

          <Text style={paragraph}>
            Hi {firstName},
          </Text>

          <Text style={paragraph}>
            Thank you for applying to join <strong>TORA</strong> as a <strong>{role}</strong>.
          </Text>

          <Text style={paragraph}>
            We've successfully received your application and our team will review it carefully.
            Given the exclusive nature of our community, we take time to ensure every member
            aligns with TORA's vision for the club music industry.
          </Text>

          <Text style={paragraph}>
            <strong>What happens next:</strong>
          </Text>

          <Text style={listItem}>
            • Our team reviews your application within 5-7 business days
          </Text>
          <Text style={listItem}>
            • If approved, you'll receive an invitation code via email
          </Text>
          <Text style={listItem}>
            • Your invitation will include access details and next steps
          </Text>

          <Text style={paragraph}>
            We appreciate your patience during the review process. No further action is
            required from you at this time.
          </Text>

          <Text style={signature}>
            Best regards,<br />
            <strong>The TORA Team</strong>
          </Text>

          {/* Footer */}
          <Text style={footer}>
            © 2026 TORA. The Professional Network for Club Music Industry.<br />
            <Link href="https://tora-application.vercel.app/policy" style={footerLink}>
              Privacy Policy
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ApplicationReceivedEmail;

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const box = {
  padding: '40px',
  backgroundColor: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
};

const logo = {
  margin: '0 auto 24px',
  display: 'block',
};

const heading = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  textAlign: 'center' as const,
  margin: '30px 0',
  letterSpacing: '0.5px',
};

const paragraph = {
  color: '#cccccc',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const listItem = {
  color: '#cccccc',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
  paddingLeft: '12px',
};

const signature = {
  color: '#cccccc',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0 16px',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  marginTop: '40px',
  paddingTop: '24px',
  borderTop: '1px solid #2a2a2a',
};

const footerLink = {
  color: '#FF3366',
  textDecoration: 'none',
};
