/**
 * Deterministic group matching for Worlds Together.
 *
 * Swap this module out later for an AI-based approach — the rest of the app only
 * uses `buildCommunity(me, pool)`.
 *
 * Goal: enough common ground to make meeting comfortable, plus deliberate
 * background diversity. Nationality is never a primary factor.
 */
import type { Availability, SocialGoal, Student } from "@/data/students";

export interface MyProfile {
  firstName: string;
  year: string;
  region: string;
  languages: string[];
  interests: string[];
  activities: string[];
  availability: Availability[];
  goals: SocialGoal[];
  note: string;
  shareRegion: boolean;
  shareLanguages: boolean;
}

const overlap = <T,>(a: T[], b: T[]) => a.filter((x) => b.includes(x));

const WEIGHTS = {
  interests: 3,
  activities: 3,
  availability: 4,
  goals: 3,
  sameRegionPenalty: 2,
  languageBridge: 1,
};

export function scoreCandidate(me: MyProfile, other: Student): number {
  let score = 0;
  score += overlap(me.interests, other.public.interests).length * WEIGHTS.interests;
  score += overlap(me.activities, other.public.activities).length * WEIGHTS.activities;
  score += overlap(me.availability, other.private.availability).length * WEIGHTS.availability;
  score += overlap(me.goals, other.private.goals).length * WEIGHTS.goals;

  // A shared language helps comfort, but only a little.
  if (overlap(me.languages, other.public.languages ?? []).length > 0) {
    score += WEIGHTS.languageBridge;
  }

  // Encourage meeting beyond one's own background.
  if (other.private.regionForMatching === me.region) score -= WEIGHTS.sameRegionPenalty;

  // Students who want to widen their circle are better prototype matches.
  if (me.goals.includes("People outside their usual social circle")) {
    score += other.private.openness - 3;
  }
  return score;
}

export interface Community {
  members: Student[];
  sharedInterests: string[];
  sharedActivities: string[];
  sharedAvailability: Availability[];
  sharedGoals: SocialGoal[];
  regionCount: number;
}

export function buildCommunity(me: MyProfile, pool: Student[] = []): Community {
  const ranked = [...pool]
    .map((student) => ({ student, score: scoreCandidate(me, student) }))
    .sort((a, b) => b.score - a.score || a.student.id.localeCompare(b.student.id));

  const members: Student[] = [];
  const regions = new Set<string>();

  // Pass 1: best candidates, at most two per region, for background diversity.
  for (const { student } of ranked) {
    if (members.length >= 4) break;
    const region = student.private.regionForMatching;
    const fromRegion = members.filter((m) => m.private.regionForMatching === region).length;
    if (fromRegion >= 1) continue;
    members.push(student);
    regions.add(region);
  }
  // Pass 2: top up to 4 if the diversity rule left the group small.
  for (const { student } of ranked) {
    if (members.length >= 4) break;
    if (!members.includes(student)) members.push(student);
  }

  const countCommon = <T,>(values: T[][], mine: T[]) =>
    mine.filter((v) => values.filter((list) => list.includes(v)).length >= 2);

  return {
    members,
    sharedInterests: countCommon(members.map((m) => m.public.interests), me.interests),
    sharedActivities: countCommon(members.map((m) => m.public.activities), me.activities),
    sharedAvailability: countCommon(members.map((m) => m.private.availability), me.availability),
    sharedGoals: countCommon(members.map((m) => m.private.goals), me.goals),
    regionCount: new Set([me.region, ...members.map((m) => m.private.regionForMatching)]).size,
  };
}

const list = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** Explanation built only from information that is safe to reveal. */
export function explainCommunity(me: MyProfile, community: Community): string[] {
  const lines: string[] = [];
  if (community.sharedGoals.length) {
    lines.push(`Several of you are looking for the same thing: ${list(community.sharedGoals.map((g) => g.toLowerCase())).replace("people outside their usual social circle", "people outside your usual circles")}.`);
  }
  if (community.sharedAvailability.length) {
    lines.push(`Your free time lines up around ${list(community.sharedAvailability as string[])}.`);
  }
  if (community.sharedInterests.length) {
    lines.push(`You share interests in ${list(community.sharedInterests.map((i) => i.toLowerCase()))}.`);
  }
  if (community.sharedActivities.length) {
    lines.push(`You all said you'd like to try ${list(community.sharedActivities.map((a) => a.toLowerCase()))}.`);
  }
  lines.push(`The group spans ${community.regionCount} different home countries or regions, so it isn't just people from one background.`);
  return lines;
}

/** One concrete first meet-up from overlapping interests and availability. */
export function suggestActivity(me: MyProfile, community: Community): { when: string; what: string } {
  const when = community.sharedAvailability[0] ?? me.availability[0] ?? "Saturday afternoons";
  const activity = community.sharedActivities[0] ?? me.activities[0] ?? "Cafe hopping";
  const map: Record<string, string> = {
    "Cafe hopping": "Grab coffee downtown and wander a few blocks together",
    "Day hikes": "Take the easy trail loop just outside town",
    "Cooking together": "Cook one dish each in a shared kitchen",
    "Weekend markets": "Walk the farmers market and split whatever looks good",
    "Film nights": "Pick a film none of you have seen and watch it together",
    "Library sessions": "Claim a big table and work quietly side by side",
    "Startup meetups": "Sit in on the campus startup meetup, then debrief over food",
    "Photo walks": "Do a slow photo walk through the older part of town",
    "Bike rides": "Ride the river path and stop somewhere for a snack",
    "Morning runs": "Easy 5k at conversation pace, coffee after",
    "Museum visits": "Free student entry at the museum, then dessert",
    "Pickup games": "Casual pickup game at the outdoor courts",
    "Jam sessions": "Bring instruments, play badly, laugh about it",
    "Community volunteering": "Sign up for a two-hour volunteering shift together",
    "Game nights": "Board games and snacks in a common room",
    "Baking afternoons": "Bake something ambitious and share the results",
    "Climbing gym": "Beginner-friendly session at the climbing gym",
    "Hack nights": "Build something small and silly in one sitting",
    "Morning walks": "Long walk before classes, no phones",
  };
  return { when, what: map[activity] ?? "Meet up somewhere easy and see how it goes" };
}
