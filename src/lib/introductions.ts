import type { Availability, MyNetworkProfile, NetworkStudent } from "@/data/network";
import { cosineSimilarity, embedTexts } from "@/lib/localEmbeddings";

const overlap = <T>(left: readonly T[], right: readonly T[]): T[] =>
  left.filter((item) => right.includes(item));

const meetingCompatible = (
  mine: MyNetworkProfile["meetPreference"],
  theirs: NetworkStudent["public"]["meetPreference"],
): boolean => mine === "Either" || theirs === "Either" || mine === theirs;

export interface IntroductionMatch {
  student: NetworkStudent;
  score: number;
  sharedInterests: string[];
  sharedAvailability: Availability[];
  scheduleOverlap: boolean;
  meetingCompatible: boolean;
  semanticSimilarity?: number;
  combinedScore?: number;
  usedLocalAI?: boolean;
}

export function scoreIntroduction(me: MyNetworkProfile, other: NetworkStudent): IntroductionMatch {
  const sharedInterests = overlap(me.interests, other.public.interests);
  const sharedAvailability = overlap(me.availability, other.private.availability);
  const sharedGoals = overlap(me.goals, other.private.goals);
  const modeWorks = meetingCompatible(me.meetPreference, other.public.meetPreference);

  let score = 0;

  score += other.public.college !== me.college ? 10 : -12;
  score += sharedInterests.length * 4;
  score += sharedGoals.length * 4;
  score += sharedAvailability.length * 3;

  if (modeWorks) {
    score += 4;
  }

  return {
    student: other,
    score,
    sharedInterests,
    sharedAvailability,
    scheduleOverlap: sharedAvailability.length > 0,
    meetingCompatible: modeWorks,
  };
}

export function rankIntroductions(
  me: MyNetworkProfile,
  pool: NetworkStudent[],
): IntroductionMatch[] {
  const otherCampuses = pool.filter((student) => student.public.college !== me.college);
  const source = otherCampuses.length >= 3 ? otherCampuses : pool;

  return source
    .map((candidate) => scoreIntroduction(me, candidate))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.student.public.college.localeCompare(b.student.public.college) ||
        a.student.id.localeCompare(b.student.id),
    );
}

function candidateSemanticText(student: NetworkStudent): string {
  return [
    student.public.introLine,
    `Interests: ${student.public.interests.join(", ")}.`,
    `Connection goals: ${student.private.goals.join(", ")}.`,
    student.private.context ? `Private matching context: ${student.private.context}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export async function rankIntroductionsWithLocalAI(
  me: MyNetworkProfile,
  pool: NetworkStudent[],
  privateIntent: string,
): Promise<IntroductionMatch[]> {
  const baseMatches = rankIntroductions(me, pool);
  const intent = privateIntent.trim();

  if (!intent) {
    return baseMatches;
  }

  const candidateTexts = baseMatches.map((match) => candidateSemanticText(match.student));
  const [intentVector, ...candidateVectors] = await embedTexts([intent, ...candidateTexts]);

  if (!intentVector) {
    return baseMatches;
  }

  return baseMatches
    .map((match, index) => {
      const candidateVector = candidateVectors[index];

      if (!candidateVector) {
        return { ...match, combinedScore: match.score, usedLocalAI: false };
      }

      const similarity = clamp(cosineSimilarity(intentVector, candidateVector), 0, 1);
      const ruleScore = clamp(match.score / 40, 0, 1);
      const combinedScore = ruleScore * 65 + similarity * 35;

      return {
        ...match,
        semanticSimilarity: similarity,
        combinedScore,
        usedLocalAI: true,
      };
    })
    .sort(
      (a, b) =>
        (b.combinedScore ?? b.score) - (a.combinedScore ?? a.score) ||
        a.student.public.college.localeCompare(b.student.public.college) ||
        a.student.id.localeCompare(b.student.id),
    );
}

export function safeIntroductionReasons(match: IntroductionMatch): string[] {
  const reasons: string[] = [
    `They study at ${match.student.public.college}, so this introduction expands beyond your campus.`,
  ];

  if (match.sharedInterests.length > 0) {
    reasons.push(
      `You share ${match.sharedInterests.slice(0, 2).join(" and ").toLowerCase()} as interests.`,
    );
  }

  if (match.scheduleOverlap) {
    reasons.push("Your schedules have overlap. Their private availability is not shown.");
  }

  if (match.usedLocalAI && (match.semanticSimilarity ?? 0) > 0.35) {
    reasons.push(
      "Your private description is semantically compatible with their matching profile. Neither private response is revealed.",
    );
  }

  if (match.meetingCompatible) {
    const preference = match.student.public.meetPreference;
    reasons.push(
      preference === "Virtual first"
        ? "They are comfortable meeting virtually before deciding whether to meet in person."
        : preference === "In person"
          ? "They are open to an in-person introduction."
          : "They are open to either a virtual or in-person introduction.",
    );
  }

  return reasons;
}

export function suggestedVirtualWindows(match: IntroductionMatch): string[] {
  if (match.sharedAvailability.length === 0) {
    return ["Share availability privately"];
  }

  return match.sharedAvailability.slice(0, 2);
}
