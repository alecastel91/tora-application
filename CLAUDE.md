# TORA Landing Page Application - Project Documentation

## Overview
TORA Landing Page is a Next.js application for collecting pre-launch applications for the TORA platform. The application uses Supabase for database storage, Resend for email notifications, and supports multi-language translations. It's designed to collect applications from Artists, Agents, Promoters, and Venues interested in joining the TORA network.

## Recent Updates (April 1, 2026)

### Database Schema Migration - Name Fields Split  
- **Migration Complete**: Split \`full_name\` field into \`first_name\` and \`last_name\`
  - **Date**: March 31, 2026
  - **Migration File**: supabase-add-name-columns.sql
  - **Changes**:
    - Added \`first_name TEXT\` column to both \`waitlist\` and \`waitlist_test\`
    - Added \`last_name TEXT\` column to both \`waitlist\` and \`waitlist_test\`
    - Removed \`full_name\` column from both tables
  - **Code Updates**:
    - ApplicationForm.tsx: Updated to save separate name fields (lines 362-363, 412-413)
    - admin/page.tsx: Updated TypeScript interface and all references
  - **Status**: ✅ Deployed to production (Vercel)

### Environment Separation System
- **Test Environment**: Created separate \`waitlist_test\` table for development/testing
  - **Purpose**: Allows testing without affecting production data
  - **Implementation**: Dynamic table selection based on \`NEXT_PUBLIC_ENV_MODE\`
  - **Local Development**: Uses \`test\` mode by default
  - **Production (Vercel)**: Uses \`production\` mode

- **Environment Modes**:
  - \`production\`: Uses \`waitlist\` table (real production data)
  - \`test\`: Uses \`waitlist_test\` table (test/development data)

### Admin Dashboard Updates
- **Dynamic Table Selection**: Admin dashboard now respects \`NEXT_PUBLIC_ENV_MODE\`
  - Test mode: Shows data from \`waitlist_test\`
  - Production mode: Shows data from \`waitlist\`
- **Name Field Updates**: All 8 references to \`full_name\` updated to use \`first_name\` and \`last_name\`
  - Display name calculation: \`\${first_name} \${last_name}\`
  - Search functionality: Searches both first and last names
  - Email sending: Uses \`first_name\` for personalization

### Genres List Update
- **Removed**: "Acid"
- **Added**: "Pop" (in alphabetical order)
- **Total Genres**: 36 music genres supported

### Debugging Enhancements
- **Console Logging**: Added comprehensive logging to ApplicationForm.tsx
  - Logs environment mode, table name, and Supabase URL before insert
  - Logs success/failure with detailed error messages
  - Helps troubleshoot production deployment issues

## Key Features

### Multi-Step Application Form
1. **Step 1**: Contact Information (phone, role, name, email)
2. **Step 2**: Location & Music Profile (zone/country/city, genres)
3. **Step 3**: Professional Links (social media, website, etc.)

### Admin Dashboard
- Password-protected management interface
- View/filter/search applications
- Approve, decline, or send invitations
- Dynamic table selection based on environment mode

### Multi-Language Support
8 languages supported: English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese

### Email Integration
- Resend API for transactional emails
- Application confirmation emails
- Invitation emails with coupon codes

## Environment Configuration

### Local Development (.env.local)
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://kujkzoaobkpqnbtpskpo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
NEXT_PUBLIC_ENV_MODE=test
RESEND_API_KEY=[resend key]
\`\`\`

### Vercel Production
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://kujkzoaobkpqnbtpskpo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
NEXT_PUBLIC_ENV_MODE=production
RESEND_API_KEY=[resend key]
\`\`\`

### Switching Modes Locally
\`\`\`bash
# Switch to test mode
sed -i '' 's/NEXT_PUBLIC_ENV_MODE=production/NEXT_PUBLIC_ENV_MODE=test/' .env.local
rm -rf .next && npm run dev

# Switch to production mode
sed -i '' 's/NEXT_PUBLIC_ENV_MODE=test/NEXT_PUBLIC_ENV_MODE=production/' .env.local
rm -rf .next && npm run dev
\`\`\`

## Database Schema

### Tables
- **waitlist** - Production applications
- **waitlist_test** - Test/development applications

### Key Columns
\`\`\`
id, created_at, phone_number, role
first_name, last_name, profile_name, email
zone, country, city, genres
instagram, resident_advisor, soundcloud, website, linkedin
agency_name, venue_capacity
status, coupon_code, invited_at
\`\`\`

### RLS Policies
- Row Level Security: DISABLED (public insert access required)

## Supported Data

### Roles
Artist, Agent, Promoter, Venue

### Genres (36 total)
Afro House, Afrobeat, Amapiano, Ambient, Bass, Dancehall, Deep House, Disco, Downtempo, Drum & Bass, Dub Techno, Dubstep, EBM, Electro, Experimental, Funk/Soul, Garage, Hardcore, Hip Hop, House, IDM, Industrial, Italo Disco, Jazz, Jungle, Melodic Techno, Minimal, Noise, **Pop**, Progressive House, Psytrance, R&B, Reggaeton, Tech House, Techno, Trance

### Zones & Locations
- **Zones**: Africa, Americas, Asia, Europe, Oceania
- **Countries**: 40+ across all zones
- **Cities**: 200+ major cities worldwide

## Running the Application

\`\`\`bash
# Install
npm install

# Development
npm run dev

# Build
npm run build

# Access
http://localhost:3000 (local)
http://192.168.2.101:3000 (network)
\`\`\`

## Admin Access
- **URL**: /admin
- **Password**: tora2026admin
- **Features**: View, filter, approve, decline, send invitations

## Common Tasks

### Add a Genre
1. Edit \`src/components/sections/infrared/ApplicationForm.tsx\`
2. Find \`genresList\` array (line ~171)
3. Add in alphabetical order
4. Commit and push

### Change Admin Password
1. Edit \`src/app/admin/page.tsx\`
2. Find line 71: \`password === "tora2026admin"\`
3. Update password string
4. Commit and push

### Database Migrations
1. Write SQL migration file
2. Test on Supabase SQL Editor
3. Run on production Supabase
4. Update TypeScript code
5. Deploy via Git push

## Tech Stack
- Next.js 16.1.6 with Turbopack
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (PostgreSQL)
- Resend (Email)
- Vercel (Hosting)

## Status
✅ **Production Ready**
- All features working
- Database migrations complete
- Environment separation implemented
- Vercel deployment successful

---

**Last Updated**: April 1, 2026  
**Version**: 2.0.0  
**Repository**: https://github.com/alecastel91/tora-application
