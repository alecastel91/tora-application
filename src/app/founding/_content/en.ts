import type { FoundingContent } from "./types";

export const en: FoundingContent = {
  hero: {
    eyebrow: "Founding Members · Applications open",
    title: "The club music industry, finally in one place",
    subline: "Artists, Agents, Promoters and Venues, connected in one professional network.",
    ctaPrimary: "Become a Founding Member",
    ctaSecondary: "See how it works",
    footer: "Where music meets",
  },
  problem: {
    eyebrow: "The Problem",
    heading: "The club music industry runs on outdated processes and tools",
    items: [
      {
        title: "No central directory",
        body: "Artists, Agents, Promoters and Venues have no shared platform. Most booking requests still start with cold DMs and unanswered emails.",
      },
      {
        title: "International bookings are inaccessible",
        body: "Bringing Artists across markets is expensive, risky and poorly coordinated. Building a sustainable tour without an established network is nearly impossible.",
      },
      {
        title: "The market is gatekept",
        body: "Opportunities sit with a few players. Emerging Artists, independent Promoters and new Venues have no structured way to get discovered and build credibility.",
      },
      {
        title: "No path from search to signed deal",
        body: "No single tool handles the full booking process — discovery, proposal, negotiation, contract, documents and payment.",
      },
    ],
  },
  solution: {
    eyebrow: "The Solution",
    headingLead: "One platform,",
    headingAccent: "every booking",
    body: "TORA connects the four pillars of the club music industry — Artists, Agents, Promoters and Venues — in a single professional network. From first contact to final payment confirmation, everything happens in one seamless platform.",
    chooseRole: "Choose your role",
    tapToExplore: "Tap to explore",
    allRoles: "All roles",
  },
  roles: [
    { body: "DJs, live acts and producers looking for global bookings and professional representation." },
    { body: "Talent agencies managing Artist rosters, tours, deals and international opportunities." },
    { body: "Event organisers who book talent, build lineups and manage Venue partnerships globally." },
    { body: "Clubs and event spaces that want to attract the right Artists and fill their calendar." },
  ],
  deepdives: [
    {
      headline: ["Get discovered.", "Book globally."],
      body: "A verified profile that represents you professionally — genres, socials, availability, press kit. Visible to Promoters and Venues worldwide, not just in your city.",
      points: [
        "Global search & discovery",
        "Calendar & availability sharing",
        "Direct booking proposals",
        "Contract & payment tracking",
        "Agent connection & management",
      ],
    },
    {
      headline: ["Manage your roster.", "Close deals."],
      body: "One dashboard for your entire Artist roster. Track every deal, calendar, contract and payment across all your Artists — without losing your mind.",
      points: [
        "Multi-Artist roster management",
        "Deal & negotiation tracking",
        "Tier pricing: Solo to Unlimited",
        "Per-Artist financial overview",
        "Book gigs directly on their behalf",
      ],
    },
    {
      headline: ["Find the right act.", "Build the right lineup."],
      body: "Search Artists by genre, location and availability. Find Venues to host your events. Send booking proposals directly — no intermediary required, unless you want one.",
      points: [
        "Genre + location + availability filters",
        "Direct proposals to Artists or Agents",
        "Tour Kickstart: share booking costs",
        "Calendar-based matching",
        "Contract & payment confirmation in-platform",
      ],
    },
    {
      headline: ["Get seen.", "Fill your calendar."],
      body: "Your Venue profile is visible to Artists and Agents planning tours. Set your dates, capacity and genres — TORA surfaces you to the right people at the right time.",
      points: [
        "Venue profile with capacity & specs",
        "Date availability calendar",
        "Advance notice for touring Artists",
        "Inbound booking proposals",
        "Tour Kickstart: co-host touring acts",
      ],
    },
  ],
  journey: {
    eyebrow: "How it works",
    heading: "From first contact to payment",
    steps: [
      { title: "Discover", body: "Search the network, match calendars, find the right act — anywhere." },
      { title: "Connect", body: "Message directly and open the conversation." },
      { title: "Offer & negotiate", body: "Propose dates and fee, then negotiate to yes." },
      { title: "Sign the contract", body: "Generate and e-sign digitally — no PDFs by email." },
      { title: "Confirmed", body: "Contract signed, payment confirmed. Deal done." },
    ],
  },
  touring: {
    eyebrow: "Built for touring",
    heading: "Make the world your circuit",
    body: "Plan routes, get seen by the right markets and share the cost of bringing international acts across borders.",
    tiles: [
      { title: "Travel schedule & alerts", body: "Publish where you'll be; the right people get notified in advance when a relevant Artist is coming to their area." },
      { title: "Tour Kickstart", body: "Co-host a touring Artist across Venues and split the costs." },
    ],
  },
  why: {
    eyebrow: "Why TORA",
    headingLead: "A more connected, more open",
    headingAccent: "music industry",
    body: "Not only global reach — TORA strengthens local scenes too: discover emerging talent nearby, support your city, and open touring to anyone with the talent for it. Opportunity earned, not gatekept.",
  },
  cta: {
    eyebrow: "Join TORA",
    headingLine1: "Become a",
    headingLine2: "Founding Member",
    body: "The first to join TORA — full access from launch, a direct line to the team, and founding-member status as the network grows.",
    cards: [
      { title: "Full access", body: "Every feature from day one — calendar, bookings, messaging, contracts." },
      { title: "Shape the product", body: "A direct line to the team. Your feedback influences what gets built next." },
    ],
    pricingNote: "Joining TORA is free, and every application is reviewed to keep the quality of the network high. A Premium tier unlocks the most advanced features — and Founding Members (everyone who applies before launch) get all of it free for their first three months on the platform, with no obligation to continue.",
    button: "Apply now",
    foot: "torahub.io · expected launch October 2026",
  },
  drawer: {
    role: "Role",
    feature: "Feature",
    join: "Join TORA",
    scroll: "Scroll",
    items: {
      discover: {
        label: "Discover",
        title: "Search & discovery",
        body: "Explore the whole network on a live globe. Filter by role, genre, location and availability and find the right professional in seconds — wherever they are.",
      },
      connect: {
        label: "Connect",
        title: "Connect & message",
        body: "Send a connection request, then talk directly. Negotiate dates and fees, share documents and keep the whole conversation in one thread.",
      },
      offer: {
        label: "Offer & negotiate",
        title: "Make an offer. Agree the terms.",
        body: "Submit a booking offer with dates, fee and terms, then counter and refine until both sides agree — every step tracked, right up to a signed deal.",
      },
      contract: {
        label: "Contract",
        title: "Sign the contract",
        body: "Generate, send and sign booking contracts digitally — a real e-signature, right inside the platform. No emailing PDFs back and forth.",
      },
      confirmed: {
        label: "Confirmed",
        title: "Booking confirmed.",
        body: "Contract signed, payment confirmed — the deal is done. Offer, contract, documents and payment status all live in one place, from first contact to completion.",
      },
      travel: {
        label: "Travel & alerts",
        title: "Travel schedule & smart alerts",
        body: "Publish where you'll be and when. TORA surfaces you to the right market and notifies Venues and Promoters in advance when a relevant Artist is coming to their city.",
      },
      tour: {
        label: "Tour",
        title: "Tour Kickstart",
        body: "Promoters and Venues co-host the same touring Artist — splitting travel costs and sharing risk, making previously impossible bookings viable.",
      },
    },
  },
  chapters: {
    intro: "Intro",
    pitch: "The pitch",
    how: "How it works",
    touring: "Touring",
    why: "Why TORA",
    join: "Join",
  },
  ui: { language: "Language" },
};
