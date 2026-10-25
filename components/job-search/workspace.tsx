"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ShieldCheck,
  ExternalLink,
  Download,
  Plus,
  LoaderCircle,
} from "lucide-react";
import type { Application, CandidateProfile } from "@/lib/job-search/schema";
import {
  statuses,
  overallScore,
  postingWarnings,
  canDraft,
} from "@/lib/job-search/schema";
import { emptyWorkspace } from "@/lib/job-search/repository";
import type { JobWorkspace } from "@/lib/job-search/repository";
import { extractCV } from "@/lib/job-search/cv-import";

const field =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50";
const button =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-40";
const panel = "rounded-2xl border border-slate-800 bg-slate-900/70 p-5";
const blankProfile: CandidateProfile = {
  cv: "",
  goals:
    "QA leadership, test management and applied AI engineering roles in New Zealand or Australia.",
  constraints: "",
  writingStyle:
    "NZ English. Professional and conversational. No em dashes or generic buzzwords.",
};
const blankJob = {
  company: "",
  role: "",
  url: "",
  posting: "",
  notes: "",
  followUp: "",
};
type Snapshot = { state: JobWorkspace; version: number; aiConfigured: boolean };
async function api(body?: unknown): Promise<Snapshot> {
  const response = await fetch(
    "/api/job-search",
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : { cache: "no-store" },
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "Unable to load Job Search.");
  return result;
}
function download(name: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
function TextField({
  label,
  value,
  onChange,
  multiline = false,
  maxLength = 4000,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  multiline?: boolean;
  maxLength?: number;
  type?: string;
}) {
  return (
    <label className="block space-y-2 text-sm text-slate-300">
      <span>{label}</span>
      {multiline ? (
        <textarea
          className={field + " min-h-32"}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={field}
          type={type}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
export default function JobSearchWorkspace() {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    state: emptyWorkspace(),
    version: 0,
    aiConfigured: false,
  });
  const [profile, setProfile] = useState(blankProfile);
  const [jobInput, setJobInput] = useState(blankJob);
  const [selected, setSelected] = useState("");
  const [section, setSection] = useState<
    "applications" | "profile" | "new" | "activity"
  >("applications");
  const [busy, setBusy] = useState("load");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [consent, setConsent] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [query, setQuery] = useState("QA Lead");
  const [market, setMarket] = useState("New Zealand");
  const [filter, setFilter] = useState("");
  const job = snapshot.state.applications.find((a) => a.id === selected);

  async function importURL() {
    setBusy("import-url");
    setError("");
    setNotice("");
    try {
      const result = (await api({
        action: "import-url",
        version: snapshot.version,
        url: jobInput.url,
      })) as Snapshot & {
        imported: {
          company: string;
          role: string;
          posting: string;
          url: string;
          warnings: string[];
        };
      };
      setSnapshot(result);
      setJobInput((current) => ({
        ...current,
        company: result.imported.company,
        role: result.imported.role,
        posting: result.imported.posting,
        url: result.imported.url,
      }));
      setNotice("Job details imported. " + result.imported.warnings.join(" "));
    } catch (error) {
      setError((error as Error).message);
      try {
        setSnapshot(await api());
      } catch {
        /* Preserve existing form fields and display the error. */
      }
    } finally {
      setBusy("");
    }
  }

  async function importCV(file: File) {
    setBusy("import");
    setError("");
    setNotice("");
    try {
      const cv = await extractCV(file);
      setProfile((current) => ({ ...current, cv }));
      setNotice(
        `Imported ${file.name}. Review the text below, then click Save profile.`,
      );
    } catch (error) {
      setError(
        error instanceof Error &&
          !/password|invalid|format|zip|decode/i.test(error.message)
          ? error.message
          : "Could not read this CV. Try an unlocked, text-based PDF, a Word (.docx) document or a UTF-8 text file. Your existing CV text was kept.",
      );
    } finally {
      setBusy("");
    }
  }

  async function load() {
    setBusy("load");
    setError("");
    try {
      const value = await api();
      setSnapshot(value);
      setProfile(value.state.profile || blankProfile);
      setLoaded(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    setAcknowledged(false);
  }, [selected]);
  async function mutate(action: string, data: Record<string, unknown> = {}) {
    setBusy(action);
    setError("");
    setNotice("");
    try {
      const next = await api({ action, version: snapshot.version, ...data });
      setSnapshot(next);
      setNotice("Saved.");
      if (action === "create") {
        setJobInput(blankJob);
        setSelected(next.state.applications[0]?.id || "");
        setSection("applications");
      }
      if (action === "profile") setSection("applications");
    } catch (e) {
      setError((e as Error).message);
      // An AI attempt reserves its cooldown/version even when the provider fails.
      try {
        setSnapshot(await api());
      } catch {
        /* Keep the error visible; never claim a save. */
      }
    } finally {
      setBusy("");
    }
  }
  const available = loaded && !busy;
  const jobs = snapshot.state.applications.filter(
    (a) => !filter || a.status === filter,
  );
  const due = snapshot.state.applications.filter(
    (a) =>
      a.followUp &&
      new Date(a.followUp + "T23:59:59").getTime() < Date.now() &&
      !["Rejected", "Withdrawn", "Offer"].includes(a.status),
  ).length;
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-7 px-4 py-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Ravi Gupta AI Labs
          </Link>
          <span className="flex items-center gap-2 text-xs text-cyan-300">
            <ShieldCheck size={16} />
            Private workspace
          </span>
        </div>
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-slate-800 pb-7">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">
              Personal career workspace
            </p>
            <h1 className="flex items-center gap-3 text-3xl font-semibold sm:text-4xl">
              <BriefcaseBusiness className="text-cyan-400" />
              Job Search
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Find a role. Check the fit. Make a stronger application. Keep the
              final decision yours.
            </p>
          </div>
          <button
            className={button}
            disabled={!loaded || !!busy}
            onClick={() =>
              download(
                "job-search-backup.json",
                JSON.stringify(snapshot.state, null, 2),
                "application/json",
              )
            }
          >
            <Download size={16} />
            Export private backup
          </button>
        </header>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Saved roles", snapshot.state.applications.length],
            [
              "Applied",
              snapshot.state.applications.filter((a) => a.status === "Applied")
                .length,
            ],
            [
              "Interviews",
              snapshot.state.applications.filter(
                (a) => a.status === "Interview",
              ).length,
            ],
            ["Follow-ups due", due],
          ].map(([label, count]) => (
            <div className={panel} key={label}>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{count}</p>
            </div>
          ))}
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200"
          >
            {error}{" "}
            <button className="ml-3 underline" disabled={!!busy} onClick={load}>
              Reload
            </button>
          </div>
        )}
        <p role="status" aria-live="polite" className="text-sm text-cyan-200">
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle size={16} className="animate-spin" />
              {busy === "load"
                ? "Loading workspace…"
                : busy === "import-url"
                  ? "Reading the job advert…"
                  : busy === "import"
                    ? "Reading your CV…"
                    : "Saving or generating. AI drafts can take up to two minutes…"}
            </span>
          ) : (
            notice
          )}
        </p>
        <nav aria-label="Job search sections" className="flex flex-wrap gap-2">
          {(["applications", "profile", "new", "activity"] as const).map(
            (s) => (
              <button
                key={s}
                disabled={!available}
                aria-pressed={section === s}
                onClick={() => setSection(s)}
                className={
                  button +
                  (section === s
                    ? " border-cyan-400 bg-cyan-400/10 text-cyan-200"
                    : "")
                }
              >
                {s === "new" ? (
                  <>
                    <Plus size={16} />
                    Add role
                  </>
                ) : s === "profile" ? (
                  "My profile"
                ) : s === "activity" ? (
                  "Activity"
                ) : (
                  "Applications"
                )}
              </button>
            ),
          )}
        </nav>
        {!snapshot.state.profile && loaded && (
          <p className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100">
            Start with My profile. Browse or paste your current CV, career goals
            and work-rights or location constraints. No personal career data is
            prefilled or published.
          </p>
        )}
        {section === "profile" && (
          <form
            className={panel + " space-y-5"}
            onSubmit={(e) => {
              e.preventDefault();
              void mutate("profile", { profile });
            }}
          >
            <h2 className="text-xl font-semibold">Your source of truth</h2>
            <p className="text-sm text-slate-400">
              AI can only use evidence you provide. Updating this profile clears
              existing AI outputs and approvals, so export any drafts you want
              to retain first.
            </p>
            <label className="block rounded-xl border border-slate-700 p-4 text-sm text-slate-300">
              <span className="mb-3 block font-medium text-slate-100">
                Browse CV
              </span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                disabled={!available}
                className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:font-semibold file:text-slate-950 disabled:opacity-50"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void importCV(file);
                }}
              />
              <span className="mt-3 block text-xs text-slate-400">
                PDF, Word (.docx) or text. Maximum 5 MB. Read on your device;
                extracted text is saved only when you click Save profile. Import
                replaces the text below.
              </span>
            </label>
            <TextField
              label="Current CV and verified achievements (at least 80 characters)"
              multiline
              maxLength={40000}
              value={profile.cv}
              onChange={(cv) => setProfile({ ...profile, cv })}
            />
            <TextField
              label="Career goals and target roles"
              multiline
              value={profile.goals}
              onChange={(goals) => setProfile({ ...profile, goals })}
            />
            <TextField
              label="Constraints: work rights by country, languages, commute, salary expectations, availability"
              multiline
              value={profile.constraints}
              onChange={(constraints) =>
                setProfile({ ...profile, constraints })
              }
            />
            <TextField
              label="Writing preferences"
              multiline
              maxLength={2000}
              value={profile.writingStyle}
              onChange={(writingStyle) =>
                setProfile({ ...profile, writingStyle })
              }
            />
            <button
              className={
                button + " bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              }
              disabled={
                !available ||
                profile.cv.trim().length < 80 ||
                profile.goals.trim().length < 10
              }
            >
              Save profile
            </button>
          </form>
        )}
        {section === "new" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <section className={panel + " space-y-4"}>
              <h2 className="text-xl font-semibold">Find opportunities</h2>
              <TextField
                label="Role or keywords"
                value={query}
                onChange={setQuery}
              />
              <label className="block space-y-2 text-sm">
                <span>Market</span>
                <select
                  className={field}
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                >
                  <option>New Zealand</option>
                  <option>Australia</option>
                </select>
              </label>
              <div className="flex flex-col gap-3">
                {[
                  [
                    "SEEK",
                    `https://www.seek.${market === "Australia" ? "com.au" : "co.nz"}/${encodeURIComponent(query.trim().replace(/\s+/g, "-"))}-jobs`,
                  ],
                  [
                    "LinkedIn",
                    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(market)}`,
                  ],
                  ...(market === "New Zealand"
                    ? [
                        [
                          "Trade Me Jobs",
                          `https://www.trademe.co.nz/a/jobs/search?search_string=${encodeURIComponent(query)}`,
                        ],
                      ]
                    : []),
                ].map(([label, url]) => (
                  <a
                    className={button}
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search {label}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
              <p className="text-xs leading-5 text-slate-400">
                Find a specific advert, paste its URL and click Extract job
                details. Some sites block access or require sign-in; you can
                paste the advert when that happens. Applications are submitted
                by you.
              </p>
            </section>
            <form
              className={panel + " space-y-4"}
              onSubmit={(e) => {
                e.preventDefault();
                void mutate("create", { job: jobInput });
              }}
            >
              <h2 className="text-xl font-semibold">Save a role</h2>
              <TextField
                label="Job advert URL (HTTPS)"
                maxLength={2000}
                value={jobInput.url}
                onChange={(url) => setJobInput({ ...jobInput, url })}
              />
              <button
                type="button"
                className={button + " border-cyan-400 text-cyan-200"}
                disabled={!available || !jobInput.url.trim()}
                onClick={() => void importURL()}
              >
                Extract job details
              </button>
              <p className="text-xs text-slate-400">
                Import fills the fields below for review, replacing their
                current contents. Only the public job URL is sent to the site;
                your CV stays private. You can also enter details manually.
              </p>
              <TextField
                label="Company"
                maxLength={200}
                value={jobInput.company}
                onChange={(company) => setJobInput({ ...jobInput, company })}
              />
              <TextField
                label="Role title"
                maxLength={200}
                value={jobInput.role}
                onChange={(role) => setJobInput({ ...jobInput, role })}
              />
              <TextField
                label="Full job advert (plain text, at least 80 characters)"
                multiline
                maxLength={40000}
                value={jobInput.posting}
                onChange={(posting) => setJobInput({ ...jobInput, posting })}
              />
              <button
                className={button}
                disabled={
                  !available ||
                  !jobInput.company.trim() ||
                  !jobInput.role.trim() ||
                  jobInput.posting.trim().length < 80
                }
              >
                Save role
              </button>
            </form>
          </div>
        )}
        {section === "applications" && (
          <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
            <section className={panel + " space-y-4"}>
              <label className="block space-y-2 text-sm">
                <span>Filter applications</span>
                <select
                  className={field}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {jobs.length === 0 && (
                <p className="py-8 text-sm text-slate-400">
                  No roles here yet. Use Add role to start.
                </p>
              )}
              <ul className="space-y-2">
                {jobs.map((a) => (
                  <li key={a.id}>
                    <button
                      disabled={!!busy}
                      onClick={() => setSelected(a.id)}
                      aria-pressed={selected === a.id}
                      className={
                        "w-full rounded-xl border p-3 text-left " +
                        (selected === a.id
                          ? "border-cyan-400 bg-cyan-400/5"
                          : "border-slate-800 hover:border-slate-600")
                      }
                    >
                      <p className="font-medium">{a.role}</p>
                      <p className="mt-1 text-sm text-slate-400">{a.company}</p>
                      <p className="mt-3 text-xs text-cyan-200">
                        {a.status}
                        {a.evaluation && overallScore(a.evaluation) !== null
                          ? ` · ${overallScore(a.evaluation)}/100 fit`
                          : ""}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            {job ? (
              <ApplicationDetail
                key={job.id + ":" + job.version}
                job={job}
                busy={!!busy}
                aiReady={snapshot.aiConfigured && !!snapshot.state.profile}
                consent={consent}
                setConsent={setConsent}
                acknowledged={acknowledged}
                setAcknowledged={setAcknowledged}
                mutate={mutate}
              />
            ) : (
              <section className={panel + " py-20 text-center text-slate-400"}>
                Select a saved role to evaluate, draft or prepare.
              </section>
            )}
          </div>
        )}
        {section === "activity" && (
          <section className={panel}>
            <h2 className="mb-5 text-xl font-semibold">
              Recent workspace activity
            </h2>
            <p className="mb-4 text-sm text-slate-400">
              Last 300 actions. Provider requests record prompt version and
              model. This is personal activity history, not a tamper-proof
              compliance log.
            </p>
            <ul className="divide-y divide-slate-800">
              {snapshot.state.activity
                .slice()
                .reverse()
                .map((a, i) => (
                  <li className="py-3 text-sm" key={i}>
                    <time className="mr-3 text-slate-400">
                      {new Date(a.at).toLocaleString()}
                    </time>
                    {a.action}
                    <span className="ml-3 text-xs text-cyan-200">
                      {a.promptVersion} {a.model}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        )}
        <footer className="border-t border-slate-800 py-5 text-xs leading-6 text-slate-500">
          Adapted from{" "}
          <a
            className="underline"
            href="https://github.com/ai-job-search-dev/ai-job-search"
            target="_blank"
            rel="noopener noreferrer"
          >
            AI Job Search by Mads Lorentzen
          </a>{" "}
          under the MIT licence. Browser workflow by Ravi Gupta AI Labs. AI
          output needs your review. Downloaded backups contain personal career
          information.
        </footer>
      </div>
    </main>
  );
}

function ApplicationDetail({
  job,
  busy,
  aiReady,
  consent,
  setConsent,
  acknowledged,
  setAcknowledged,
  mutate,
}: {
  job: Application;
  busy: boolean;
  aiReady: boolean;
  consent: boolean;
  setConsent: (v: boolean) => void;
  acknowledged: boolean;
  setAcknowledged: (v: boolean) => void;
  mutate: (action: string, data: Record<string, unknown>) => Promise<void>;
}) {
  const [status, setStatus] = useState(job.status);
  const [notes, setNotes] = useState(job.notes);
  const [followUp, setFollowUp] = useState(job.followUp);
  const [cv, setCv] = useState(job.draft?.cv || "");
  const [letter, setLetter] = useState(job.draft?.coverLetter || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const warnings = postingWarnings(job.posting);
  const aiDisabled =
    busy || !aiReady || !consent || (warnings.length > 0 && !acknowledged);
  const e = job.evaluation;
  return (
    <section className="space-y-5">
      <div className={panel + " space-y-4"}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{job.role}</h2>
            <p className="mt-1 text-slate-400">{job.company}</p>
          </div>
          {job.url && (
            <a
              className={button}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Original advert
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        <details>
          <summary className="cursor-pointer text-sm text-cyan-200">
            View saved advert
          </summary>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
            {job.posting}
          </p>
        </details>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span>Application status</span>
            <select
              className={field}
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Application["status"])
              }
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <TextField
            label="Follow-up date"
            type="date"
            value={followUp}
            onChange={setFollowUp}
          />
        </div>
        <TextField
          label="Private notes and interview feedback"
          multiline
          maxLength={5000}
          value={notes}
          onChange={setNotes}
        />
        <button
          disabled={busy}
          className={button}
          onClick={() =>
            mutate("update", { id: job.id, status, notes, followUp })
          }
        >
          Save tracking
        </button>
        <p className="text-xs text-slate-400">
          Applied records a submission you made yourself. Review and confirm
          your draft first.
        </p>
      </div>
      <div className={panel + " space-y-4"}>
        <h3 className="font-semibold">AI workflow</h3>
        <p className="text-sm text-slate-400">
          Evaluate first, draft and review second, prepare for interview third.
          Re-evaluating clears earlier drafts and approvals. Confidence is an AI
          estimate of evidence quality, not your chance of getting hired.
        </p>
        {!aiReady && (
          <p className="text-sm text-amber-200">
            Save your profile and configure the server OpenAI key to enable AI.
          </p>
        )}
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>
            Send my saved CV, profile, this advert and prior application outputs
            to OpenAI for the requested analysis. API response storage is
            disabled.
          </span>
        </label>
        {warnings.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 p-3 text-sm text-amber-200">
            <ul>
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <label className="mt-3 flex gap-2">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
              />
              I inspected this text and want to continue.
            </label>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {(["evaluate", "draft", "interview"] as const).map((action) => (
            <button
              className={button}
              disabled={aiDisabled || (action === "draft" && !canDraft(e))}
              key={action}
              onClick={() =>
                mutate(action, {
                  id: job.id,
                  consent: true,
                  acknowledgeWarnings: acknowledged,
                })
              }
            >
              {action === "evaluate"
                ? "Evaluate fit"
                : action === "draft"
                  ? "Draft + AI review"
                  : "Prepare interview"}
            </button>
          ))}
        </div>
      </div>
      {e && (
        <div className={panel + " space-y-4"}>
          <h3 className="text-xl font-semibold">
            Fit assessment{" "}
            {overallScore(e) !== null
              ? `${overallScore(e)}/100`
              : "· score unavailable"}
          </h3>
          <p className="text-sm text-slate-400">
            Evidence confidence {e.confidence}/100 · Risk {e.risk}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Fit scores and source evidence
              </caption>
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-2">Check</th>
                  <th className="p-2">Result</th>
                  <th className="p-2">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    "eligibility",
                    "language",
                    "logistics",
                    "technical",
                    "experience",
                    "culture",
                    "career",
                  ] as const
                ).map((key) => (
                  <tr className="border-b border-slate-800" key={key}>
                    <th className="p-2 capitalize">{key}</th>
                    <td className="p-2">
                      {String(
                        "verdict" in e[key]
                          ? e[key].verdict
                          : "score" in e[key]
                            ? (e[key].score ?? "Unknown")
                            : "Unknown",
                      )}
                    </td>
                    <td className="p-2 text-slate-300">{e[key].evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {[
            ["Strengths", e.strengths],
            ["Gaps", e.gaps],
            ["Questions to resolve", e.questions],
          ].map(([label, items]) => (
            <div key={label as string}>
              <h4 className="mb-2 font-medium">{label as string}</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                {(items as string[]).map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-sm text-cyan-200">{e.recommendation}</p>
        </div>
      )}
      {job.draft && (
        <div className={panel + " space-y-4"}>
          <h3 className="text-xl font-semibold">Your application draft</h3>
          <p className="text-sm text-slate-300">
            AI reviewer: {job.draft.review}
          </p>
          {job.draft.warnings.map((w, i) => (
            <p key={i} className="text-sm text-amber-200">
              {w}
            </p>
          ))}
          <TextField
            label="Tailored CV: edit before confirming"
            multiline
            maxLength={40000}
            value={cv}
            onChange={setCv}
          />
          <TextField
            label="Cover letter: edit before confirming"
            multiline
            maxLength={20000}
            value={letter}
            onChange={setLetter}
          />
          <div className="flex flex-wrap gap-2">
            <button
              className={button}
              disabled={busy || !cv.trim() || !letter.trim()}
              onClick={() =>
                mutate("review", {
                  id: job.id,
                  draft: { cv, coverLetter: letter },
                })
              }
            >
              I checked the claims. Save reviewed draft.
            </button>
            <button
              className={button}
              onClick={() => download("tailored-cv.txt", cv)}
            >
              Download CV
            </button>
            <button
              className={button}
              onClick={() => download("cover-letter.txt", letter)}
            >
              Download cover letter
            </button>
            <button className={button} onClick={() => window.print()}>
              Print / save page as PDF
            </button>
          </div>
          <p className="text-xs text-cyan-200">
            {job.reviewed &&
            cv === job.draft.cv &&
            letter === job.draft.coverLetter
              ? "Saved version reviewed by you."
              : "Human review pending. Confirm after your edits."}
          </p>
        </div>
      )}
      {job.interview && (
        <div className={panel + " space-y-4"}>
          <h3 className="text-xl font-semibold">Interview preparation</h3>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {job.interview.preparation}
          </p>
          {job.interview.gaps.map((g, i) => (
            <p key={i} className="text-sm text-amber-200">
              {g}
            </p>
          ))}
          <button
            className={button}
            onClick={() =>
              download(
                "interview-preparation.txt",
                job.interview!.preparation +
                  "\n\nGaps\n" +
                  job.interview!.gaps.join("\n"),
              )
            }
          >
            Download preparation
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 p-3 text-xs text-slate-500">
        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={confirmDelete}
            onChange={(event) => setConfirmDelete(event.target.checked)}
          />
          Delete this role and its generated outputs
        </label>
        <button
          className={button + " text-rose-300"}
          disabled={busy || !confirmDelete}
          onClick={() => mutate("delete", { id: job.id })}
        >
          Delete role
        </button>
      </div>
    </section>
  );
}
