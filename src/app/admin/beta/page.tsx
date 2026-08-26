"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

/**
 * /admin/beta — the daily beta cockpit (TORA_BETA_BRIEF Build Item 4).
 * Three views: Action queue (the one that gets used every day), Testers,
 * Feedback inbox. Uses the same admin session as /admin (log in there
 * first); data comes from the BETA backend via server-side proxies.
 */

interface QueueRow { kind: string; adminProfile: string; assignee: string; other: string; since: string; ageMs: number; ref: { dealId?: string; event?: string } }
interface TesterRow { email: string; aliases: string[]; wave: number; signedUp: string; lastActive: string | null; tasksDone: number; tasksSkipped: number; feedback: number }
interface FeedbackRow { id: string; alias: string | null; role: string | null; tier: string | null; wave: number | null; taskCode: string | null; type: string; severity: string; body: string; attachments: string[] | null; route: string | null; screen: string | null; commit: string | null; device: { ua?: string; viewport?: string; standalone?: boolean } | null; sentryEventId: string | null; lastApiError: string | null; status: string; owner: string | null; createdAt: string }

const KIND_LABEL: Record<string, string> = {
  offer_unanswered: "Offer waiting",
  counter_unanswered: "Counter waiting",
  contract_to_sign: "Contract to sign",
  payment_to_confirm: "Payment to confirm",
  message_unanswered: "Message > 4h",
  connection_pending: "Connection request",
  representation_pending: "Representation request",
};

