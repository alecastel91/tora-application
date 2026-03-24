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

## Recent Updates (March 25, 2026)

### Application Form Refinements (COMPLETE ✅)

#### Landing Page Tagline Update
- **Updated Branding**: Changed tagline from "THE PROFESSIONAL NETWORK FOR THE ELECTRONIC MUSIC INDUSTRY" to:
  ```
  THE PROFESSIONAL NETWORK
  FOR CLUB MUSIC INDUSTRY
  ```
- **Design Decision**: Removed second "THE" for cleaner, more modern branding
- **Line Break**: Second line starts with "FOR" for better visual balance
- **Files Modified**: [IntroSplash.tsx](src/components/sections/infrared/IntroSplash.tsx)

#### Phone Verification Removal
- **Simplified Flow**: Removed phone verification steps entirely (was Step 0 and verification code)
- **New Flow**: Application now starts directly at Role selection (Step 0)
- **Phone Number Field**: Moved to CONTACTS screen (Step 2) alongside email
  - Country code dropdown with all 150 international codes
  - Format: "+XX Country Name" (e.g., "+39 Italy", "+1 United States")
  - Number-only input validation (letters blocked)
- **Clean Codebase**: Deleted 139 lines of hidden phone verification UI code
- **Progress Bar**: Updated from 7 steps to 6 steps
- **Files Modified**:
  - [ApplicationForm.tsx](src/components/sections/infrared/ApplicationForm.tsx) - Removed phone verification, renumbered steps

#### Form Step Renumbering
- **Step 0**: Role Selection (previously Step 1)
  - Updated heading: "What's Your Role?" (was "SELECT ACTOR ROLE")
- **Step 1**: Identification (previously Step 2)
- **Step 2**: CONTACTS (previously Step 3 "Email")
  - Renamed from "Email" to "CONTACTS"
  - Added phone number field with country code dropdown
  - Email + Confirm Email + Phone Number
- **Step 3**: Location (previously Step 4)
- **Step 4**: Genres (previously Step 5)
- **Step 5**: Social Profiles (previously Step 6)

#### Country Code Dropdown Enhancement
- **Complete Coverage**: All 150 countries included (Afghanistan to Zimbabwe)
- **Format**: Each option shows "+[code] [Country Name]"
- **Examples**: +1 Canada, +44 United Kingdom, +81 Japan, +86 China, +971 UAE
- **Implementation**: Uses existing `countryCodes` array from ApplicationForm.tsx

#### Phone Number Input Validation
- **Number-Only Input**: Blocks all letters and special characters
- **Allowed Characters**: Only digits (0-9) and spaces
- **Real-Time Filtering**: Regex `/[^0-9\s]/g` removes invalid characters as user types
- **Type**: `type="tel"` for mobile keyboard optimization

#### Form Width Consistency Fix (COMPLETE ✅)
- **Issue**: Form elements (role buttons, inputs) were rendering at 280px wide locally vs 328px on Vercel
  - Same font sizes but narrower boxes suggested padding/margin constraints
  - DevTools investigation showed 0px padding on both versions but different widths
  - Multiple attempts with `max-w-md`, `max-w-xl`, `max-w-2xl`, `max-w-sm` all failed
- **Root Cause**: Tailwind CSS classes (`max-w-*`) were not producing consistent widths
  - Agent investigation confirmed Vercel uses `max-w-md` (448px)
  - Local `max-w-md` was rendering elements at only 280px instead of 328px
  - GlassPanel padding was identical on both (p-6 md:p-16)
- **Solution**: Fixed width override using inline styles
  - Changed all step containers from `className="w-full max-w-md mx-auto flex flex-col items-center"`
  - To: `className="mx-auto flex flex-col items-center" style={{ width: '328px' }}`
  - Forced exact 328px width to match Vercel pixel-perfect
- **Result**: All form elements now render at exactly 328 × 50px, matching Vercel deployment
- **Files Modified**: [ApplicationForm.tsx](src/components/sections/infrared/ApplicationForm.tsx) - Lines 571, 622, 681, 786, 873, 933
- **Technical Notes**:
  - Tailwind v4's `max-w-md` compiles to 28rem (448px) correctly
  - Issue was likely CSS cascade or flex container behavior
  - Inline style override ensures consistent rendering across deployments

#### Instagram Verification Notice
- **Updated Helper Text**: Added clear identification/authentication messaging
- **New Text**: "Your Instagram handle will be used for identity verification and authentication purposes. Please provide an account that best represents your professional profile."
- **Previous Text**: "Please use an Instagram account that is most representative of your online identity as it will be used for verification purposes."
- **Length**: Concise 2-line message (under 3-line max)
- **Professional Wording**: Uses proper legal terminology (identity verification, authentication)

#### Technical Improvements
- **State Cleanup**: Removed unused verification states (`verificationCode`, `codeSent`, `phoneVerified`)
- **Kept States**: Only `countryCode` and `phoneNumber` (required for CONTACTS screen)
- **Code Quality**: No hidden code, no dead code, clean and maintainable
- **Progress Tracking**: 6-step progress bar matches actual form steps

---

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
1. **Intro Splash** (2.5 seconds) → TORA logo animation with tagline "THE PROFESSIONAL NETWORK FOR CLUB MUSIC INDUSTRY"
2. **Application Form** (6 steps):
   - Step 0: Role selection (Artist, Promoter, Venue, Agent) - "What's Your Role?"
   - Step 1: Identification (first name, last name, profile name)
   - Step 2: CONTACTS (email + confirm email + phone number with country code)
   - Step 3: Location (zone → country → city)
   - Step 4: Genres (multi-select)
   - Step 5: Social profiles (Instagram with verification notice) + Privacy consent
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
