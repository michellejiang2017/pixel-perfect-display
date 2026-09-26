import type { IntroductionMatch } from "@/lib/introductions";

const positions = [
  { x: 105, y: 72 },
  { x: 535, y: 72 },
  { x: 590, y: 215 },
  { x: 480, y: 286 },
  { x: 160, y: 286 },
  { x: 50, y: 215 },
];

function shortCollege(college: string): string {
  const replacements: Record<string, string> = {
    "Smith College": "Smith",
    "Amherst College": "Amherst",
    "UMass Amherst": "UMass",
    "Mount Holyoke College": "Mount Holyoke",
    "Hampshire College": "Hampshire",
    "Williams College": "Williams",
    "Harvard University": "Harvard",
  };

  return replacements[college] ?? college;
}

export function NetworkMap({
  matches,
  activeStudentId,
}: {
  matches: IntroductionMatch[];
  activeStudentId?: string;
}) {
  const visible = matches.slice(0, positions.length);

  return (
    <section className="card-soft p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Network view
        </p>
        <h3 className="mt-2 font-sans text-lg font-semibold">Cross-campus bridge candidates</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          This is a visualization of the current ranking. It is not a public directory.
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-secondary/25">
        <svg
          aria-label="Network of suggested cross-campus introductions"
          className="h-auto w-full"
          role="img"
          viewBox="0 0 640 340"
        >
          {visible.map((match, index) => {
            const position = positions[index]!;
            const isActive = match.student.id === activeStudentId;

            return (
              <g key={`edge-${match.student.id}`}>
                <line
                  className={isActive ? "stroke-primary" : "stroke-border"}
                  strokeWidth={isActive ? 3 : 2}
                  x1="320"
                  x2={position.x}
                  y1="170"
                  y2={position.y}
                />
              </g>
            );
          })}

          <g>
            <circle className="fill-primary" cx="320" cy="170" r="31" />
            <text
              className="fill-primary-foreground text-[13px] font-semibold"
              textAnchor="middle"
              x="320"
              y="175"
            >
              You
            </text>
          </g>

          {visible.map((match, index) => {
            const position = positions[index]!;
            const isActive = match.student.id === activeStudentId;

            return (
              <g key={match.student.id}>
                <circle
                  className={isActive ? "fill-primary" : "fill-card stroke-border"}
                  cx={position.x}
                  cy={position.y}
                  r="27"
                  strokeWidth="2"
                />
                <text
                  className={
                    isActive
                      ? "fill-primary-foreground text-[11px] font-semibold"
                      : "fill-foreground text-[11px] font-semibold"
                  }
                  textAnchor="middle"
                  x={position.x}
                  y={position.y + 4}
                >
                  {match.student.public.firstName}
                </text>
                <text
                  className="fill-muted-foreground text-[9px]"
                  textAnchor="middle"
                  x={position.x}
                  y={position.y + 44}
                >
                  {shortCollege(match.student.public.college)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
