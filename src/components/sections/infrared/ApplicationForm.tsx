"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredInput } from "@/components/ui/InfraredInput";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
    "Acid House",
    "Afrobeat",
    "Ambient",
    "Bass",
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
    "House",
    "IDM",
    "Industrial",
    "Italo Disco",
    "Jungle",
    "Melodic Techno",
    "Minimal",
    "Progressive House",
    "Psytrance",
    "Tech House",
    "Techno",
    "Trance"
];

// Location data
const zones = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

const countriesByZone: Record<string, string[]> = {
    "Europe": ["Austria", "Belgium", "Czech Republic", "Denmark", "Finland", "France", "Germany", "Greece", "Ireland", "Italy", "Netherlands", "Norway", "Poland", "Portugal", "Spain", "Sweden", "Switzerland", "United Kingdom"],
    "Asia": ["China", "Hong Kong", "India", "Indonesia", "Japan", "Malaysia", "Philippines", "Singapore", "South Korea", "Taiwan", "Thailand", "Vietnam"],
    "Americas": ["Argentina", "Brazil", "Canada", "Chile", "Colombia", "Mexico", "Peru", "United States"],
    "Africa": ["Egypt", "Kenya", "Morocco", "Nigeria", "South Africa"],
    "Oceania": ["Australia", "New Zealand"]
};

const citiesByCountry: Record<string, string[]> = {
    // Europe
    "Austria": ["Graz", "Innsbruck", "Linz", "Salzburg", "Vienna"],
    "Belgium": ["Antwerp", "Bruges", "Brussels", "Ghent", "Leuven", "Liège"],
    "Czech Republic": ["Brno", "Ostrava", "Prague"],
    "Denmark": ["Aarhus", "Copenhagen", "Odense"],
    "Finland": ["Espoo", "Helsinki", "Tampere"],
    "France": ["Lyon", "Marseille", "Montpellier", "Nantes", "Nice", "Paris", "Strasbourg", "Toulouse"],
    "Germany": ["Berlin", "Cologne", "Dortmund", "Düsseldorf", "Frankfurt", "Hamburg", "Munich", "Stuttgart"],
    "Greece": ["Athens", "Heraklion", "Patras", "Thessaloniki"],
    "Ireland": ["Cork", "Dublin", "Galway", "Limerick"],
    "Italy": ["Bologna", "Florence", "Genoa", "Milan", "Naples", "Rome", "Turin", "Venice"],
    "Netherlands": ["Amsterdam", "Eindhoven", "Groningen", "Rotterdam", "The Hague", "Utrecht"],
    "Norway": ["Bergen", "Oslo", "Stavanger", "Trondheim"],
    "Poland": ["Gdańsk", "Kraków", "Poznań", "Warsaw", "Wrocław"],
    "Portugal": ["Lisbon", "Porto"],
    "Spain": ["Barcelona", "Bilbao", "Ibiza", "Madrid", "Málaga", "Palma", "Seville", "Valencia"],
    "Sweden": ["Gothenburg", "Malmö", "Stockholm"],
    "Switzerland": ["Basel", "Bern", "Geneva", "Lausanne", "Lucerne", "Zurich"],
    "United Kingdom": ["Birmingham", "Bristol", "Edinburgh", "Glasgow", "Leeds", "Liverpool", "London", "Manchester"],

    // Asia
    "China": ["Beijing", "Chengdu", "Guangzhou", "Shanghai", "Shenzhen"],
    "Hong Kong": ["Hong Kong"],
    "India": ["Bangalore", "Chennai", "Delhi", "Goa", "Hyderabad", "Kolkata", "Mumbai", "Pune"],
    "Indonesia": ["Bali", "Bandung", "Jakarta", "Surabaya"],
    "Japan": ["Fukuoka", "Kobe", "Kyoto", "Nagoya", "Osaka", "Sapporo", "Tokyo", "Yokohama"],
    "Malaysia": ["Johor Bahru", "Kuala Lumpur", "Penang"],
    "Philippines": ["Cebu", "Davao", "Manila"],
    "Singapore": ["Singapore"],
    "South Korea": ["Busan", "Daegu", "Daejeon", "Gwangju", "Incheon", "Seoul"],
    "Taiwan": ["Kaohsiung", "Taichung", "Taipei"],
    "Thailand": ["Bangkok", "Chiang Mai", "Koh Samui", "Krabi", "Pattaya", "Phuket"],
    "Vietnam": ["Da Nang", "Hanoi", "Ho Chi Minh City"],

    // Americas
    "Argentina": ["Buenos Aires", "Córdoba", "Mar del Plata", "Mendoza", "Rosario"],
    "Brazil": ["Belo Horizonte", "Brasília", "Fortaleza", "Rio de Janeiro", "Salvador", "São Paulo"],
    "Canada": ["Calgary", "Edmonton", "Montreal", "Ottawa", "Toronto", "Vancouver"],
    "Chile": ["Santiago", "Valparaíso"],
    "Colombia": ["Bogotá", "Cartagena", "Medellín"],
    "Mexico": ["Cancún", "Guadalajara", "Mexico City", "Monterrey", "Playa del Carmen", "Tijuana"],
    "Peru": ["Cusco", "Lima"],
    "United States": ["Austin", "Chicago", "Denver", "Detroit", "Las Vegas", "Los Angeles", "Miami", "New York", "San Francisco", "Seattle"],

    // Africa
    "Egypt": ["Alexandria", "Cairo"],
    "Kenya": ["Mombasa", "Nairobi"],
    "Morocco": ["Casablanca", "Marrakech", "Rabat"],
    "Nigeria": ["Abuja", "Lagos"],
    "South Africa": ["Cape Town", "Durban", "Johannesburg", "Port Elizabeth", "Pretoria"],

    // Oceania
    "Australia": ["Adelaide", "Brisbane", "Gold Coast", "Melbourne", "Perth", "Sydney"],
    "New Zealand": ["Auckland", "Christchurch", "Dunedin", "Queenstown", "Wellington"]
};

