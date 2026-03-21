# TORA Landing Page - Project Documentation

## Overview
TORA is a pre-launch landing page for an exclusive membership platform in the electronic music industry. The landing page collects applications from professionals (Artists, Venues, Promoters, Agents) and stores them for admin review.

## Tech Stack
- **Frontend:** Next.js 16.1.6, TypeScript, Tailwind CSS v4, Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Email Service:** Resend (in progress)
- **Hosting:** Vercel
- **Domain:** torahub.io (Namecheap)

## Project Structure
```
tora-application/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main landing page flow
│   │   ├── admin/
│   │   │   └── page.tsx             # Admin dashboard for reviewing applications
│   │   └── policy/page.tsx          # Privacy policy page
│   ├── components/
│   │   ├── sections/infrared/
│   │   │   ├── IntroSplash.tsx      # Opening splash screen with TORA logo
│   │   │   ├── ApplicationForm.tsx   # Multi-step application form
│   │   │   └── Confirmation.tsx     # Success confirmation screen
│   │   └── ui/
│   │       ├── GlassPanel.tsx       # Glass morphism panel component
│   │       ├── InfraredInput.tsx    # Styled input fields
│   │       ├── InfraredButton.tsx   # Styled buttons
│   │       └── ThreeDBackground.tsx # 3D background effect
├── public/
│   └── tora_logo_v2.png            # TORA logo (cropped)
├── .env.local                       # Environment variables (Supabase credentials)
└── package.json
```

## Recent Updates (March 21, 2026)

### Admin Dashboard Implementation (COMPLETE ✅)
- **Password-Protected Dashboard**: Access at `/admin` with password `tora2026admin`
- **Application Management**:
  - View all applications with detailed information
  - Filter by status (All, Pending, Approved, Invited, Signed Up, Declined)
  - Search by name, email, role, city
  - Stats cards showing application counts
  - One-click APPROVE/DECLINE functionality
- **Visual Improvements**:
  - TORA logo branding in header
  - Profile names (e.g., "AL JONES") displayed prominently with Rajdhani font
  - Color-coded role badges matching TORA app colors:
    - Artist: #6B5FFF (purple)
    - Venue: #FF5757 (red)
    - Promoter: #00D4FF (cyan)
    - Agent: #FFB800 (yellow)
  - Clean SVG icons for contact info (email, phone, Instagram, SoundCloud, RA)
  - Clickable social media links (Instagram, SoundCloud, Resident Advisor)
  - Legal name shown below profile name
- **Files Modified**:
  - [src/app/admin/page.tsx](src/app/admin/page.tsx) - Complete admin dashboard

### Application Form Improvements
- **Field Updates**:
  - Instagram: Username field with verification helper text
  - Resident Advisor: "Artist name (optional)" with helper text
  - SoundCloud: "Login username (optional)" with helper text
- **Helper Text Styling**:
  - Left-aligned, 12px font size
  - Close spacing to input boxes (negative margin)
  - Consistent formatting across all fields
- **Privacy Consent**: Reduced spacing between form and terms checkbox
- **Files Modified**:
  - [src/components/sections/infrared/ApplicationForm.tsx](src/components/sections/infrared/ApplicationForm.tsx)

### Supabase Configuration
- **Environment Variables**:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://kujkzoaobkpqnbtpskpo.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Database Schema** (waitlist table):
  - Basic info: phone_number, role, full_name, profile_name, email
  - Location: zone, country, city
  - Genres: genres (comma-separated string)
  - Social: instagram, resident_advisor, soundcloud, agency_name, website, linkedin
  - Status tracking: status, coupon_code, invited_at
  - Timestamps: created_at

### Email Service Setup (IN PROGRESS ⏳)
- **Resend Package**: Installed (version latest)
- **Domain**: admin@torahub.io (Namecheap Private Email)
- **Status**: Waiting for Namecheap maintenance to complete DNS configuration
- **Next Steps**:
  1. Configure Namecheap DNS for email
  2. Sign up for Resend with admin@torahub.io
  3. Get Resend API key
  4. Create email templates (confirmation, invitation)
  5. Integrate with application flow

## Planned Features (Pre-Launch Checklist)

### Phase 1: Email Automation (Next Up)
- [ ] Configure Namecheap DNS for admin@torahub.io
- [ ] Sign up for Resend email service
- [ ] Create application confirmation email template
- [ ] Create invitation email template with coupon code
- [ ] Integrate confirmation email on form submission
- [ ] Build approval flow: APPROVE → generate code → send email

