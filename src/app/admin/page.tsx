"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Image from "next/image";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredInput } from "@/components/ui/InfraredInput";
import { InfraredButton } from "@/components/ui/InfraredButton";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Application {
    id: number;
    created_at: string;
    phone_number: string;
    role: string;
    full_name: string;
    profile_name: string;
    email: string;
    zone: string;
    country: string;
    city: string;
    genres: string;
    instagram: string;
    resident_advisor: string | null;
    soundcloud: string | null;
    agency_name: string | null;
    website: string | null;
    linkedin: string | null;
    venue_capacity: string | null;
    status: string;
    coupon_code: string | null;
    invited_at: string | null;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Check if already authenticated
    useEffect(() => {
        const auth = sessionStorage.getItem("admin_authenticated");
        if (auth === "true") {
            setIsAuthenticated(true);
            loadApplications();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple password check (you can change this password)
        if (password === "tora2026admin") {
            setIsAuthenticated(true);
            sessionStorage.setItem("admin_authenticated", "true");
            setError("");
            loadApplications();
        } else {
            setError("Invalid password");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_authenticated");
        setApplications([]);
    };

    const loadApplications = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('waitlist')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (err) {
            console.error('Error loading applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (application: Application) => {
        const displayName = application.profile_name || application.full_name;
        if (!confirm(`Approve ${displayName}?`)) return;

        try {
            // Update status to APPROVED
            const { error } = await supabase
                .from('waitlist')
                .update({ status: 'APPROVED' })
                .eq('id', application.id);

            if (error) throw error;

            alert(`✅ ${displayName} has been approved!`);
            loadApplications(); // Reload list
        } catch (err) {
            console.error('Error approving:', err);
            alert('Failed to approve application');
        }
    };

    const handleDecline = async (application: Application) => {
        const displayName = application.profile_name || application.full_name;
        if (!confirm(`Decline ${displayName}?`)) return;

        try {
            const { error } = await supabase
                .from('waitlist')
                .update({ status: 'DECLINED' })
                .eq('id', application.id);

            if (error) throw error;

            alert(`❌ ${displayName} has been declined.`);
            loadApplications();
        } catch (err) {
            console.error('Error declining:', err);
            alert('Failed to decline application');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-300';
            case 'APPROVED': return 'bg-green-500/20 text-green-300';
            case 'INVITED': return 'bg-blue-500/20 text-blue-300';
            case 'SIGNED_UP': return 'bg-purple-500/20 text-purple-300';
            case 'DECLINED': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role?.toUpperCase()) {
            case 'ARTIST': return '#6B5FFF';
            case 'VENUE': return '#FF5757';
            case 'PROMOTER': return '#00D4FF';
            case 'AGENT': return '#FFB800';
            default: return '#999999';
        }
    };

    const filteredApplications = applications.filter(app => {
        // Filter by status
        if (filter !== 'all' && app.status?.toLowerCase() !== filter) return false;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                app.profile_name?.toLowerCase().includes(query) ||
                app.full_name?.toLowerCase().includes(query) ||
                app.email?.toLowerCase().includes(query) ||
                app.role?.toLowerCase().includes(query) ||
                app.city?.toLowerCase().includes(query)
            );
        }

        return true;
    });

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'PENDING').length,
        approved: applications.filter(a => a.status === 'APPROVED').length,
        invited: applications.filter(a => a.status === 'INVITED').length,
        signedUp: applications.filter(a => a.status === 'SIGNED_UP').length,
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <GlassPanel className="p-8 max-w-md w-full">
                    <div className="flex flex-col items-center mb-6">
                        <Image
                            src="/tora_logo_v2.png"
                            alt="TORA"
                            width={160}
                            height={53}
                            className="mb-4"
                        />
                        <h1
                            className="text-xl text-white text-center uppercase tracking-wide"
                            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
                        >
                            Admin Login
                        </h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <InfraredInput
                            type="password"
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-center"
                        />
                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}
                        <InfraredButton type="submit" className="w-full">
                            LOGIN
                        </InfraredButton>
                    </form>
                </GlassPanel>
            </div>
        );
    }

    // Dashboard Screen
    return (
        <div className="min-h-screen bg-black p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col items-start">
                        <Image
                            src="/tora_logo_v2.png"
                            alt="TORA"
                            width={160}
                            height={53}
                            className="mb-2"
                        />
                        <h1
                            className="text-xl text-white uppercase tracking-wide"
                            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
                        >
                            Waitlist Manager
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white/60 hover:text-white text-sm uppercase tracking-wide"
                        style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
                    >
                        Logout
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-white/60 text-xs uppercase mb-1">Total</div>
                        <div className="text-white text-2xl font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <div className="text-yellow-300/60 text-xs uppercase mb-1">Pending</div>
                        <div className="text-yellow-300 text-2xl font-bold">{stats.pending}</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="text-green-300/60 text-xs uppercase mb-1">Approved</div>
                        <div className="text-green-300 text-2xl font-bold">{stats.approved}</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="text-blue-300/60 text-xs uppercase mb-1">Invited</div>
                        <div className="text-blue-300 text-2xl font-bold">{stats.invited}</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <div className="text-purple-300/60 text-xs uppercase mb-1">Signed Up</div>
                        <div className="text-purple-300 text-2xl font-bold">{stats.signedUp}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex gap-2 overflow-x-auto">
                        {['all', 'pending', 'approved', 'invited', 'signed_up', 'declined'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded text-sm uppercase tracking-wide transition-colors whitespace-nowrap ${
                                    filter === f
                                        ? 'bg-infrared text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, role, city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40 focus:outline-none focus:border-infrared/50"
                    />
                </div>

                {/* Applications List */}
                {loading ? (
                    <div className="text-center text-white/60 py-12">Loading applications...</div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center text-white/60 py-12">No applications found</div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/[0.07] transition-colors"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    {/* Left: Application Details */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3
                                                className="text-white text-2xl font-bold uppercase tracking-wide"
                                                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
                                            >
                                                {app.profile_name || app.full_name}
                                            </h3>
                                            <span
                                                className="px-2 py-1 rounded text-xs uppercase font-semibold"
                                                style={{
                                                    backgroundColor: `${getRoleColor(app.role)}20`,
                                                    color: getRoleColor(app.role),
                                                    border: `1px solid ${getRoleColor(app.role)}40`
                                                }}
                                            >
                                                {app.role}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs uppercase ${getStatusColor(app.status || 'PENDING')}`}>
                                                {app.status || 'PENDING'}
                                            </span>
                                        </div>
                                        <div className="text-white/60 text-sm">
                                            <span className="text-white/40">Legal name:</span> <span className="text-white/60">{app.full_name}</span>
                                        </div>
                                        <div className="text-white/60 text-sm">
                                            {app.city}, {app.country}
                                        </div>
                                        <div className="text-white/40 text-sm">
                                            {app.genres}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/40 text-xs">
                                            <span className="flex items-center gap-1.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                                {app.email}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                </svg>
                                                {app.phone_number}
                                            </span>
                                            {app.instagram && (
                                                <a
                                                    href={`https://instagram.com/${app.instagram.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                                    </svg>
                                                    Instagram
                                                </a>
                                            )}
                                            {app.soundcloud && (
                                                <a
                                                    href={app.soundcloud.startsWith('http') ? app.soundcloud : `https://soundcloud.com/${app.soundcloud}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.255-2.154c-.009-.054-.049-.1-.099-.1zm1.378.123c-.058 0-.102.046-.113.105l-.193 1.726.193 1.683c.011.059.055.109.113.109.057 0 .102-.046.113-.109l.217-1.683-.217-1.726c-.011-.059-.056-.105-.113-.105zm1.373.114c-.062 0-.113.05-.122.114l-.177 1.712.177 1.669c.009.064.06.118.122.118.063 0 .113-.054.123-.118l.195-1.669-.195-1.712c-.01-.064-.06-.114-.123-.114zm1.37.099c-.066 0-.118.054-.127.118l-.161 1.613.161 1.614c.009.064.061.114.127.114.066 0 .119-.05.128-.114l.18-1.614-.18-1.613c-.009-.064-.062-.118-.128-.118zm1.364.114c-.07 0-.126.058-.135.132l-.146 1.499.146 1.501c.009.074.065.132.135.132.07 0 .126-.058.135-.132l.163-1.501-.163-1.499c-.009-.074-.065-.132-.135-.132zm1.361.117c-.074 0-.132.062-.14.136l-.132 1.382.132 1.386c.008.074.066.132.14.132.075 0 .132-.058.14-.132l.148-1.386-.148-1.382c-.008-.074-.065-.136-.14-.136zm1.357.136c-.079 0-.14.066-.149.15l-.114 1.246.114 1.251c.009.083.07.149.149.149.079 0 .14-.066.149-.149l.127-1.251-.127-1.246c-.009-.084-.07-.15-.149-.15zm1.35.144c-.083 0-.149.07-.158.158l-.105 1.102.105 1.106c.009.089.075.154.158.154.084 0 .15-.065.159-.154l.117-1.106-.117-1.102c-.009-.088-.075-.158-.159-.158zm1.347.154c-.088 0-.158.074-.167.166l-.09.948.09.953c.009.092.079.162.167.162.087 0 .157-.07.166-.162l.1-.953-.1-.948c-.009-.092-.079-.166-.166-.166zm1.344.167c-.092 0-.166.078-.175.174l-.075.807.075.812c.009.096.083.17.175.17.091 0 .165-.074.174-.17l.084-.812-.084-.807c-.009-.096-.083-.174-.174-.174zm1.341.174c-.096 0-.17.082-.179.178l-.066.629.066.632c.009.1.083.174.179.174.095 0 .169-.078.178-.174l.075-.632-.075-.629c-.009-.096-.083-.178-.178-.178zm1.337.185c-.1 0-.174.086-.183.186l-.056.444.056.447c.009.1.083.182.183.182.099 0 .173-.082.182-.182l.062-.447-.062-.444c-.009-.1-.083-.186-.182-.186zm3.685-2.426c-.439 0-.858.089-1.24.252-.106-.957-.942-1.712-1.954-1.712-.184 0-.36.028-.525.078-.096.029-.122.063-.126.127v6.782c0 .065.052.123.118.131 0 0 3.704.009 3.727.009.932 0 1.686-.754 1.686-1.686 0-.931-.754-1.686-1.686-1.686z"/>
                                                    </svg>
                                                    SoundCloud
                                                </a>
                                            )}
                                            {app.resident_advisor && (
                                                <a
                                                    href={app.resident_advisor.startsWith('http')
                                                        ? app.resident_advisor
                                                        : `https://ra.co/dj/${(app.profile_name || app.resident_advisor).toLowerCase().replace(/\s+/g, '')}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M7.5 9.75h3v3h-3v-3zm6 0h3v3h-3v-3zm-6 6h3v3h-3v-3zm6 0h3v3h-3v-3zM3 3v18h18V3H3zm16.5 16.5h-15v-15h15v15z"/>
                                                    </svg>
                                                    Resident Advisor
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-white/30 text-xs">
                                            Applied: {new Date(app.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-col gap-2 min-w-[200px]">
                                        {app.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(app)}
                                                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                    APPROVE
                                                </button>
                                                <button
                                                    onClick={() => handleDecline(app)}
                                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                    DECLINE
                                                </button>
                                            </>
                                        )}
                                        {app.status === 'APPROVED' && (
                                            <div className="text-green-300 text-sm text-center py-2 flex items-center justify-center gap-2">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                Approved - Ready for invitation
                                            </div>
                                        )}
                                        {app.status === 'INVITED' && app.coupon_code && (
                                            <div className="text-blue-300 text-sm">
                                                <div>Coupon: {app.coupon_code}</div>
                                                <div className="text-white/40 text-xs mt-1">
                                                    Sent: {app.invited_at ? new Date(app.invited_at).toLocaleString() : 'N/A'}
                                                </div>
                                            </div>
                                        )}
                                        {app.status === 'SIGNED_UP' && (
                                            <div className="text-purple-300 text-sm text-center py-2 flex items-center justify-center gap-2">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                Active User
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
