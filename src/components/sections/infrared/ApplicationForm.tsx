"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredInput } from "@/components/ui/InfraredInput";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { TORALoader } from "@/components/ui/TORALoader";
import { CitySearch } from "@/components/ui/CitySearch";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";

// Create a dummy Supabase client with placeholder values for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Country codes (alphabetical by country name)
const countryCodes = [
    { code: "+93", country: "AF", name: "Afghanistan" },
    { code: "+355", country: "AL", name: "Albania" },
    { code: "+213", country: "DZ", name: "Algeria" },
    { code: "+376", country: "AD", name: "Andorra" },
    { code: "+244", country: "AO", name: "Angola" },
    { code: "+54", country: "AR", name: "Argentina" },
    { code: "+374", country: "AM", name: "Armenia" },
    { code: "+61", country: "AU", name: "Australia" },
    { code: "+43", country: "AT", name: "Austria" },
    { code: "+994", country: "AZ", name: "Azerbaijan" },
    { code: "+973", country: "BH", name: "Bahrain" },
    { code: "+880", country: "BD", name: "Bangladesh" },
    { code: "+375", country: "BY", name: "Belarus" },
    { code: "+32", country: "BE", name: "Belgium" },
    { code: "+501", country: "BZ", name: "Belize" },
    { code: "+229", country: "BJ", name: "Benin" },
    { code: "+975", country: "BT", name: "Bhutan" },
    { code: "+591", country: "BO", name: "Bolivia" },
    { code: "+387", country: "BA", name: "Bosnia and Herzegovina" },
    { code: "+267", country: "BW", name: "Botswana" },
    { code: "+55", country: "BR", name: "Brazil" },
    { code: "+673", country: "BN", name: "Brunei" },
    { code: "+359", country: "BG", name: "Bulgaria" },
    { code: "+226", country: "BF", name: "Burkina Faso" },
    { code: "+257", country: "BI", name: "Burundi" },
    { code: "+855", country: "KH", name: "Cambodia" },
    { code: "+237", country: "CM", name: "Cameroon" },
    { code: "+1", country: "CA", name: "Canada" },
    { code: "+56", country: "CL", name: "Chile" },
    { code: "+86", country: "CN", name: "China" },
    { code: "+57", country: "CO", name: "Colombia" },
    { code: "+242", country: "CG", name: "Congo" },
    { code: "+506", country: "CR", name: "Costa Rica" },
    { code: "+385", country: "HR", name: "Croatia" },
    { code: "+53", country: "CU", name: "Cuba" },
    { code: "+357", country: "CY", name: "Cyprus" },
    { code: "+420", country: "CZ", name: "Czech Republic" },
    { code: "+243", country: "CD", name: "Democratic Republic of the Congo" },
    { code: "+45", country: "DK", name: "Denmark" },
    { code: "+253", country: "DJ", name: "Djibouti" },
    { code: "+593", country: "EC", name: "Ecuador" },
    { code: "+20", country: "EG", name: "Egypt" },
    { code: "+503", country: "SV", name: "El Salvador" },
    { code: "+372", country: "EE", name: "Estonia" },
    { code: "+251", country: "ET", name: "Ethiopia" },
    { code: "+358", country: "FI", name: "Finland" },
    { code: "+33", country: "FR", name: "France" },
    { code: "+995", country: "GE", name: "Georgia" },
    { code: "+49", country: "DE", name: "Germany" },
    { code: "+233", country: "GH", name: "Ghana" },
    { code: "+30", country: "GR", name: "Greece" },
    { code: "+502", country: "GT", name: "Guatemala" },
    { code: "+224", country: "GN", name: "Guinea" },
    { code: "+509", country: "HT", name: "Haiti" },
    { code: "+504", country: "HN", name: "Honduras" },
    { code: "+852", country: "HK", name: "Hong Kong" },
    { code: "+36", country: "HU", name: "Hungary" },
    { code: "+354", country: "IS", name: "Iceland" },
    { code: "+91", country: "IN", name: "India" },
    { code: "+62", country: "ID", name: "Indonesia" },
    { code: "+98", country: "IR", name: "Iran" },
    { code: "+964", country: "IQ", name: "Iraq" },
    { code: "+353", country: "IE", name: "Ireland" },
    { code: "+972", country: "IL", name: "Israel" },
    { code: "+39", country: "IT", name: "Italy" },
    { code: "+225", country: "CI", name: "Ivory Coast" },
    { code: "+1876", country: "JM", name: "Jamaica" },
    { code: "+81", country: "JP", name: "Japan" },
    { code: "+962", country: "JO", name: "Jordan" },
    { code: "+7", country: "KZ", name: "Kazakhstan" },
    { code: "+254", country: "KE", name: "Kenya" },
    { code: "+965", country: "KW", name: "Kuwait" },
    { code: "+996", country: "KG", name: "Kyrgyzstan" },
    { code: "+856", country: "LA", name: "Laos" },
    { code: "+371", country: "LV", name: "Latvia" },
    { code: "+961", country: "LB", name: "Lebanon" },
    { code: "+218", country: "LY", name: "Libya" },
    { code: "+370", country: "LT", name: "Lithuania" },
    { code: "+352", country: "LU", name: "Luxembourg" },
    { code: "+853", country: "MO", name: "Macao" },
    { code: "+389", country: "MK", name: "North Macedonia" },
    { code: "+60", country: "MY", name: "Malaysia" },
    { code: "+223", country: "ML", name: "Mali" },
    { code: "+356", country: "MT", name: "Malta" },
    { code: "+52", country: "MX", name: "Mexico" },
    { code: "+373", country: "MD", name: "Moldova" },
    { code: "+976", country: "MN", name: "Mongolia" },
    { code: "+382", country: "ME", name: "Montenegro" },
    { code: "+212", country: "MA", name: "Morocco" },
    { code: "+258", country: "MZ", name: "Mozambique" },
    { code: "+95", country: "MM", name: "Myanmar" },
    { code: "+264", country: "NA", name: "Namibia" },
    { code: "+977", country: "NP", name: "Nepal" },
    { code: "+31", country: "NL", name: "Netherlands" },
    { code: "+64", country: "NZ", name: "New Zealand" },
    { code: "+505", country: "NI", name: "Nicaragua" },
    { code: "+227", country: "NE", name: "Niger" },
    { code: "+234", country: "NG", name: "Nigeria" },
    { code: "+47", country: "NO", name: "Norway" },
    { code: "+968", country: "OM", name: "Oman" },
    { code: "+92", country: "PK", name: "Pakistan" },
    { code: "+970", country: "PS", name: "Palestine" },
    { code: "+507", country: "PA", name: "Panama" },
    { code: "+595", country: "PY", name: "Paraguay" },
    { code: "+51", country: "PE", name: "Peru" },
    { code: "+63", country: "PH", name: "Philippines" },
    { code: "+48", country: "PL", name: "Poland" },
    { code: "+351", country: "PT", name: "Portugal" },
    { code: "+974", country: "QA", name: "Qatar" },
    { code: "+40", country: "RO", name: "Romania" },
    { code: "+7", country: "RU", name: "Russia" },
    { code: "+250", country: "RW", name: "Rwanda" },
    { code: "+966", country: "SA", name: "Saudi Arabia" },
    { code: "+221", country: "SN", name: "Senegal" },
    { code: "+381", country: "RS", name: "Serbia" },
    { code: "+65", country: "SG", name: "Singapore" },
    { code: "+421", country: "SK", name: "Slovakia" },
    { code: "+386", country: "SI", name: "Slovenia" },
    { code: "+27", country: "ZA", name: "South Africa" },
    { code: "+82", country: "KR", name: "South Korea" },
    { code: "+211", country: "SS", name: "South Sudan" },
    { code: "+34", country: "ES", name: "Spain" },
    { code: "+94", country: "LK", name: "Sri Lanka" },
    { code: "+249", country: "SD", name: "Sudan" },
    { code: "+597", country: "SR", name: "Suriname" },
    { code: "+46", country: "SE", name: "Sweden" },
    { code: "+41", country: "CH", name: "Switzerland" },
    { code: "+963", country: "SY", name: "Syria" },
    { code: "+886", country: "TW", name: "Taiwan" },
    { code: "+992", country: "TJ", name: "Tajikistan" },
    { code: "+255", country: "TZ", name: "Tanzania" },
    { code: "+66", country: "TH", name: "Thailand" },
    { code: "+228", country: "TG", name: "Togo" },
    { code: "+1868", country: "TT", name: "Trinidad and Tobago" },
    { code: "+216", country: "TN", name: "Tunisia" },
    { code: "+90", country: "TR", name: "Turkey" },
    { code: "+993", country: "TM", name: "Turkmenistan" },
    { code: "+256", country: "UG", name: "Uganda" },
    { code: "+380", country: "UA", name: "Ukraine" },
    { code: "+971", country: "AE", name: "United Arab Emirates" },
    { code: "+44", country: "GB", name: "United Kingdom" },
    { code: "+1", country: "US", name: "United States" },
    { code: "+598", country: "UY", name: "Uruguay" },
    { code: "+998", country: "UZ", name: "Uzbekistan" },
    { code: "+58", country: "VE", name: "Venezuela" },
    { code: "+84", country: "VN", name: "Vietnam" },
    { code: "+967", country: "YE", name: "Yemen" },
    { code: "+260", country: "ZM", name: "Zambia" },
    { code: "+263", country: "ZW", name: "Zimbabwe" },
];

