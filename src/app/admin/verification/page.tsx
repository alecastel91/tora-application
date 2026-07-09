"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Verification queue — Phase 1 of the @tora.verify identity challenge.
 * Match the code a user DM'd to @tora.verify against the row here, glance
 * at the claimed Instagram handle, then Verify or Reject. Uses the same
 * admin session as /admin (log in there first).
 */

interface PendingProfile {
    id: string;
    name: string;
    role: string;
    instagram: string | null;
    verifyStatus: "CODE_ISSUED" | "PENDING_REVIEW";
    verifyCode: string | null;
    verifyCodeIssuedAt: string | null;
    updatedAt: string;
    user: { email: string; lastLogin: string | null };
}

const ROLE_COLORS: Record<string, string> = {
    ARTIST: "#6B5FFF",
    AGENT: "#00C875",
    PROMOTER: "#FFB800",
    VENUE: "#FF5757",
};

function instagramUrl(handle: string): string {
    const clean = handle
        .trim()
        .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
        .replace(/^@/, "")
        .split(/[/?#]/)[0];
    return `https://instagram.com/${clean}`;
}

function timeAgo(iso: string | null): string {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export default function VerificationQueue() {
    const [authed, setAuthed] = useState<boolean | null>(null);
    const [pending, setPending] = useState<PendingProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/verification/queue", { credentials: "include" });
            if (res.status === 401) { setAuthed(false); return; }
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to load");
            setAuthed(true);
            setPending(data.pending || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load queue");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const decide = async (profile: PendingProfile, action: "verify" | "reject") => {
        if (busyId) return;
        if (action === "reject" && !window.confirm(`Reject verification for ${profile.name}?`)) return;
        setBusyId(profile.id);
        try {
            const res = await fetch(`/api/admin/verification/${profile.id}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ reviewedBy: "dashboard" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || `Failed to ${action}`);
            setPending((prev) => prev.filter((p) => p.id !== profile.id));
        } catch (e) {
            setError(e instanceof Error ? e.message : `Failed to ${action}`);
        } finally {
            setBusyId(null);
        }
    };

    if (authed === false) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-white/70 mb-4">Admin session required.</p>
                    <Link href="/admin" className="text-infrared underline">Log in at the dashboard first</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col items-start">
                        <Image src="/tora_logo_v2.png" alt="TORA" width={160} height={53} className="mb-2" />
                        <h1
                            className="text-xl text-white uppercase tracking-wide"
                            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                        >
                            Verification Queue
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={load}
                            className="text-white/60 hover:text-white text-sm uppercase tracking-wide"
                            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                        >
                            Refresh
                        </button>
                        <Link
                            href="/admin"
                            className="text-white/60 hover:text-white text-sm uppercase tracking-wide"
                            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                        >
                            Waitlist
                        </Link>
                    </div>
                </div>

                {/* Count */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-white/60 text-xs uppercase mb-1">Awaiting review</div>
                        <div className="text-white text-2xl font-bold">{pending.length}</div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-3 mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Queue */}
                {loading && pending.length === 0 ? (
                    <p className="text-white/50">Loading…</p>
                ) : pending.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center text-white/50">
                        Queue is empty — nothing awaiting review.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {pending.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-white font-semibold">{p.name}</span>
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                            style={{ color: ROLE_COLORS[p.role] || "#fff", borderColor: `${ROLE_COLORS[p.role] || "#fff"}66` }}
                                        >
                                            {p.role}
                                        </span>
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            p.verifyStatus === "PENDING_REVIEW"
                                                ? "bg-yellow-500/15 text-yellow-300"
                                                : "bg-white/10 text-white/50"
                                        }`}>
                                            {p.verifyStatus === "PENDING_REVIEW" ? "says DM sent" : "code issued"}
                                        </span>
                                    </div>
                                    <div className="text-white/50 text-sm mt-1 flex items-center gap-3 flex-wrap">
                                        <span>{p.user.email}</span>
                                        {p.instagram ? (
                                            <a
                                                href={instagramUrl(p.instagram)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-infrared hover:underline"
                                            >
                                                {p.instagram}
                                            </a>
                                        ) : (
                                            <span className="text-yellow-300/70">no instagram on profile</span>
                                        )}
                                        <span>issued {timeAgo(p.verifyCodeIssuedAt)}</span>
                                        <span>last active {timeAgo(p.user.lastLogin)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <code className="text-white bg-black/60 border border-white/15 rounded-md px-3 py-2 text-sm tracking-[0.15em]">
                                        {p.verifyCode || "—"}
                                    </code>
                                    <button
                                        onClick={() => decide(p, "verify")}
                                        disabled={busyId === p.id}
                                        className="px-4 py-2 rounded bg-green-500/20 border border-green-500/40 text-green-300 text-sm uppercase tracking-wide hover:bg-green-500/30 disabled:opacity-50"
                                    >
                                        {busyId === p.id ? "…" : "Verify"}
                                    </button>
                                    <button
                                        onClick={() => decide(p, "reject")}
                                        disabled={busyId === p.id}
                                        className="px-4 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm uppercase tracking-wide hover:bg-red-500/20 disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-white/30 text-xs mt-8 leading-relaxed">
                    Match the code against the @tora.verify Instagram inbox. Verify only when the DM
                    came from the claimed handle (tap it to compare). Rejected users can request a new code.
                </p>
            </div>
        </div>
    );
}
