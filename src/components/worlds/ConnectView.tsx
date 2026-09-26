import { useState, type ChangeEvent } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Cpu,
  Laptop,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
  Video,
} from "lucide-react";
import {
  AVAILABILITY,
  COLLEGES,
  CONNECTION_GOALS,
  INTERESTS,
  MEET_PREFERENCES,
  NETWORK_STUDENTS,
  type Availability,
  type College,
  type ConnectionGoal,
  type Interest,
  type MeetPreference,
  type MyNetworkProfile,
} from "@/data/network";
import {
  rankIntroductions,
  rankIntroductionsWithLocalAI,
  safeIntroductionReasons,
  suggestedVirtualWindows,
  type IntroductionMatch,
} from "@/lib/introductions";
import { NetworkMap } from "./NetworkMap";

const starterProfile: MyNetworkProfile = {
  firstName: "Michelle",
  college: "Smith College",
  interests: ["Entrepreneurship", "Technology", "Hiking"],
  goals: ["Meet students at other colleges", "Weekend plans"],
  availability: ["Saturday afternoon", "Sunday afternoon"],
  meetPreference: "Either",
};

const starterIntent =
  "I want to meet students at other colleges who like building things and would also be up for exploring off campus on weekends.";

type AiStatus = "idle" | "loading" | "ready" | "fallback";