const age = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(ms / 60000))}m`;
  if (h < 48) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

export default function AdminBetaPage() {
  const [tab, setTab] = useState<"queue" | "testers" | "feedback">("queue");
  const [queue, setQueue] = useState<QueueRow[] | null>(null);
  const [testers, setTesters] = useState<TesterRow[] | null>(null);
  const [feedback, setFeedback] = useState<FeedbackRow[] | null>(null);
  const [fbStatus, setFbStatus] = useState("open");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" }).then((r) => setAuthed(r.ok)).catch(() => setAuthed(false));
  }, []);

  const loadQueue = useCallback(() => {
    fetch("/api/admin/beta/queue", { credentials: "include" })
      .then((r) => r.json()).then((d) => setQueue(d.rows || [])).catch(() => {});
  }, []);
  const loadTesters = useCallback(() => {
    fetch("/api/admin/beta/testers", { credentials: "include" })
      .then((r) => r.json()).then((d) => setTesters(d.rows || [])).catch(() => {});
  }, []);
  const loadFeedback = useCallback(() => {
    const qs = fbStatus === "all" ? "" : `?status=${fbStatus}`;
    fetch(`/api/admin/beta/feedback${qs}`, { credentials: "include" })
      .then((r) => r.json()).then((d) => setFeedback(d.rows || [])).catch(() => {});
  }, [fbStatus]);

  useEffect(() => {
    if (!authed) return;
    loadQueue();
    const t = setInterval(loadQueue, 60000); // a row clears on the next poll
    return () => clearInterval(t);
  }, [authed, loadQueue]);
  useEffect(() => { if (authed && tab === "testers") loadTesters(); }, [authed, tab, loadTesters]);
  useEffect(() => { if (authed && tab === "feedback") loadFeedback(); }, [authed, tab, loadFeedback]);

  const setFb = async (id: string, patch: Record<string, string>) => {
    await fetch("/api/admin/beta/feedback", {
      method: "PUT", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    loadFeedback();
  };

  if (authed === false) {
    return (
      <div className="min-h-screen bg-black p-10 text-white">
        <p>Not signed in. <Link className="underline" href="/admin">Log in at /admin</Link> first, then come back.</p>
      </div>
    );
  }

  const red = (r: QueueRow) => r.ageMs > 12 * 3600e3;
  const amber = (r: QueueRow) => r.ageMs > 4 * 3600e3 && !red(r);

  return (
    <div className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">TORA BETA — cockpit</h1>
          <Link href="/admin" className="text-sm text-white/50 underline">back to /admin</Link>
        </div>

        <div className="mb-6 flex gap-2">
          {(["queue", "testers", "feedback"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize ${tab === k ? "border-[#FF3366] bg-[#FF3366]/15" : "border-white/15 text-white/60"}`}>
              {k === "queue" ? `Action queue${queue ? ` (${queue.length})` : ""}` : k}
            </button>
          ))}
        </div>

        {tab === "queue" && (
          <div>
            <p className="mb-3 text-sm text-white/50">Everything waiting on a human, oldest first. Rows clear themselves when the action is taken in the app. Amber past 4h, red past 12h.</p>
            {!queue && <p className="text-white/40">Loading…</p>}
            {queue && queue.length === 0 && <p className="text-white/40">Nothing waiting. Enjoy the coffee.</p>}
            {queue && queue.map((r, i) => (
              <div key={i} className={`mb-2 flex flex-wrap items-center gap-3 rounded-lg border p-3 text-sm ${red(r) ? "border-red-500/60 bg-red-500/10" : amber(r) ? "border-amber-400/50 bg-amber-400/10" : "border-white/10 bg-white/[0.03]"}`}>
                <span className="font-semibold">{KIND_LABEL[r.kind] || r.kind}</span>
                <span className="text-white/70">{r.other}</span>
                <span className="text-white/40">→ {r.adminProfile}</span>
                {r.ref?.event && <span className="text-white/40">· {r.ref.event}</span>}
                <span className="ml-auto text-white/60">{age(r.ageMs)}</span>
                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-white/60">{r.assignee}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "testers" && (
          <div className="overflow-x-auto">
            {!testers && <p className="text-white/40">Loading…</p>}
            {testers && (
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-white/40">
                  <tr><th className="p-2">Profiles</th><th className="p-2">Wave</th><th className="p-2">Signed up</th><th className="p-2">Last active</th><th className="p-2">Tasks</th><th className="p-2">Feedback</th></tr>
                </thead>
                <tbody>
                  {testers.map((t) => (
                    <tr key={t.email} className="border-t border-white/10">
                      <td className="p-2">{t.aliases.join(" · ")}<div className="text-[11px] text-white/35">{t.email}</div></td>
                      <td className="p-2">{t.wave}</td>
                      <td className="p-2 text-white/60">{new Date(t.signedUp).toLocaleDateString()}</td>
                      <td className="p-2 text-white/60">{t.lastActive ? new Date(t.lastActive).toLocaleString() : "never"}</td>
                      <td className="p-2">{t.tasksDone} done{t.tasksSkipped ? ` · ${t.tasksSkipped} skipped` : ""}</td>
                      <td className="p-2">{t.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "feedback" && (
          <div>
            <div className="mb-3 flex gap-2">
              {["open", "triaged", "fixed", "all"].map((s) => (
                <button key={s} onClick={() => setFbStatus(s)}
                  className={`rounded-full border px-3 py-1 text-xs capitalize ${fbStatus === s ? "border-[#FF3366] bg-[#FF3366]/15" : "border-white/15 text-white/50"}`}>{s}</button>
              ))}
            </div>
            {!feedback && <p className="text-white/40">Loading…</p>}
            {feedback && feedback.length === 0 && <p className="text-white/40">Nothing here.</p>}
            {feedback && feedback.map((f) => (
              <div key={f.id} className="mb-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${f.severity === "blocked" ? "bg-red-500/25" : f.severity === "annoyed" ? "bg-amber-400/20" : "bg-white/10"}`}>{f.severity}</span>
                  <span className="text-[12px] text-white/60">{f.type}</span>
                  {f.taskCode && <span className="text-[12px] text-white/40">task {f.taskCode}</span>}
                  <span className="text-white/70">{f.alias || "?"}</span>
                  <span className="ml-auto text-[12px] text-white/40">{new Date(f.createdAt).toLocaleString()}</span>
                </div>
                <p className="my-2 whitespace-pre-wrap">{f.body}</p>
                {expanded === f.id && (
                  <div className="mb-2 rounded bg-black/40 p-2 text-[12px] text-white/60">
                    <div>screen: {f.screen} · route: {f.route} · commit: {f.commit} · wave {f.wave} · {f.role} {f.tier}</div>
                    <div>device: {f.device?.viewport} {f.device?.standalone ? "standalone" : "browser"} · {f.device?.ua?.slice(0, 90)}</div>
                    {f.lastApiError && <div>last API error: {f.lastApiError}</div>}
                    {f.sentryEventId && <div>sentry: {f.sentryEventId}</div>}
                    {(f.attachments || []).map((a, i) => (
                      <a key={i} href={a} target="_blank" rel="noreferrer" className="mr-2 underline">image {i + 1}</a>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-[12px]">
                  <button className="underline text-white/50" onClick={() => setExpanded(expanded === f.id ? null : f.id)}>{expanded === f.id ? "less" : "context"}</button>
                  {f.status === "open" && <button className="underline text-white/50" onClick={() => setFb(f.id, { status: "triaged" })}>triage</button>}
                  {f.status !== "fixed" && <button className="underline text-white/50" onClick={() => setFb(f.id, { status: "fixed" })}>mark fixed</button>}
                  <button className="underline text-white/50" onClick={() => setFb(f.id, { owner: "Alessandro" })}>→ Alessandro</button>
                  <button className="underline text-white/50" onClick={() => setFb(f.id, { owner: "Jenn" })}>→ Jenn</button>
                  <span className="text-white/35">status: {f.status}{f.owner ? ` · ${f.owner}` : ""}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