interface ApplicationFormProps {
    onSubmit: () => void;
}

export function ApplicationForm({ onSubmit }: ApplicationFormProps) {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    // Phone verification state
    const [countryCode, setCountryCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);

    // Form field state
    const [role, setRole] = useState<string | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profileName, setProfileName] = useState("");
    const [email, setEmail] = useState("");
    const [zone, setZone] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [genres, setGenres] = useState<string[]>([]);
    const [portfolio, setPortfolio] = useState("");
    const [residentAdvisor, setResidentAdvisor] = useState("");
    const [soundcloud, setSoundcloud] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [websiteLinkedin, setWebsiteLinkedin] = useState("");
    const [venueCapacity, setVenueCapacity] = useState("");
    const [website, setWebsite] = useState("");

    const nextStep = () => { setDirection(1); setStep((s) => s + 1); };
    const prevStep = () => { setDirection(-1); setStep((s) => s - 1); };

    const validateEmail = (email: string): boolean => {
        // Regex that requires: username@domain.extension
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSendCode = async () => {
        // Validate country code is selected
        if (!countryCode) {
            alert("Please select a country code prefix");
            return;
        }

        // Validate phone number is entered
        if (!phoneNumber.trim()) {
            alert("Please enter your phone number");
            return;
        }

        setLoading(true);
        setError(null);

        // TODO: Integrate with SMS service (Twilio, etc.)
        // For now, simulate sending code
        setTimeout(() => {
            setCodeSent(true);
            setLoading(false);
            console.log("SMS code sent to:", countryCode + phoneNumber);
        }, 1000);
    };

    const handleVerifyCode = async () => {
        setLoading(true);
        setError(null);

        // TODO: Integrate with SMS service to verify code
        // For now, accept any 6-digit code
        if (verificationCode.length === 6) {
            setTimeout(() => {
                setPhoneVerified(true);
                setLoading(false);
                nextStep();
            }, 1000);
        } else {
            setError("Please enter a valid 6-digit code");
            setLoading(false);
        }
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
                    const { error: dbError } = await supabase.from("waitlist").insert([
                        {
                            phone_number: `${countryCode} ${phoneNumber}`,
                            role,
                            full_name: `${firstName} ${lastName}`,
                            profile_name: profileName,
                            email,
                            zone,
                            country,
                            city,
                            genres: genres.join(', '),
                            portfolio,
                            resident_advisor: residentAdvisor || null,
                            soundcloud: soundcloud || null,
                            agency_name: agencyName || null,
                            website_linkedin: websiteLinkedin || null,
                            venue_capacity: venueCapacity || null,
                            website: website || null,
                        },
                    ]);

                    if (dbError) {
                        console.error("Database error:", dbError);
                        setLoading(false);
                        setError("Something went wrong. Please try again.");
                        return;
                    }
                } else {
                    // Log form data to console instead (for testing without Supabase)
                    console.log("Supabase not configured. Form data:", {
                        phone_number: `${countryCode} ${phoneNumber}`,
                        role,
                        full_name: `${firstName} ${lastName}`,
                        profile_name: profileName,
                        email,
                        zone,
                        country,
                        city,
                        genres: genres.join(', '),
                        portfolio,
                        resident_advisor: residentAdvisor || null,
                        soundcloud: soundcloud || null,
                        agency_name: agencyName || null,
                        website_linkedin: websiteLinkedin || null,
                        venue_capacity: venueCapacity || null,
                        website: website || null,
                    });
                }

                setLoading(false);
                console.log("Submission successful, showing confirmation...");
                setSubmitted(true);
            } catch (err) {
                console.error("Unexpected error:", err);
                setLoading(false);
                setError("Something went wrong. Please try again.");
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
                            APPLICATION RECEIVED
                        </motion.h2>

                        {/* Confirmation message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="space-y-4"
                        >
                            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-md mx-auto">
                                Thank you for applying to TORA!
                            </p>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                                Your application has been received and will be carefully reviewed. TORA is currently in pre-launch phase – we're building an exclusive community of verified professionals before opening the platform.
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
                                What Happens Next
                            </p>
                            <div className="text-white/50 text-xs md:text-sm leading-relaxed space-y-2 max-w-lg mx-auto">
                                <p>
                                    <span className="text-infrared font-medium">1. Review:</span> Our team will carefully review your application
                                </p>
                                <p>
                                    <span className="text-infrared font-medium">2. Approval:</span> If approved, you'll receive an invitation code via email
                                </p>
                                <p>
                                    <span className="text-infrared font-medium">3. Launch Access:</span> Use your code to create your account when TORA launches
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
                                Check your email and spam folder for updates.
                            </p>
                        </motion.div>
                    </motion.div>
                </GlassPanel>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen relative z-10 px-4 py-8 overflow-y-auto overflow-x-hidden">
            <GlassPanel className="p-4 md:p-16 max-w-2xl w-full flex flex-col items-center my-auto">
                <div className="w-full scale-[0.80] md:scale-100">
                {/* Header */}
                <div className="mb-12 text-center w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-black tracking-[0.25em] uppercase text-white mb-6"
                        style={{
                            fontFamily: 'var(--font-space-grotesk), var(--font-rajdhani), var(--font-orbitron), sans-serif',
                            fontWeight: 700,
                            letterSpacing: '0.25em',
                            textShadow: '0 0 30px rgba(255, 51, 102, 0.3)'
                        }}
                    >
                        ACCESS REQUEST
                    </motion.h2>

                    {/* Progress bar with pink active tint */}
                    <div className="flex justify-center space-x-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
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

                        {/* Step 0 — Phone Verification */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <div className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Phone Verification
                                        </motion.p>

                                        {!codeSent ? (
                                            <>
                                                {/* Phone Number Input with dropdown prefix */}
                                                <div className="relative w-full mb-4">
                                                    <select
                                                        value={countryCode}
                                                        onChange={(e) => setCountryCode(e.target.value)}
                                                        required
                                                        className="absolute left-0 top-0 bottom-0 pl-4 pr-2 bg-transparent border-r border-white/10 text-white text-base font-tech focus:outline-none z-10 appearance-none cursor-pointer"
                                                        style={{ width: '90px' }}
                                                    >
                                                        <option value="" disabled className="bg-[#0a0a0a] text-white/40">
                                                            +00
                                                        </option>
                                                        {countryCodes.map((c) => (
                                                            <option
                                                                key={`${c.code}-${c.country}`}
                                                                value={c.code}
                                                                className="bg-[#0a0a0a] text-white"
                                                            >
                                                                {c.code} {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute left-[75px] top-0 bottom-0 flex items-center pointer-events-none">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60">
                                                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                    <InfraredInput
                                                        label=""
                                                        type="tel"
                                                        placeholder="234 567 8900"
                                                        required
                                                        value={phoneNumber}
                                                        onChange={(e) => {
                                                            // Only allow numbers and spaces
                                                            const value = e.target.value.replace(/[^0-9\s]/g, '');
                                                            setPhoneNumber(value);
                                                        }}
                                                        className="text-lg md:text-xl py-6 font-tech pl-24"
                                                    />
                                                </div>

                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-xs text-white/40 tracking-wide mb-6"
                                                >
                                                    Enter your phone number with country code
                                                </motion.p>
                                                <InfraredButton
                                                    type="button"
                                                    onClick={handleSendCode}
                                                    disabled={loading}
                                                    className="w-full py-4 text-base"
                                                >
                                                    {loading ? "SENDING..." : "SEND VERIFICATION CODE"}
                                                </InfraredButton>
                                            </>
                                        ) : (
                                            <>
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm text-white/60 mb-4"
                                                >
                                                    Code sent to {countryCode} {phoneNumber}
                                                </motion.p>
                                                <InfraredInput
                                                    label=""
                                                    type="text"
                                                    placeholder="Enter 6-digit code"
                                                    required
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    className="text-center text-lg md:text-xl py-6 font-tech mb-4 tracking-[0.5em]"
                                                    maxLength={6}
                                                />
                                                {error && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-xs text-red-400 tracking-widest uppercase mb-4"
                                                    >
                                                        {error}
                                                    </motion.p>
                                                )}
                                                <div className="flex space-x-4 w-full">
                                                    <InfraredButton
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() => {
                                                            setCodeSent(false);
                                                            setVerificationCode("");
                                                            setError(null);
                                                        }}
                                                        className="px-8 py-4"
                                                    >
                                                        CHANGE NUMBER
                                                    </InfraredButton>
                                                    <InfraredButton
                                                        type="button"
                                                        onClick={handleVerifyCode}
                                                        disabled={verificationCode.length !== 6 || loading}
                                                        className="flex-1 py-4 text-base"
                                                    >
                                                        {loading ? "VERIFYING..." : "VERIFY"}
                                                    </InfraredButton>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 1 — Role */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-8 w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 text-center mb-4 font-tech"
                                >
                                    Select Actor Role
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
                                            className={`w-full px-8 py-5 border text-center transition-all uppercase text-sm md:text-base font-bold tracking-widest font-tech ${role === r
                                                ? "bg-infrared text-white border-infrared"
                                                : "bg-white/5 border-white/10 hover:border-white/30 text-white/50 hover:text-white"
                                                }`}
                                        >
                                            <motion.span
                                                className="flex items-center justify-center gap-3"
                                                initial={{ opacity: 0.5 }}
                                                animate={{ opacity: role === r ? 1 : 0.5 }}
                                            >
                                                <span className="text-xs opacity-50">0{i + 1}</span>
                                                {r}
                                            </motion.span>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Step 2 — Name */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); if (firstName.trim() && lastName.trim()) nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center space-y-6">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Identification
                                        </motion.p>
                                        <InfraredInput
                                            label=""
                                            placeholder="First name"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="text-center text-lg md:text-xl py-6 font-tech"
                                        />
                                        <InfraredInput
                                            label=""
                                            placeholder="Last name"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="text-center text-lg md:text-xl py-6 font-tech"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 3 — Profile Name */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); if (profileName.trim()) nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            {role === 'Artist' && 'Artist Name'}
                                            {role === 'Promoter' && 'Promoter / Event Name'}
                                            {role === 'Venue' && 'Venue Name'}
                                            {role === 'Agent' && 'Agent Name'}
                                        </motion.p>
                                        <InfraredInput
                                            label=""
                                            placeholder={
                                                role === 'Artist' ? 'Artist name' :
                                                role === 'Promoter' ? 'Promoter / Event name' :
                                                role === 'Venue' ? 'Venue name' :
                                                'Agent name'
                                            }
                                            required
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            className="text-center text-lg md:text-xl py-6 font-tech"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 4 — Email */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    if (email.trim() && validateEmail(email.trim())) {
                                        setError(null);
                                        nextStep();
                                    } else {
                                        setError("Please enter a valid email address (e.g., name@example.com)");
                                    }
                                }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Email
                                        </motion.p>
                                        <InfraredInput
                                            label=""
                                            type="text"
                                            placeholder="Email address"
                                            required
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError(null);
                                            }}
                                            className="text-center text-lg md:text-xl py-6 font-tech"
                                        />
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
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 5 — Location (Zone, Country, City) */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); if (zone && country && city) nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center space-y-6">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Location
                                        </motion.p>

                                        {/* Zone Dropdown */}
                                        <select
                                            value={zone}
                                            onChange={(e) => {
                                                setZone(e.target.value);
                                                setCountry("");
                                                setCity("");
                                            }}
                                            required
                                            className="w-full px-4 py-6 bg-white/5 border border-white/10 text-white text-center text-lg md:text-xl font-tech rounded focus:outline-none focus:border-infrared/50 transition-colors"
                                        >
                                            <option value="" disabled>Select zone</option>
                                            {zones.map((z) => (
                                                <option key={z} value={z} className="bg-[#0a0a0a] text-white">{z}</option>
                                            ))}
                                        </select>

                                        {/* Country Dropdown (appears after zone selected) */}
                                        {zone && (
                                            <motion.select
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                value={country}
                                                onChange={(e) => {
                                                    setCountry(e.target.value);
                                                    setCity("");
                                                }}
                                                required
                                                className="w-full px-4 py-6 bg-white/5 border border-white/10 text-white text-center text-lg md:text-xl font-tech rounded focus:outline-none focus:border-infrared/50 transition-colors"
                                            >
                                                <option value="" disabled>Select country</option>
                                                {countriesByZone[zone]?.map((c) => (
                                                    <option key={c} value={c} className="bg-[#0a0a0a] text-white">{c}</option>
                                                ))}
                                            </motion.select>
                                        )}

                                        {/* City Dropdown (appears after country selected) */}
                                        {country && (
                                            <motion.select
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required
                                                className="w-full px-4 py-6 bg-white/5 border border-white/10 text-white text-center text-lg md:text-xl font-tech rounded focus:outline-none focus:border-infrared/50 transition-colors"
                                            >
                                                <option value="" disabled>Select city</option>
                                                {citiesByCountry[country]?.map((c) => (
                                                    <option key={c} value={c} className="bg-[#0a0a0a] text-white">{c}</option>
                                                ))}
                                                <option value="Other" className="bg-[#0a0a0a] text-white">Other</option>
                                            </motion.select>
                                        )}
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 6 — Genres */}
                        {step === 6 && (
                            <motion.div
                                key="step6"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); if (genres.length > 0) nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Genres
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

                                        <p className="text-white/40 text-xs tracking-wide">
                                            {genres.length === 0 ? 'Select at least one genre' : `${genres.length} genre${genres.length !== 1 ? 's' : ''} selected`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 7 — Instagram Verification */}
                        {step === 7 && (
                            <motion.div
                                key="step7"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); if (portfolio.trim()) nextStep(); }} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            Instagram
                                        </motion.p>
                                        <div className="relative w-full">
                                            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none z-10">
                                                <span className="text-lg md:text-xl text-white font-tech" style={{ color: '#ffffff', opacity: 1 }}>@</span>
                                            </div>
                                            <InfraredInput
                                                label=""
                                                placeholder="username"
                                                required
                                                value={portfolio}
                                                onChange={(e) => setPortfolio(e.target.value)}
                                                className="text-lg md:text-xl py-6 font-tech pl-10"
                                            />
                                        </div>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="mt-4 px-4 text-xs text-white/40 tracking-wide leading-relaxed"
                                        >
                                            Please use an Instagram account that is most representative of your online identity as it will be used for verification purposes.
                                        </motion.p>
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4">BACK</InfraredButton>
                                        <InfraredButton type="submit" className="flex-1 py-4 text-base">NEXT</InfraredButton>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 8 — Role-specific additional fields */}
                        {step === 8 && (
                            <motion.div
                                key={`step8-${role}`}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md mx-auto flex flex-col items-center"
                            >
                                <form onSubmit={handleSubmit} className="space-y-10 w-full flex flex-col items-center">
                                    <div className="w-full text-center space-y-6">
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base md:text-lg uppercase tracking-wide md:tracking-[0.25em] text-white/60 mb-6 font-tech"
                                        >
                                            {role === 'Artist' && 'Music Profiles'}
                                            {role === 'Agent' && 'Agency Details'}
                                            {role === 'Venue' && 'Venue Details'}
                                            {role === 'Promoter' && 'Additional Info'}
                                        </motion.p>

                                        {/* Artist: RA + SoundCloud */}
                                        {role === 'Artist' && (
                                            <>
                                                <InfraredInput
                                                    label=""
                                                    placeholder="Resident Advisor URL (optional)"
                                                    value={residentAdvisor}
                                                    onChange={(e) => setResidentAdvisor(e.target.value)}
                                                    className="text-center text-lg md:text-xl py-6 font-tech"
                                                />
                                                <InfraredInput
                                                    label=""
                                                    placeholder="SoundCloud URL (optional)"
                                                    value={soundcloud}
                                                    onChange={(e) => setSoundcloud(e.target.value)}
                                                    className="text-center text-lg md:text-xl py-6 font-tech"
                                                />
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="mt-4 px-4 text-xs text-white/40 tracking-wide leading-relaxed"
                                                >
                                                    Add your music profiles to strengthen your application (optional).
                                                </motion.p>
                                            </>
                                        )}

                                        {/* Agent: Agency Name + Website/LinkedIn */}
                                        {role === 'Agent' && (
                                            <>
                                                <InfraredInput
                                                    label=""
                                                    placeholder="Agency name"
                                                    required
                                                    value={agencyName}
                                                    onChange={(e) => setAgencyName(e.target.value)}
                                                    className="text-center text-lg md:text-xl py-6 font-tech"
                                                />
                                                <InfraredInput
                                                    label=""
                                                    placeholder="Website or LinkedIn (optional)"
                                                    value={websiteLinkedin}
                                                    onChange={(e) => setWebsiteLinkedin(e.target.value)}
                                                    className="text-center text-lg md:text-xl py-6 font-tech"
                                                />
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="mt-4 px-4 text-xs text-white/40 tracking-wide leading-relaxed"
                                                >
                                                    Provide your agency information.
                                                </motion.p>
                                            </>
                                        )}

                                        {/* Venue: Capacity + Website */}
                                        {role === 'Venue' && (
                                            <>
                                                <InfraredInput
                                                    label=""
                                                    type="number"
                                                    placeholder="Venue capacity"
                                                    required
                                                    value={venueCapacity}
                                                    onChange={(e) => setVenueCapacity(e.target.value)}
                                                    className="text-center text-lg md:text-xl py-6 font-tech"
                                                />
                                                <InfraredInput
                                                    label=""
                                                    placeholder="Website (optional)"
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    className="text-center text-lg md:text-xl py-6 font-tech"
                                                />
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="mt-4 px-4 text-xs text-white/40 tracking-wide leading-relaxed"
                                                >
                                                    Provide your venue information.
                                                </motion.p>
                                            </>
                                        )}

                                        {/* Promoter: Website */}
                                        {role === 'Promoter' && (
                                            <>
                                                <InfraredInput
                                                    label=""
                                                    placeholder="Website (optional)"
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    className="text-center text-lg md:text-xl py-6 font-tech"
                                                />
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="mt-4 px-4 text-xs text-white/40 tracking-wide leading-relaxed"
                                                >
                                                    Add your website if available (optional).
                                                </motion.p>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <InfraredButton type="button" variant="secondary" onClick={prevStep} className="px-8 py-4" disabled={loading}>BACK</InfraredButton>
                                        <InfraredButton type="submit" disabled={loading} className="flex-1 py-4 text-base relative overflow-hidden">
                                            {loading ? (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center justify-center gap-2"
                                                >
                                                    <motion.span
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                                    />
                                                    TRANSMITTING...
                                                </motion.span>
                                            ) : (
                                                "SUBMIT"
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
