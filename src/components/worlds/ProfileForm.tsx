import { useState } from "react";
import {
  ACTIVITY_OPTIONS,
  AVAILABILITY_OPTIONS,
  GOAL_OPTIONS,
  INTEREST_OPTIONS,
  LANGUAGE_OPTIONS,
  YEARS,
  type Availability,
  type SocialGoal,
} from "@/data/students";
import type { MyProfile } from "@/lib/matching";
import { ChipGroup, Progress, StepShell, VisibilityNote } from "./Bits";

const empty: MyProfile = {
  firstName: "",
  year: "",
  region: "",
  languages: [],
  interests: [],
  activities: [],
  availability: [],
  goals: [],
  note: "",
  shareRegion: true,
  shareLanguages: true,
};

export function ProfileForm({ onSubmit }: { onSubmit: (profile: MyProfile) => void }) {
  const [step, setStep] = useState(1);
  const [p, setP] = useState<MyProfile>(empty);
  const total = 4;

  const set = <K extends keyof MyProfile>(key: K, value: MyProfile[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));

  const toggle = <K extends "languages" | "interests" | "activities" | "availability" | "goals">(
    key: K,
    value: MyProfile[K][number],
  ) =>
    setP((prev) => {
      const list = prev[key] as string[];
      const next = list.includes(value as string)
        ? list.filter((v) => v !== value)
        : [...list, value as string];
      return { ...prev, [key]: next } as MyProfile;
    });

  const canContinue =
    step === 1
      ? p.firstName.trim().length > 0 && p.year !== "" && p.region.trim().length > 0
      : step === 2
        ? p.interests.length > 0 && p.activities.length > 0
        : step === 3
          ? p.availability.length > 0 && p.goals.length > 0
          : true;

  return (
    <div className="space-y-5">
      <Progress step={step} total={total} />

      {step === 1 && (
        <StepShell
          eyebrow={`Step ${step} of ${total}`}
          title="The basics"
          description="Just enough for someone to recognise you when you meet."
          footer={
            <button className="btn-primary" disabled={!canContinue} onClick={() => setStep(2)}>
              Continue
            </button>
          }
        >
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              className="field"
              value={p.firstName}
              placeholder="e.g. Michelle"
              onChange={(e) => set("firstName", e.target.value)}
            />
            <VisibilityNote kind="public" />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Year in school</span>
            <ChipGroup
              options={YEARS}
              selected={p.year ? [p.year] : []}
              onToggle={(y) => set("year", y)}
            />
            <VisibilityNote kind="public" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="region">
              Home country or region
            </label>
            <input
              id="region"
              className="field"
              value={p.region}
              placeholder="e.g. Canada"
              onChange={(e) => set("region", e.target.value)}
            />
            <label className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 size-4 accent-[oklch(0.402_0.062_163)]"
                checked={p.shareRegion}
                onChange={(e) => set("shareRegion", e.target.checked)}
              />
              Show this on my profile. If unchecked, it is still used privately for matching.
            </label>
            <VisibilityNote kind={p.shareRegion ? "public" : "private"} />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Languages you speak</span>
            <ChipGroup
              options={LANGUAGE_OPTIONS}
              selected={p.languages}
              onToggle={(v) => toggle("languages", v)}
            />
            <label className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 size-4 accent-[oklch(0.402_0.062_163)]"
                checked={p.shareLanguages}
                onChange={(e) => set("shareLanguages", e.target.checked)}
              />
              Show my languages on my profile.
            </label>
            <VisibilityNote kind={p.shareLanguages ? "public" : "private"} />
          </div>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          eyebrow={`Step ${step} of ${total}`}
          title="What you're into"
          description="Pick a handful. Overlap is what makes a first meet-up easy."
          footer={
            <>
              <button className="btn-quiet" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-primary" disabled={!canContinue} onClick={() => setStep(3)}>
                Continue
              </button>
            </>
          }
        >
          <div className="space-y-2">
            <span className="text-sm font-medium">Interests</span>
            <ChipGroup
              options={INTEREST_OPTIONS}
              selected={p.interests}
              onToggle={(v) => toggle("interests", v)}
            />
            <VisibilityNote kind="public" />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">Things you'd like to do with other people</span>
            <ChipGroup
              options={ACTIVITY_OPTIONS}
              selected={p.activities}
              onToggle={(v) => toggle("activities", v)}
            />
            <VisibilityNote kind="public" />
          </div>
        </StepShell>
      )}

      {step === 3 && (
        <StepShell
          eyebrow={`Step ${step} of ${total}`}
          title="When you're free, and why you're here"
          description="This part stays private — it only shapes who you're grouped with."
          footer={
            <>
              <button className="btn-quiet" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn-primary" disabled={!canContinue} onClick={() => setStep(4)}>
                Continue
              </button>
            </>
          }
        >
          <div className="space-y-2">
            <span className="text-sm font-medium">Typical availability</span>
            <ChipGroup
              options={AVAILABILITY_OPTIONS}
              selected={p.availability}
              onToggle={(v: Availability) => toggle("availability", v)}
            />
            <VisibilityNote kind="private">
              Matches see a suggested time, never your full schedule.
            </VisibilityNote>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">What you're looking for</span>
            <ChipGroup
              options={GOAL_OPTIONS}
              selected={p.goals}
              onToggle={(v: SocialGoal) => toggle("goals", v)}
            />
            <VisibilityNote kind="private" />
          </div>
        </StepShell>
      )}

      {step === 4 && (
        <StepShell
          eyebrow={`Step ${step} of ${total}`}
          title="In your own words"
          description="Optional, and private by default."
          footer={
            <>
              <button className="btn-quiet" onClick={() => setStep(3)}>
                Back
              </button>
              <button className="btn-accent" onClick={() => onSubmit(p)}>
                Find my community
              </button>
            </>
          }
        >
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="note">
              What kind of community are you hoping to find?
            </label>
            <textarea
              id="note"
              className="field min-h-32 resize-y"
              value={p.note}
              placeholder="Somewhere I don't have to explain myself twice…"
              onChange={(e) => set("note", e.target.value)}
            />
            <VisibilityNote kind="private">
              Never shown on your profile or to anyone in your group.
            </VisibilityNote>
          </div>

          <div className="rounded-2xl bg-secondary/70 p-5 text-sm">
            <p className="font-medium">Your privacy, in plain terms</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <span className="label-public mr-2">Visible to your matches</span>
                First name, year{p.shareRegion ? ", home country/region" : ""}
                {p.shareLanguages ? ", languages" : ""}, interests, activities.
              </li>
              <li>
                <span className="label-private mr-2">Used privately for matching</span>
                Availability, what you're looking for, your written answer
                {p.shareRegion ? "" : ", home country/region"}
                {p.shareLanguages ? "" : ", languages"}.
              </li>
            </ul>
          </div>
        </StepShell>
      )}
    </div>
  );
}