// Genres data (matching main TORA app)
const genresList = [
    "Afro House",
    "Afrobeat",
    "Amapiano",
    "Ambient",
    "Bass",
    "Dancehall",
    "Deep House",
    "Disco",
    "Downtempo",
    "Drum & Bass",
    "Dub Techno",
    "Dubstep",
    "EBM",
    "Electro",
    "Experimental",
    "Funk/Soul",
    "Garage",
    "Hardcore",
    "Hip Hop",
    "House",
    "IDM",
    "Industrial",
    "Italo Disco",
    "Jazz",
    "Jungle",
    "Melodic Techno",
    "Minimal",
    "Noise",
    "Pop",
    "Progressive House",
    "Psytrance",
    "R&B",
    "Reggaeton",
    "Tech House",
    "Techno",
    "Trance"
];

// Location data

interface ApplicationFormProps {
    onSubmit: () => void;
    onStepChange?: (step: number) => void;
}

export function ApplicationForm({ onSubmit, onStepChange }: ApplicationFormProps) {
    const { t } = useLanguage();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [stepSubmitting, setStepSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    // Phone number state (for contacts screen)
    const [countryCode, setCountryCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Form field state
    const [role, setRole] = useState<string | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profileName, setProfileName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [zone, setZone] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [genres, setGenres] = useState<string[]>([]);
    const [otherGenre, setOtherGenre] = useState("");
    // Custom genres the applicant added with "+" — each tracked separately so
    // missing genres surface individually in the admin data.
    const [otherGenres, setOtherGenres] = useState<string[]>([]);
    const [instagram, setInstagram] = useState("");
    const [residentAdvisor, setResidentAdvisor] = useState("");
    const [soundcloud, setSoundcloud] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [venueCapacity, setVenueCapacity] = useState("");
    const [website, setWebsite] = useState("");
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Draft persistence — keep the in-progress application across refreshes, so a
    // reload (or an accidental tab close) doesn't wipe everything the user typed.
    const DRAFT_KEY = "tora_application_draft";
    const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // discard drafts older than 7 days
    useEffect(() => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            const w = raw ? JSON.parse(raw) : null;
            const fresh = w && typeof w.t === "number" && Date.now() - w.t < DRAFT_MAX_AGE_MS && typeof w.v === "string";
            if (raw && !fresh) localStorage.removeItem(DRAFT_KEY); // stale or old-format — don't let PII linger
            if (fresh) {
                const d = JSON.parse(w.v);
                if (typeof d.step === "number") setStep(d.step);
                if (d.role) setRole(d.role);
                if (d.countryCode) setCountryCode(d.countryCode);
                if (d.phoneNumber) setPhoneNumber(d.phoneNumber);
                if (d.firstName) setFirstName(d.firstName);
                if (d.lastName) setLastName(d.lastName);
                if (d.profileName) setProfileName(d.profileName);
                if (d.email) setEmail(d.email);
                if (d.confirmEmail) setConfirmEmail(d.confirmEmail);
                if (d.zone) setZone(d.zone);
                if (d.country) setCountry(d.country);
                if (d.city) setCity(d.city);
                if (Array.isArray(d.genres)) setGenres(d.genres);
                if (d.otherGenre) setOtherGenre(d.otherGenre);
                if (Array.isArray(d.otherGenres)) setOtherGenres(d.otherGenres);
                if (d.instagram) setInstagram(d.instagram);
                if (d.residentAdvisor) setResidentAdvisor(d.residentAdvisor);
                if (d.soundcloud) setSoundcloud(d.soundcloud);
                if (d.agencyName) setAgencyName(d.agencyName);
                if (d.linkedin) setLinkedin(d.linkedin);
                if (d.venueCapacity) setVenueCapacity(d.venueCapacity);
                if (d.website) setWebsite(d.website);
                if (d.acceptedPrivacy) setAcceptedPrivacy(true);
            }
        } catch { /* ignore a malformed draft */ }
        setHydrated(true);
    }, []);

    // Serialize once per render; the effect only writes when this string changes,
    // so there's no 20-field dependency array to hand-maintain.
    const draftSnapshot = JSON.stringify({
        step, role, countryCode, phoneNumber, firstName, lastName, profileName,
        email, confirmEmail, zone, country, city, genres, otherGenre, otherGenres,
        instagram, residentAdvisor, soundcloud, agencyName, linkedin, venueCapacity,
        website, acceptedPrivacy,
    });
    useEffect(() => {
        if (!hydrated) return; // don't overwrite the saved draft before it's restored
        // Stamp each save with a time so restore can drop drafts older than the max age.
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ t: Date.now(), v: draftSnapshot })); } catch { /* storage unavailable — non-fatal */ }
    }, [hydrated, draftSnapshot]);

    // Notify parent component when step changes
    useEffect(() => {
        if (onStepChange) {
            onStepChange(step);
        }
    }, [step, onStepChange]);

    // Synchronous lock to block fast-fire step changes. Held long enough to
    // outlive the AnimatePresence exit animation (400ms) — without this delay,
    // a useEffect that cleared on step change releases the lock while the old
    // step is still rendered and clickable mid-animation, letting the second
    // click on the same DOM button advance again.
    const lockRef = useRef(false);
    const releaseLock = () => {
        setTimeout(() => { lockRef.current = false; }, 500);
    };

    const nextStep = () => {
        if (lockRef.current) return;
        lockRef.current = true;
        setDirection(1);
        setStep((s) => s + 1);
        releaseLock();
    };
    const prevStep = () => {
        if (lockRef.current) return;
        lockRef.current = true;
        setDirection(-1);
        setStep((s) => s - 1);
        releaseLock();
    };

    // Add the current "Other" input as a tracked custom genre (deduped, case-insensitive).
    const addOtherGenre = () => {
        const g = otherGenre.trim();
        if (!g) return;
        const dup = [...genres, ...otherGenres].some((x) => x.toLowerCase() === g.toLowerCase());
        if (!dup) setOtherGenres((prev) => [...prev, g]);
        setOtherGenre("");
    };

    // Grid selections + custom entries, plus any text still in the input that
    // wasn't committed with "+" — used for both validation and submission.
    const collectGenres = () => {
        const all = [...genres, ...otherGenres];
        const pending = otherGenre.trim();
        if (pending && !all.some((x) => x.toLowerCase() === pending.toLowerCase())) all.push(pending);
        return all;
    };

    const validateEmail = (email: string): boolean => {
        // Regex that requires: username@domain.extension
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted!");
        setLoading(true);
        setError(null);

        // Simulate loading delay for better UX
        setTimeout(async () => {
            try {
                // Only try to save to Supabase if valid credentials are configured
                const hasSupabaseConfig =
                    process.env.NEXT_PUBLIC_SUPABASE_URL &&
                    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

                if (hasSupabaseConfig) {
                    // Get environment mode and determine table name
                    const envMode = process.env.NEXT_PUBLIC_ENV_MODE || 'production';
                    const tableName = envMode === 'test' ? 'waitlist_test' : 'waitlist';

                    const { error: dbError } = await supabase.from(tableName).insert([
                        {
                            phone_number: `${countryCode} ${phoneNumber}`,
                            role,
                            first_name: firstName,
                            last_name: lastName,
                            profile_name: profileName,
                            email,
                            zone,
                            country,
                            city,
                            genres: collectGenres().join(', '),
                            instagram,
                            resident_advisor: residentAdvisor || null,
                            soundcloud: soundcloud || null,
                            agency_name: agencyName || null,
                            website: website || null,
                            linkedin: linkedin || null,
                            venue_capacity: venueCapacity || null,
                        },
                    ]);

                    if (dbError) {
                        console.error("❌ Database error:", dbError);
                        console.error("Error details:", JSON.stringify(dbError, null, 2));
                        console.log("Continuing to confirmation despite database error...");
                        // Don't return - continue to show confirmation page
                    } else {
                        console.log('✅ Database insert successful!');

                        // Send confirmation email (fire-and-forget - don't block on errors)
                        fetch('/api/send-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                firstName,
                                email,
                                role,
                            }),
                        })
                            .then(res => {
                                if (res.ok) {
                                    console.log('Confirmation email sent successfully!');
                                } else {
                                    console.log('Email failed (continuing anyway):', res.status);
                                }
                            })
                            .catch(err => console.log('Email error (continuing anyway):', err));
                    }
                } else {
                    // Log form data to console instead (for testing without Supabase)
                    console.log("Supabase not configured. Form data:", {
                        phone_number: `${countryCode} ${phoneNumber}`,
                        role,
                        first_name: firstName,
                        last_name: lastName,
                        profile_name: profileName,
                        email,
                        zone,
                        country,
                        city,
                        genres: collectGenres().join(', '),
                        instagram,
                        resident_advisor: residentAdvisor || null,
                        soundcloud: soundcloud || null,
                        agency_name: agencyName || null,
                        website: website || null,
                        linkedin: linkedin || null,
                        venue_capacity: venueCapacity || null,
                    });
                }

                setLoading(false);
                console.log("Submission successful, showing confirmation...");
                try { localStorage.removeItem(DRAFT_KEY); } catch { /* non-fatal */ }
                setSubmitted(true);
            } catch (err) {
                console.error("Unexpected error:", err);
                setLoading(false);
                setError(t('error_generic'));
            }
        }, 1500); // 1.5 second delay to show loading state
    };

    const roles = ["Artist", "Promoter", "Venue", "Agent"];

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0, scale: 0.95, filter: "blur(10px)" }),
        center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0, scale: 0.95, filter: "blur(10px)" }),
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
    };

    // Show confirmation screen if submitted
    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-8">
                <GlassPanel className="p-8 md:p-16 max-w-2xl w-full flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center space-y-8"
                    >
                        {/* Success checkmark icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex justify-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-infrared/20 flex items-center justify-center">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                                        d="M10 24L18 32L38 12"
                                        stroke="#FF3366"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Confirmation heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-3xl md:text-4xl font-black tracking-[0.2em] uppercase text-white"
                            style={{
                                fontFamily: 'var(--font-space-grotesk), var(--font-rajdhani), sans-serif',
                                fontWeight: 700,
                                letterSpacing: '0.2em'
                            }}
                        >
                            {t('application_received')}
                        </motion.h2>

                        {/* Confirmation message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="space-y-4"
                        >
                            <p className="text-white/80 text-base md:text-lg leading-relaxed mx-auto">
                                {t('thank_you')}
                            </p>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                                {t('application_received_message')}
                            </p>
                        </motion.div>

                        {/* What happens next */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="pt-6 border-t border-white/10 space-y-4"
                        >
                            <p className="text-white/70 text-sm md:text-base font-medium uppercase tracking-wider">
                                {t('what_happens_next')}
                            </p>
                            <div className="text-white/50 text-xs md:text-sm leading-relaxed space-y-2 max-w-lg mx-auto">
                                <p>
                                    <span className="text-infrared font-medium">1. {t('step_review')}</span> {t('step_review_text')}
                                </p>
                                <p>
                                    <span className="text-infrared font-medium">2. {t('step_approval')}</span> {t('step_approval_text')}
                                </p>
                                <p>
                                    <span className="text-infrared font-medium">3. {t('step_launch_access')}</span> {t('step_launch_access_text')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Final message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                            className="pt-4"
                        >
                            <p className="text-white/40 text-xs md:text-sm">
                                {t('check_email')}
                            </p>
                        </motion.div>
                    </motion.div>
                </GlassPanel>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen relative z-10 px-2 py-8 overflow-y-auto overflow-x-hidden">
            <GlassPanel className="p-6 md:p-16 max-w-4xl w-full flex flex-col items-center my-auto">
                <div className="w-full">
                {/* Header */}
                <div className="mb-12 text-center w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-xl md:text-2xl font-semibold tracking-[0.15em] uppercase text-white mb-5 whitespace-nowrap"
                        style={{
                            fontFamily: 'var(--font-space-grotesk), var(--font-rajdhani), sans-serif',
                            fontWeight: 500,
                            letterSpacing: '0.15em'
                        }}
                    >
                        {t('access_request')}
                    </motion.h2>

                    {/* Progress bar with pink active tint */}
                    <div className="flex justify-center space-x-2">
                        {[0, 1, 2, 3, 4, 5].map((s) => (
                            <motion.div
                                key={s}
                                className="h-1 rounded-full overflow-hidden"
                                style={{ width: "40px" }}
                                animate={{
                                    opacity: s <= step ? 1 : 0.3,
                                    backgroundColor: s <= step
                                        ? s === step ? "rgba(255,51,102,0.8)" : "rgba(255,255,255,0.55)"
                                        : "rgba(255,255,255,0.15)",
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative min-h-[400px] w-full flex flex-col items-center justify-start pt-8">
                    <AnimatePresence mode="wait" custom={direction}>


                        {/* Step 0 — Role */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-8 mx-auto flex flex-col items-center"
                                style={{ width: '328px' }}
                            >
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm md:text-base uppercase tracking-wide md:tracking-[0.2em] text-white/60 text-center mb-4 font-tech"
                                >
                                    {t('select_your_role')}
                                </motion.p>
                                <motion.div
                                    className="grid grid-cols-1 gap-4 w-full"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {roles.map((r, i) => (
                                        <motion.button
                                            key={r}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => { setRole(r); nextStep(); }}
                                            className={`w-full px-6 py-4 border text-center transition-all uppercase text-xs md:text-sm font-semibold tracking-wide font-tech ${role === r
                                                ? "bg-infrared text-white border-infrared"
                                                : "bg-white/5 border-white/30 hover:border-infrared text-white hover:text-white"
                                                }`}
                                        >
                                            <motion.span
                                                className="flex items-center justify-center gap-3"
                                                initial={{ opacity: 0.5 }}
                                                animate={{ opacity: role === r ? 1 : 0.5 }}
                                            >
                                                <span className="text-xs opacity-50">0{i + 1}</span>
                                                {t(`role_${r.toLowerCase()}`)}
                                            </motion.span>
                                        </motion.button>
                                    ))}
                                </motion.div>
                                <div className="mt-8 text-center">
                                    <a
                                        href="/apply"
                                        className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                                        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                                    >
                                        &lsaquo; Back
                                    </a>
                                </div>
                            </motion.div>
                        )}

                                                {/* Step 1 — Identification & Profile Name (Combined) */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="mx-auto flex flex-col items-center"
                                style={{ width: '328px' }}
                            >
                                <form onSubmit={(e) => { e.preventDefault(); if (firstName.trim() && lastName.trim() && profileName.trim()) nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center space-y-6">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm md:text-base uppercase tracking-wide md:tracking-[0.2em] text-white/60 mb-6 font-tech"
                                        >
                                            {t('identification')}
                                        </motion.p>
                                        <InfraredInput
                                            label=""
                                            placeholder={t('first_name')}
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="text-center text-sm md:text-base py-5 font-tech"
                                        />
                                        <InfraredInput
                                            label=""
                                            placeholder={t('last_name')}
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="text-center text-sm md:text-base py-5 font-tech"
                                        />
                                        <InfraredInput
                                            label=""
                                            placeholder={
                                                role === 'Artist' ? t('artist_name') :
                                                role === 'Promoter' ? t('promoter_event_name') :
                                                role === 'Venue' ? t('venue_name') :
                                                t('agent_name')
                                            }
                                            required
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            className="text-center text-sm md:text-base py-5 font-tech"
                                        />
                                        <p className="text-white/40 text-xs tracking-wide text-center mt-2">{t('profile_name_hint')}</p>
                                        {role === 'Agent' && <p className="text-white/40 text-xs tracking-wide text-center mt-1">{t('agent_name_hint')}</p>}
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-6 py-3">{t('back')}</InfraredButton>
                                        <InfraredButton type="submit" disabled={stepSubmitting} className="flex-1 py-3 text-sm">{stepSubmitting ? '...' : t('next')}</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 2 — CONTACTS */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="mx-auto flex flex-col items-center"
                                style={{ width: '328px' }}
                            >
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (stepSubmitting) return;
                                    if (!email.trim() || !validateEmail(email.trim())) {
                                        setError(t('email_validation_error'));
                                        return;
                                    }
                                    if (email.trim() !== confirmEmail.trim()) {
                                        setError(t('email_mismatch_error'));
                                        return;
                                    }
                                    setStepSubmitting(true);
                                    try {
                                        const envMode = process.env.NEXT_PUBLIC_ENV_MODE || 'production';
                                        // Goes through /api/public/waitlist/check (Next.js
                                        // proxy → backend service_role) — no direct
                                        // Supabase read so the apply form can't be used
                                        // to scrape waitlist PII via the public anon key.
                                        const checkRes = await fetch(
                                            `/api/public/waitlist/check?email=${encodeURIComponent(email.trim())}&env=${envMode}`,
                                            { cache: 'no-store' }
                                        );
                                        const checkData = await checkRes.json();
                                        if (checkRes.ok && checkData.exists) {
                                            if (checkData.allowReapply) {
                                                const proceed = window.confirm(
                                                    "An account already exists with this email. If your application is accepted, this new profile will be added to your existing account.\n\nDo you want to continue?"
                                                );
                                                if (!proceed) { setStepSubmitting(false); return; }
                                            } else {
                                                setError("You've already applied with this email. Check your inbox (and spam folder) for updates.");
                                                setStepSubmitting(false);
                                                return;
                                            }
                                        }
                                        setError(null);
                                        nextStep();
                                    } catch (err) {
                                        console.error('Duplicate check error:', err);
                                        setError(null);
                                        nextStep();
                                    } finally {
                                        setStepSubmitting(false);
                                    }
                                }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center space-y-6">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm md:text-base uppercase tracking-wide md:tracking-[0.2em] text-white/60 mb-6 font-tech"
                                        >
                                            {t('contacts')}
                                        </motion.p>
                                        <InfraredInput
                                            label=""
                                            type="text"
                                            placeholder={t('email_address')}
                                            required
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError(null);
                                            }}
                                            className="text-center text-sm md:text-base py-5 font-tech"
                                        />
                                        <InfraredInput
                                            label=""
                                            type="text"
                                            placeholder={t('confirm_email_address')}
                                            required
                                            value={confirmEmail}
                                            onChange={(e) => {
                                                setConfirmEmail(e.target.value);
                                                if (error) setError(null);
                                            }}
                                            className="text-center text-sm md:text-base py-5 font-tech"
                                        />
                                        <div className="flex gap-3 w-full">
                                            <select
                                                value={countryCode}
                                                onChange={(e) => setCountryCode(e.target.value)}
                                                required
                                                className="w-32 px-3 py-5 bg-white/5 border border-white/10 text-white text-center text-sm md:text-base font-tech rounded focus:outline-none focus:border-infrared/50 transition-colors"
                                            >
                                                <option value="" disabled>{t('code')}</option>
                                                {countryCodes.map((c) => (
                                                    <option
                                                        key={`${c.code}-${c.country}`}
                                                        value={c.code}
                                                        className="bg-[#0a0a0a] text-white"
                                                    >
                                                        {c.name} ({c.code})
                                                    </option>
                                                ))}
                                            </select>
                                            <InfraredInput
                                                label=""
                                                type="tel"
                                                placeholder={t('phone_number')}
                                                required
                                                value={phoneNumber}
                                                onChange={(e) => {
                                                    // Only allow numbers and spaces
                                                    const value = e.target.value.replace(/[^0-9\s]/g, '');
                                                    setPhoneNumber(value);
                                                }}
                                                className="text-center text-sm md:text-base py-5 font-tech flex-1"
                                            />
                                        </div>
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-4 text-xs text-red-400 tracking-widest uppercase"
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-6 py-3">{t('back')}</InfraredButton>
                                        <InfraredButton type="submit" disabled={stepSubmitting} className="flex-1 py-3 text-sm">{stepSubmitting ? '...' : t('next')}</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 3 — Location (Zone, Country, City) */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="mx-auto flex flex-col items-center"
                                style={{ width: '328px' }}
                            >
                                <form onSubmit={(e) => { e.preventDefault(); if (zone && country && city) nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center space-y-6">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm md:text-base uppercase tracking-wide md:tracking-[0.2em] text-white/60 mb-6 font-tech"
                                        >
                                            {t('location')}
                                        </motion.p>

                                        {/* City search \u2014 type your city; country + zone are derived.
                                            Falls back to manual entry if a city isn't found. */}
                                        <CitySearch
                                            city={city}
                                            country={country}
                                            onSelect={(c, co, z) => { setCity(c); setCountry(co); setZone(z); }}
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-6 py-3">{t('back')}</InfraredButton>
                                        <InfraredButton type="submit" disabled={stepSubmitting} className="flex-1 py-3 text-sm">{stepSubmitting ? '...' : t('next')}</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 4 — Genres */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="mx-auto flex flex-col items-center"
                                style={{ width: '328px' }}
                            >
                                <form onSubmit={(e) => { e.preventDefault(); if (collectGenres().length > 0) nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm md:text-base uppercase tracking-wide md:tracking-[0.2em] text-white/60 mb-6 font-tech"
                                        >
                                            {t('genres')}
                                        </motion.p>

                                        {/* Genre selection grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            {genresList.map((genre) => (
                                                <button
                                                    key={genre}
                                                    type="button"
                                                    onClick={() => {
                                                        if (genres.includes(genre)) {
                                                            setGenres(genres.filter(g => g !== genre));
                                                        } else {
                                                            setGenres([...genres, genre]);
                                                        }
                                                    }}
                                                    className={`px-4 py-3 border font-medium tracking-wide transition-all ${
                                                        genre === 'Progressive House' ? 'text-xs' : 'text-sm'
                                                    } ${
                                                        genres.includes(genre)
                                                            ? 'bg-infrared text-white border-infrared'
                                                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white/70 hover:text-white'
                                                    }`}
                                                >
                                                    {genre}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Other genres — add each missing one with "+", tracked separately */}
                                        <div className="w-full mb-4">
                                            <div className="flex gap-2 items-stretch">
                                                <div className="flex-1">
                                                    <InfraredInput
                                                        placeholder={t('other')}
                                                        value={otherGenre}
                                                        onChange={(e) => setOtherGenre(e.target.value)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOtherGenre(); } }}
                                                        className="w-full text-center text-sm md:text-base py-5 font-tech"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addOtherGenre}
                                                    disabled={!otherGenre.trim()}
                                                    aria-label={t('add_other')}
                                                    className="px-5 rounded-xl border border-white/10 bg-white/5 text-white/70 text-2xl leading-none transition-all hover:border-infrared hover:text-white disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-white/70"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <p className="text-white/40 text-xs tracking-wide mt-2">{t('add_other_hint')}</p>

                                            {otherGenres.length > 0 && (
                                                <div className="flex flex-wrap gap-2 justify-center mt-3">
                                                    {otherGenres.map((g) => (
                                                        <button
                                                            key={g}
                                                            type="button"
                                                            onClick={() => setOtherGenres(otherGenres.filter((x) => x !== g))}
                                                            aria-label={`${t('remove')} ${g}`}
                                                            className="inline-flex items-center gap-2 px-3 py-2 bg-infrared text-white border border-infrared text-sm font-medium tracking-wide"
                                                        >
                                                            <span>{g}</span>
                                                            <span aria-hidden="true" className="text-white/80 text-base leading-none">×</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-white/40 text-xs tracking-wide">
                                            {(genres.length + otherGenres.length) === 0 ? t('select_at_least_one') : `${genres.length + otherGenres.length} ${(genres.length + otherGenres.length) === 1 ? t('genres_selected') : t('genres_selected_plural')} ${t('genres_selected_text')}`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-6 py-3">{t('back')}</InfraredButton>
                                        <InfraredButton type="submit" disabled={stepSubmitting} className="flex-1 py-3 text-sm">{stepSubmitting ? '...' : t('next')}</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 5 — Social Profiles */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="mx-auto flex flex-col items-center"
                                style={{ width: '328px' }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center space-y-6">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm md:text-base uppercase tracking-wide md:tracking-[0.2em] text-white/60 mb-6 font-tech"
                                        >
                                            {role === 'Artist' && t('social_music_profiles_artist')}
                                            {role === 'Agent' && t('instagram_agency_details_agent')}
                                            {role === 'Venue' && t('instagram_venue_details_venue')}
                                            {role === 'Promoter' && t('instagram_additional_info_promoter')}
                                        </motion.p>
                                        <div className="relative w-full">
                                            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none z-10">
                                                <span className="text-lg md:text-xl text-white font-tech" style={{ color: '#ffffff', opacity: 1 }}>@</span>
                                            </div>
                                            <InfraredInput
                                                label=""
                                                placeholder={t('instagram_username')}
                                                required
                                                value={instagram}
                                                onChange={(e) => setInstagram(e.target.value)}
                                                className="text-sm md:text-base py-5 font-tech pl-10"
                                            />
                                        </div>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-left text-xs text-white/40 tracking-wide leading-relaxed"
                                            style={{ marginTop: '-16px' }}
                                        >
                                            {role === 'Venue' ? t('instagram_notice_venue')
                                                : role === 'Promoter' ? t('instagram_notice_promoter')
                                                : t('instagram_verification_notice')}
                                        </motion.p>

                                        {/* Artist: RA + SoundCloud */}
                                        {role === 'Artist' && (
                                            <>
                                                <InfraredInput
                                                    label=""
                                                    placeholder={t('resident_advisor_optional')}
                                                    value={residentAdvisor}
                                                    onChange={(e) => setResidentAdvisor(e.target.value)}
                                                    className="text-center text-sm md:text-base py-5 font-tech"
                                                />
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-left text-xs text-white/40 tracking-wide leading-relaxed"
                                                    style={{ marginTop: '-16px' }}
                                                >
                                                    {t('resident_advisor_helper')}
                                                </motion.p>
                                                <InfraredInput
                                                    label=""
                                                    placeholder={t('soundcloud_username_optional')}
                                                    value={soundcloud}
                                                    onChange={(e) => setSoundcloud(e.target.value)}
                                                    className="text-center text-sm md:text-base py-5 font-tech"
                                                />
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-left text-xs text-white/40 tracking-wide leading-relaxed"
                                                    style={{ marginTop: '-16px' }}
                                                >
                                                    {t('soundcloud_helper')}
                                                </motion.p>
                                            </>
                                        )}

                                        {/* Agent: Agency Name + Website + LinkedIn */}
                                        {role === 'Agent' && (
                                            <>
                                                <InfraredInput
                                                    label=""
                                                    placeholder={t('agency_name')}
                                                    required
                                                    value={agencyName}
                                                    onChange={(e) => setAgencyName(e.target.value)}
                                                    className="text-center text-sm md:text-base py-5 font-tech"
                                                />
                                                <InfraredInput
                                                    label=""
                                                    placeholder={t('website_optional')}
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    className="text-center text-sm md:text-base py-5 font-tech"
                                                />
                                                <InfraredInput
                                                    label=""
                                                    placeholder={t('linkedin_optional')}
                                                    value={linkedin}
                                                    onChange={(e) => setLinkedin(e.target.value)}
                                                    className="text-center text-sm md:text-base py-5 font-tech"
                                                />
                                            </>
                                        )}

                                        {/* Venue: Capacity + Website */}
                                        {role === 'Venue' && (
                                            <>
                                                <InfraredInput
                                                    label=""
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder={t('venue_capacity')}
                                                    required
                                                    value={venueCapacity}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        setVenueCapacity(val);
                                                    }}
                                                    className="text-center text-sm md:text-base py-5 font-tech"
                                                />
                                                <InfraredInput
                                                    label=""
                                                    placeholder={t('website_optional')}
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    className="text-center text-sm md:text-base py-5 font-tech"
                                                />
                                            </>
                                        )}

                                        {/* Promoter: Website */}
                                        {role === 'Promoter' && (
                                            <>
                                                <InfraredInput
                                                    label=""
                                                    placeholder={t('website_optional')}
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    className="text-center text-sm md:text-base py-5 font-tech"
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Privacy Policy Consent */}
                                    <div className="w-full flex items-start justify-center gap-3 mt-3 mb-4">
                                        <input
                                            type="checkbox"
                                            id="privacy-consent"
                                            checked={acceptedPrivacy}
                                            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                            className="mt-1 w-4 h-4 accent-infrared cursor-pointer"
                                            required
                                        />
                                        <label
                                            htmlFor="privacy-consent"
                                            className="text-white/60 text-xs md:text-sm text-left leading-relaxed"
                                            style={{
                                                fontFamily: 'var(--font-space-grotesk), var(--font-rajdhani), sans-serif',
                                            }}
                                        >
                                            I agree to the{' '}
                                            <a
                                                href="/privacy"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-infrared hover:text-infrared/80 underline"
                                            >
                                                Privacy Policy
                                            </a>
                                            {' '}and{' '}
                                            <a
                                                href="/terms"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-infrared hover:text-infrared/80 underline"
                                            >
                                                Terms of Service
                                            </a>
                                            {' '}and understand that my data will be used to review my application and, if accepted, to create my TORA profile.
                                        </label>
                                    </div>

                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-6 py-3">{t('back')}</InfraredButton>
                                        <InfraredButton type="submit" disabled={loading} className="flex-1 py-3 text-sm relative overflow-hidden">
                                            {loading ? (
                                                <TORALoader inline size={16} label={t('submitting')} />
                                            ) : (
                                                t('submit_application')
                                            )}
                                        </InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
                </div>
            </GlassPanel>

        </div>
    );
}
