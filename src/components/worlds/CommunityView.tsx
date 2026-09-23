import { useState } from "react";
import type { Student } from "@/data/students";
import {
  explainCommunity,
  suggestActivity,
  type Community,
  type MyProfile,
} from "@/lib/matching";

function StudentCard({ student }: { student: Student }) {
  const { firstName, year, region, languages, interests, activities } = student.public;
  return (
    <article className="card-soft p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-primary text-lg text-primary-foreground font-display">
          {firstName.trim().charAt(0)}
        </span>
        <div>
          <h3 className="text-lg leading-tight">{firstName.trim()}</h3>
          <p className="text-xs text-muted-foreground">
            {year}
            {region ? ` · ${region}` : ""}
          </p>
        </div>
      </div>
      {languages?.length ? (
        <p className="mt-4 text-xs text-muted-foreground">Speaks {languages.join(", ")}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {interests.map((i) => (
          <span key={i} className="tag">{i}</span>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Up for: {activities.join(" · ")}</p>
    </article>
  );
}

export function CommunityView({
  me,
  community,
  onRestart,
}: {
  me: MyProfile;
  community: Community;
  onRestart: () => void;
}) {
  const reasons = explainCommunity(me, community);
  const plan = suggestActivity(me, community);
  const [joined, setJoined] = useState<"in" | "out" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Your community</p>
        <h2 className="text-2xl sm:text-3xl">
          {me.firstName.trim() || "Hey"}, meet {community.members.length} people worth knowing
        </h2>
        <p className="text-sm text-muted-foreground">
          A small group, not a feed. Only what each person chose to share is shown.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {community.members.map((m) => (
          <StudentCard key={m.id} student={m} />
        ))}
      </div>

      <section className="card-soft p-6 sm:p-8">
        <h3 className="text-xl">Why this group?</h3>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          {reasons.map((r) => (
            <li key={r} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-muted-foreground">
          Built only from information everyone agreed to share. Private answers shaped the match
          but are never shown.
        </p>
      </section>

      <section className="card-soft p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Make the first connection
        </p>
        <h3 className="mt-2 text-xl">
          {plan.when}: {plan.what}.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          One low-stakes plan, chosen from what this group already has in common.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-accent" onClick={() => setJoined("in")}>I'd join</button>
          <button className="btn-quiet" onClick={() => setJoined("out")}>Not for me</button>
        </div>

        {joined === "in" && (
          <p className="mt-4 text-sm text-primary">
            Nice — we'll let the group know and confirm a spot once two more say yes.
          </p>
        )}
        {joined === "out" && (
          <p className="mt-4 text-sm text-muted-foreground">
            No problem. We'll suggest something else that fits your times.
          </p>
        )}
      </section>

      <section className="rounded-3xl bg-secondary/70 p-6 sm:p-8">
        <h3 className="text-lg">Does this group feel like a good match?</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Yes, this fits", "Close, but not quite", "Not really"].map((option) => (
            <button
              key={option}
              className={feedback === option ? "chip chip-on" : "chip"}
              onClick={() => setFeedback(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {feedback ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Thanks — that feedback tunes future groups.
          </p>
        ) : null}
        <button className="btn-quiet mt-6" onClick={onRestart}>Start over</button>
      </section>
    </div>
  );
}
