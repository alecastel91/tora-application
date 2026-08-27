"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * /admin/beta — the daily beta cockpit (TORA_BETA_BRIEF Build Item 4).
 * Views: Action queue, Testers, Task matrix, Feedback inbox.
 *
 * Has its OWN login (same endpoint as /admin): ADMIN_PASSWORD gives the
 * full scope, BETA_ADMIN_PASSWORD (Jenn) gives a session that can use
 * only this page — the proxy blocks every other /api/admin route for it.
 */

interface QueueRow { kind: string; adminProfile: string; assignee: string; other: string; since: string; ageMs: number; ref: { dealId?: string; event?: string } }
interface TesterRow { trackerId: string; kind: string; wave: number; plannedAliases: string[]; plannedProfiles: string; tierAtStart: string; code: string; email: string | null; status: "awaiting_email" | "invited" | "signed_up"; signedUp: string | null; lastActive: string | null; liveAliases: string[] | null; tasksDone: number; tasksSkipped: number; feedback: number; notes: string }
interface MatrixTask { code: string; group: string }
interface MatrixRow { profileId: string; alias: string; role: string; tier: string | null; city: string; country: string; email: string; wave: number; lastActive: string | null; cells: Record<string, string> }
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

const ROLE_COLORS: Record<string, string> = { ARTIST: "#6B5FFF", AGENT: "#00C875", PROMOTER: "#FFB800", VENUE: "#FF5757" };
const INFRARED = "#FF3366";