### Phase 2: Invitation Code System
- [ ] Generate unique invitation codes (format: TORA-XXXX)
- [ ] Store codes in Supabase with metadata
- [ ] Assign coupon tiers based on approval order:
  - FOUNDING: First 100 members (3 months free)
  - LAUNCH: Next 400 members (1 month free)
  - STANDARD: Later members (7-day trial)
- [ ] Display codes in admin dashboard

### Phase 3: Phone Verification (Optional)
- [ ] Integrate Twilio for SMS verification
- [ ] Replace simulated code sending with real SMS
- [ ] Verify codes against Twilio

### Phase 4: TORA App Integration (Future)
- [ ] Add invitation code field to TORA app signup
- [ ] Validate codes against Supabase
- [ ] Mark codes as USED when account created
- [ ] Apply coupon benefits to new accounts

## Email Strategy

### Email Addresses (torahub.io)
- **admin@torahub.io**: Main admin inbox (Namecheap Private Email, $0.99/month)
- **noreply@torahub.io**: Application confirmations (Resend send-only)
- **invitations@torahub.io**: Invitation emails with codes (Resend send-only)
- **alessandro@torahub.io**: Forwarded to admin@ (FREE alias)
- **hello@torahub.io**: Forwarded to admin@ (FREE alias)

### Planned Email Templates
1. **Application Confirmation** (Auto-sent on submit)
   - Subject: "Application Received - TORA"
   - From: noreply@torahub.io
   - Content: Thank you, what happens next, check spam folder

2. **Invitation Email** (Sent when admin approves)
   - Subject: "Welcome to TORA - Your Invitation Code Inside"
   - From: invitations@torahub.io
   - Content: Approval message, unique code, signup instructions, expiry date

3. **Decline Email** (Optional, polite rejection)
   - Subject: "TORA Application Update"
   - From: noreply@torahub.io
   - Content: Polite decline, encouragement to reapply later

## Application Flow

### User Journey
1. **Intro Splash** (2.5 seconds) → TORA logo animation
2. **Application Form** (7 steps):
   - Step 0: Phone verification (simulated)
   - Step 1: Role selection (Artist, Promoter, Venue, Agent)
   - Step 2: Identification (first name, last name, profile name)
   - Step 3: Email (with confirmation)
   - Step 4: Location (zone → country → city)
   - Step 5: Genres (multi-select)
   - Step 6: Social profiles + Privacy consent
3. **Confirmation Screen** → Success message with next steps
4. **Email Confirmation** → Auto-sent to applicant (pending implementation)

### Admin Journey
1. **Login** → Password-protected dashboard
2. **Review Applications** → Filter, search, view details
3. **Approve/Decline** → One-click actions
4. **Send Invitation** → Generate code + email (pending implementation)

## Design Specifications

### Colors
- **Primary:** #FF3366 (infrared pink)
- **Background:** #000000 (pure black)
- **Cards:** #1a1a1a (dark grey)
- **Text:** White with opacity variations
- **Role Colors**:
  - Artist: #6B5FFF
  - Venue: #FF5757
  - Promoter: #00D4FF
  - Agent: #FFB800

### Typography
- **Primary Font:** Space Grotesk (headings)
- **Secondary Font:** Rajdhani (UI text, profile names)
- **Monospace:** For technical/code elements

### Animations
- **Framer Motion**: Smooth page transitions, form step animations
- **3D Background**: Subtle particle effects
- **Glass Morphism**: Translucent panels with backdrop blur

## Deployment

### Production URL
- **Landing Page:** https://tora-application.vercel.app
- **Admin Dashboard:** https://tora-application.vercel.app/admin

### Git Repository
- **URL:** https://github.com/alecastel91/tora-application
- **Branch:** main
- **Auto-Deploy:** Vercel watches main branch for changes

### Environment Variables (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY` (to be added)

## Development

### Local Setup
```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### Admin Dashboard Access
- **URL:** http://localhost:3000/admin
- **Password:** tora2026admin

## Known Issues
- [ ] Phone verification is simulated (accepts any 6-digit code)
- [ ] Email service not yet integrated
- [ ] Invitation codes not yet generated
- [ ] No email tracking/analytics

## Next Session TODO
1. Complete Namecheap DNS configuration for admin@torahub.io
2. Sign up for Resend and get API key
3. Create email templates
4. Integrate confirmation email on form submission
5. Build invitation email system for admin approval flow

## Contact
- **Domain:** torahub.io (Namecheap)
- **Admin Email:** admin@torahub.io (in setup)
- **Developer Email:** alessandro@torahub.io (to be forwarded)