function MultiSelect<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            className={active ? "chip chip-on" : "chip"}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function ConnectView() {
  const [profile, setProfile] = useState<MyNetworkProfile>(starterProfile);
  const [privateIntent, setPrivateIntent] = useState(starterIntent);
  const [matches, setMatches] = useState<IntroductionMatch[]>(() =>
    rankIntroductions(starterProfile, NETWORK_STUDENTS),
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [matchIndex, setMatchIndex] = useState(0);
  const [requestState, setRequestState] = useState<"idle" | "intro" | "virtual">("idle");
  const [aiStatus, setAiStatus] = useState<AiStatus>("idle");
  const [aiError, setAiError] = useState("");

  const current = matches[matchIndex] ?? null;

  const toggle = <
    K extends "interests" | "goals" | "availability",
    V extends MyNetworkProfile[K][number],
  >(
    key: K,
    value: V,
  ) => {
    setProfile((previous) => {
      const values = previous[key] as V[];
      const next = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];

      return { ...previous, [key]: next };
    });
  };

  const search = async () => {
    setHasSearched(true);
    setMatchIndex(0);
    setRequestState("idle");
    setAiError("");

    if (!privateIntent.trim()) {
      setMatches(rankIntroductions(profile, NETWORK_STUDENTS));
      setAiStatus("fallback");
      return;
    }

    setAiStatus("loading");

    try {
      const ranked = await rankIntroductionsWithLocalAI(profile, NETWORK_STUDENTS, privateIntent);
      setMatches(ranked);
      setAiStatus("ready");
    } catch (error) {
      console.error("Local embedding model failed to load", error);
      setMatches(rankIntroductions(profile, NETWORK_STUDENTS));
      setAiStatus("fallback");
      setAiError(
        "The local model could not load, so this result is using the transparent rule-based matcher instead.",
      );
    }
  };

  const nextMatch = () => {
    if (matches.length === 0) {
      return;
    }

    setMatchIndex((index) => (index + 1) % matches.length);
    setRequestState("idle");
  };

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Connect across campuses
        </p>
        <h1 className="mt-3 font-sans text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          Describe who you want to meet. Keep the reasoning private.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          A small language model runs in your browser to understand your free-text intent. Explicit
          preferences still control availability, cross-campus fit, and meeting format.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="card-soft p-6 sm:p-7">
          <div className="flex items-center gap-2">
            <UserRoundSearch className="size-5 text-primary" />
            <h2 className="font-sans text-lg font-semibold">What would be useful right now?</h2>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="college">
                Your college
              </label>
              <select
                id="college"
                className="field"
                value={profile.college}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  setProfile((previous) => ({
                    ...previous,
                    college: event.target.value as College,
                  }))
                }
              >
                {COLLEGES.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="private-intent">
                In your own words, who would you like to meet?
              </label>
              <textarea
                id="private-intent"
                className="field min-h-28 resize-y"
                value={privateIntent}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setPrivateIntent(event.target.value)
                }
                placeholder="For example: I want someone who likes building projects, is open to spontaneous weekend plans, and studies at another college."
              />
              <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
                This text is used for matching only. It is never displayed to another student.
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/7 p-4">
              <div className="flex items-start gap-3">
                <Cpu className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">Local AI matching</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    On first use, the browser downloads a small MiniLM embedding model. Your text is
                    then processed on-device with no AI API key.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Interests</p>
              <MultiSelect<Interest>
                options={INTERESTS}
                selected={profile.interests}
                onToggle={(value) => toggle("interests", value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">What kind of connection are you looking for?</p>
              <MultiSelect<ConnectionGoal>
                options={CONNECTION_GOALS}
                selected={profile.goals}
                onToggle={(value) => toggle("goals", value)}
              />
              <div className="flex items-start gap-2 pt-1 text-xs leading-5 text-muted-foreground">
                <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
                These goals influence matching but are not shown on your public introduction card.
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">When are you usually free?</p>
              <MultiSelect<Availability>
                options={AVAILABILITY}
                selected={profile.availability}
                onToggle={(value) => toggle("availability", value)}
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Other students only see that your schedules overlap. They do not see your full
                availability.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">How would you like to meet?</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {MEET_PREFERENCES.map((preference) => (
                  <button
                    key={preference}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      profile.meetPreference === preference
                        ? "border-primary bg-primary/8 text-primary"
                        : "border-border bg-card hover:bg-secondary/70"
                    }`}
                    onClick={() =>
                      setProfile((previous) => ({
                        ...previous,
                        meetPreference: preference as MeetPreference,
                      }))
                    }
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary w-full"
              disabled={
                aiStatus === "loading" ||
                profile.interests.length === 0 ||
                profile.goals.length === 0 ||
                profile.availability.length === 0
              }
              onClick={() => void search()}
            >
              {aiStatus === "loading" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Loading local model and ranking
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Find one introduction
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </section>

        <div className="space-y-4">
          {!hasSearched ? (
            <section className="grid min-h-[520px] place-items-center rounded-[1.2rem] border border-dashed border-border bg-card/60 p-8 text-center">
              <div className="max-w-sm">
                <Building2 className="mx-auto size-9 text-muted-foreground" />
                <h2 className="mt-5 font-sans text-xl font-semibold">
                  No profiles to swipe through
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Describe what you need. Worlds Together combines semantic similarity with explicit
                  privacy-aware matching rules and surfaces one cross-campus introduction.
                </p>
              </div>
            </section>
          ) : current ? (
            <>
              <section className="card-soft p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        Suggested introduction
                      </p>
                      {aiStatus === "ready" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/7 px-2 py-1 text-[11px] font-medium text-primary">
                          <Cpu className="size-3" />
                          Local AI
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight">
                      {current.student.public.firstName}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {current.student.public.college} · {current.student.public.year}
                    </p>
                  </div>
                  <span className="rounded-lg border border-border bg-secondary/60 px-3 py-2 text-xs font-medium">
                    {current.student.public.meetPreference}
                  </span>
                </div>

                <p className="mt-6 text-sm leading-6">{current.student.public.introLine}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {current.student.public.interests.map((interest) => (
                    <span key={interest} className="tag">
                      {interest}
                    </span>
                  ))}
                </div>

                {current.usedLocalAI && current.semanticSimilarity !== undefined && (
                  <div className="mt-6 rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Semantic compatibility
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {Math.round(current.semanticSimilarity * 100)}% model similarity
                        </p>
                      </div>
                      <Sparkles className="size-5 text-primary" />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      This score comes from vector similarity between private matching descriptions.
                      The text itself stays hidden.
                    </p>
                  </div>
                )}

                <div className="mt-7 rounded-xl border border-border bg-secondary/45 p-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    <h3 className="font-sans text-sm font-semibold">
                      Why Worlds Together surfaced this person
                    </h3>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {safeIntroductionReasons(current).map((reason) => (
                      <li
                        key={reason}
                        className="flex gap-2 text-sm leading-6 text-muted-foreground"
                      >
                        <Check className="mt-1 size-4 shrink-0 text-primary" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {aiError && (
                  <p className="mt-4 rounded-xl border border-border bg-secondary/50 p-4 text-xs leading-5 text-muted-foreground">
                    {aiError}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="btn-primary" onClick={() => setRequestState("intro")}>
                    Request introduction
                  </button>
                  <button className="btn-quiet" onClick={() => setRequestState("virtual")}>
                    <Video className="size-4" />
                    Meet virtually first
                  </button>
                  <button className="btn-quiet" onClick={nextMatch}>
                    <RefreshCw className="size-4" />
                    Show another
                  </button>
                </div>

                {requestState === "intro" && (
                  <div className="mt-5 rounded-xl border border-primary/25 bg-primary/7 p-4 text-sm leading-6">
                    <p className="font-medium text-primary">Introduction requested.</p>
                    <p className="mt-1 text-muted-foreground">
                      In the real product, they would choose whether to accept before any private
                      contact information is shared.
                    </p>
                  </div>
                )}

                {requestState === "virtual" && (
                  <div className="mt-5 rounded-xl border border-primary/25 bg-primary/7 p-4">
                    <div className="flex items-center gap-2">
                      <Laptop className="size-4 text-primary" />
                      <p className="text-sm font-medium">Virtual-first introduction</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Suggested overlap:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {suggestedVirtualWindows(current).map((window) => (
                        <span key={window} className="tag">
                          {window}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      A real version would share a scheduling request only after both students opt
                      in.
                    </p>
                  </div>
                )}
              </section>

              <NetworkMap matches={matches} activeStudentId={current.student.id} />

              <p className="px-1 text-xs leading-5 text-muted-foreground">
                Synthetic profiles only. AI contributes semantic similarity, while explicit rules
                still handle privacy, availability, and cross-campus constraints.
              </p>
            </>
          ) : (
            <section className="card-soft p-8">
              <p className="text-sm text-muted-foreground">
                No introduction is available for this combination yet.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