const age = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(ms / 60000))}m`;
  if (h < 48) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{children}</span>
);

export default function AdminBetaPage() {
  const [tab, setTab] = useState<"queue" | "testers" | "matrix" | "feedback">("queue");
  const [queue, setQueue] = useState<QueueRow[] | null>(null);
  const [testers, setTesters] = useState<TesterRow[] | null>(null);
  const [matrix, setMatrix] = useState<{ tasks: MatrixTask[]; rows: MatrixRow[]; footers: Record<string, { done: number; total: number }> } | null>(null);
  const [feedback, setFeedback] = useState<FeedbackRow[] | null>(null);
  const [fbStatus, setFbStatus] = useState("open");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((r) => r.json()).then((d) => setAuthed(!!d.authenticated)).catch(() => setAuthed(false));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); setPassword(""); }
    else setLoginError("Wrong password.");
  };

  const loadQueue = useCallback(() => {
    fetch("/api/admin/beta/queue", { credentials: "include" })
      .then((r) => r.json()).then((d) => setQueue(d.rows || [])).catch(() => {});
  }, []);
  const loadTesters = useCallback(() => {
    fetch("/api/admin/beta/testers", { credentials: "include" })
      .then((r) => r.json()).then((d) => setTesters(d.rows || [])).catch(() => {});
  }, []);
  const loadMatrix = useCallback(() => {
    fetch("/api/admin/beta/matrix", { credentials: "include" })
      .then((r) => r.json()).then((d) => setMatrix(d.tasks ? d : null)).catch(() => {});
  }, []);
  const loadFeedback = useCallback(() => {
    const qs = fbStatus === "all" ? "" : `?status=${fbStatus}`;
    fetch(`/api/admin/beta/feedback${qs}`, { credentials: "include" })
      .then((r) => r.json()).then((d) => setFeedback(d.rows || [])).catch(() => {});
  }, [fbStatus]);

  useEffect(() => {
    if (!authed) return;
    loadQueue();
    const t = setInterval(loadQueue, 60000);
    return () => clearInterval(t);
  }, [authed, loadQueue]);
  useEffect(() => { if (authed && tab === "testers") loadTesters(); }, [authed, tab, loadTesters]);
  useEffect(() => { if (authed && tab === "matrix") loadMatrix(); }, [authed, tab, loadMatrix]);
  useEffect(() => { if (authed && tab === "feedback") loadFeedback(); }, [authed, tab, loadFeedback]);

  const setFb = async (id: string, patch: Record<string, string>) => {
    await fetch("/api/admin/beta/feedback", {
      method: "PUT", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    loadFeedback();
  };

  const attachEmail = async (trackerId: string) => {
    const email = window.prompt(`Email for ${trackerId}? (creates the invitation code mapping; sending the email stays manual)`);
    if (!email) return;
    const res = await fetch(`/api/admin/beta/testers/${trackerId}/email`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      window.alert(d.error || "Could not attach email");
    }
    loadTesters();
  };

  const exportCsv = () => {
    if (!feedback) return;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["createdAt", "alias", "role", "tier", "wave", "type", "severity", "status", "owner", "taskCode", "screen", "route", "commit", "body", "lastApiError"];
    const lines = [head.join(","), ...feedback.map((f) => head.map((h) => esc((f as unknown as Record<string, unknown>)[h])).join(","))];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tora-beta-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (authed === null) return <div className="min-h-screen bg-[#0a0a0a]" />;

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <Image src="/tora_logo_v2.png" alt="TORA" width={120} height={34} className="mx-auto mb-2" />
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Beta cockpit</p>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" autoFocus
            className="mb-3 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#FF3366]/60"
          />
          {loginError && <p className="mb-3 text-sm" style={{ color: INFRARED }}>{loginError}</p>}
          <button type="submit" className="w-full rounded-xl py-3 font-semibold text-white" style={{ background: INFRARED }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  const red = (r: QueueRow) => r.ageMs > 12 * 3600e3;
  const amber = (r: QueueRow) => r.ageMs > 4 * 3600e3 && !red(r);

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3"><Image src="/tora_logo_v2.png" alt="TORA" width={110} height={31} /><span className="text-xl font-bold tracking-[0.14em]" style={{ color: INFRARED }}>BETA</span></div>
            <Label>Cockpit</Label>
          </div>
          <Link href="/admin" className="text-xs text-white/40 underline hover:text-white/70">/admin</Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["queue", "testers", "matrix", "feedback"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)}
              className="rounded-full border px-4 py-1.5 text-[13px] capitalize transition-colors"
              style={tab === k
                ? { borderColor: INFRARED, background: "rgba(255,51,102,0.14)" }
                : { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)" }}>
              {k === "queue" ? `Action queue${queue ? ` (${queue.length})` : ""}` : k === "matrix" ? "Task matrix" : k}
            </button>
          ))}
        </div>

        {tab === "queue" && (
          <div>
            <p className="mb-4 text-[13px] text-white/45">Everything waiting on a human, oldest first. Rows clear themselves when the action is taken in the app. Amber past 4h, red past 12h.</p>
            {!queue && <p className="text-white/40">Loading…</p>}
            {queue && queue.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">Nothing waiting. Enjoy the coffee.</div>
            )}
            {queue && queue.map((r, i) => (
              <div key={i} className="mb-2 flex flex-wrap items-center gap-3 rounded-xl border p-3.5 text-sm"
                style={red(r) ? { borderColor: "rgba(255,80,80,0.6)", background: "rgba(255,80,80,0.08)" }
                  : amber(r) ? { borderColor: "rgba(255,184,0,0.5)", background: "rgba(255,184,0,0.07)" }
                  : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <span className="font-semibold">{KIND_LABEL[r.kind] || r.kind}</span>
                <span className="text-white/75">{r.other}</span>
                <span className="text-white/40">→ {r.adminProfile}</span>
                {r.ref?.event && <span className="text-white/40">· {r.ref.event}</span>}
                <span className="ml-auto font-mono text-white/60">{age(r.ageMs)}</span>
                <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/60">{r.assignee}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "testers" && (
          <div>
            <p className="mb-4 text-[13px] text-white/45">The full planned cohort from the tracker, mapped before anyone signs up. Attach an email to a row to bind its invitation code; the row then tracks sign-up and activity automatically. Sending the invitation email stays manual.</p>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              {!testers && <p className="p-6 text-white/40">Loading…</p>}
              {testers && testers.length > 0 && (
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["ID", "Alias profiles (planned)", "Tier", "Code", "Email", "Status", "Last active", "Tasks", "FB"].map((h) => (
                        <th key={h} className="p-3 whitespace-nowrap"><Label>{h}</Label></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {testers.map((t) => (
                      <tr key={t.trackerId} className="border-b border-white/5 last:border-0 align-top">
                        <td className="p-3 whitespace-nowrap font-mono text-[12px] text-white/60">
                          {t.trackerId}
                          <div className="text-[10px] text-white/30">W{t.wave}{t.kind === "ADMIN" ? " · admin" : ""}</div>
                        </td>
                        <td className="p-3">
                          {(t.liveAliases || t.plannedAliases).join(" · ") || "—"}
                          <div className="text-[10px] text-white/30">{t.plannedProfiles}{t.notes ? ` · ${t.notes}` : ""}</div>
                        </td>
                        <td className="p-3 text-white/60">{t.tierAtStart}</td>
                        <td className="p-3 font-mono text-[11px] text-white/50">{t.code}</td>
                        <td className="p-3">
                          {t.email
                            ? <span className="text-white/70">{t.email}</span>
                            : <button className="text-[12px] underline" style={{ color: INFRARED }} onClick={() => attachEmail(t.trackerId)}>+ add email</button>}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                            style={t.status === "signed_up" ? { background: "rgba(67,233,123,0.2)", color: "#43E97B" }
                              : t.status === "invited" ? { background: "rgba(255,184,0,0.18)", color: "#FFB800" }
                              : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                            {t.status === "signed_up" ? "Signed up" : t.status === "invited" ? "Invited" : "Awaiting email"}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap text-white/60">{t.lastActive ? new Date(t.lastActive).toLocaleString() : "—"}</td>
                        <td className="p-3 whitespace-nowrap">{t.status === "signed_up" ? `${t.tasksDone}✓${t.tasksSkipped ? ` ${t.tasksSkipped}–` : ""}` : "—"}</td>
                        <td className="p-3">{t.status === "signed_up" ? t.feedback : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === "matrix" && (
          <div>
            <p className="mb-4 text-[13px] text-white/45">Testers down, tasks across. Read the columns: an empty column for everyone is a broken step in the product, not a lazy cohort.</p>
            {!matrix && <p className="text-white/40">Loading…</p>}
            {matrix && matrix.rows.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">No tester profiles yet — the grid fills as Wave 1 signs up.</div>
            )}
            {matrix && matrix.rows.length > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] p-2">
                <table className="border-separate" style={{ borderSpacing: 2 }}>
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 bg-[#0f0f12] p-2 text-left"><Label>Tester</Label></th>
                      {matrix.tasks.map((t) => (
                        <th key={t.code} className="p-1 text-center align-bottom">
                          <span className="text-[10px] font-mono text-white/45">{t.code}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.rows.map((r) => (
                      <tr key={r.profileId}>
                        <td className="sticky left-0 z-10 whitespace-nowrap bg-[#0f0f12] p-2 pr-4">
                          <span className="font-medium">{r.alias}</span>
                          <span className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: `${ROLE_COLORS[r.role]}22`, color: ROLE_COLORS[r.role] }}>{r.role}</span>
                          <div className="text-[10px] text-white/30">W{r.wave} · {r.city} · {r.tier || "FREE"}</div>
                        </td>
                        {matrix.tasks.map((t) => {
                          const c = r.cells[t.code];
                          return (
                            <td key={t.code} title={`${r.alias} · ${t.code} · ${c}`}
                              className="h-6 w-6 rounded"
                              style={{
                                background: c === "done" ? "rgba(67,233,123,0.75)"
                                  : c === "skipped" ? "rgba(255,184,0,0.4)"
                                  : c === "na" ? "rgba(255,255,255,0.03)"
                                  : "rgba(255,255,255,0.1)",
                              }} />
                          );
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td className="sticky left-0 z-10 bg-[#0f0f12] p-2"><Label>Done / applicable</Label></td>
                      {matrix.tasks.map((t) => {
                        const f = matrix.footers[t.code];
                        const rate = f && f.total ? f.done / f.total : 0;
                        return (
                          <td key={t.code} className="p-1 text-center">
                            <span className="text-[9px] font-mono" style={{ color: rate === 0 ? "rgba(255,80,80,0.9)" : rate < 0.5 ? "rgba(255,184,0,0.9)" : "rgba(67,233,123,0.9)" }}>
                              {f ? `${f.done}/${f.total}` : "–"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 flex gap-4 px-2 pb-1 text-[11px] text-white/40">
                  <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "rgba(67,233,123,0.75)" }} /> done</span>
                  <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "rgba(255,184,0,0.4)" }} /> skipped</span>
                  <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "rgba(255,255,255,0.1)" }} /> to do</span>
                  <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "rgba(255,255,255,0.03)" }} /> not applicable</span>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "feedback" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {["open", "triaged", "fixed", "all"].map((s) => (
                <button key={s} onClick={() => setFbStatus(s)}
                  className="rounded-full border px-3 py-1 text-xs capitalize"
                  style={fbStatus === s ? { borderColor: INFRARED, background: "rgba(255,51,102,0.14)" } : { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.5)" }}>{s}</button>
              ))}
              <button onClick={exportCsv} className="ml-auto rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:text-white">Export CSV</button>
            </div>
            {!feedback && <p className="text-white/40">Loading…</p>}
            {feedback && feedback.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">Nothing here.</div>
            )}
            {feedback && feedback.map((f) => (
              <div key={f.id} className="mb-2 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={f.severity === "blocked" ? { background: "rgba(255,80,80,0.3)" } : f.severity === "annoyed" ? { background: "rgba(255,184,0,0.22)" } : { background: "rgba(255,255,255,0.1)" }}>
                    {f.severity}
                  </span>
                  <span className="text-[12px] text-white/60">{f.type}</span>
                  {f.taskCode && <span className="font-mono text-[11px] text-white/40">{f.taskCode}</span>}
                  <span className="text-white/75">{f.alias || "?"}</span>
                  <span className="ml-auto text-[12px] text-white/35">{new Date(f.createdAt).toLocaleString()}</span>
                </div>
                <p className="my-2 whitespace-pre-wrap text-white/90">{f.body}</p>
                {expanded === f.id && (
                  <div className="mb-2 rounded-lg bg-black/50 p-2.5 font-mono text-[11.5px] leading-relaxed text-white/55">
                    <div>screen {f.screen} · route {f.route} · commit {f.commit} · W{f.wave} · {f.role} {f.tier}</div>
                    <div>{f.device?.viewport} {f.device?.standalone ? "standalone" : "browser"} · {f.device?.ua?.slice(0, 90)}</div>
                    {f.lastApiError && <div style={{ color: "rgba(255,120,120,0.9)" }}>last API error: {f.lastApiError}</div>}
                    {f.sentryEventId && <div>sentry {f.sentryEventId}</div>}
                    {(f.attachments || []).map((a, i) => (
                      <a key={i} href={a} target="_blank" rel="noreferrer" className="mr-3 underline">image {i + 1}</a>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 text-[12px] text-white/50">
                  <button className="underline" onClick={() => setExpanded(expanded === f.id ? null : f.id)}>{expanded === f.id ? "less" : "context"}</button>
                  {f.status === "open" && <button className="underline" onClick={() => setFb(f.id, { status: "triaged" })}>triage</button>}
                  {f.status !== "fixed" && <button className="underline" onClick={() => setFb(f.id, { status: "fixed" })}>mark fixed</button>}
                  <button className="underline" onClick={() => setFb(f.id, { owner: "Alessandro" })}>→ Alessandro</button>
                  <button className="underline" onClick={() => setFb(f.id, { owner: "Jenn" })}>→ Jenn</button>
                  <span className="text-white/30">status {f.status}{f.owner ? ` · ${f.owner}` : ""}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
