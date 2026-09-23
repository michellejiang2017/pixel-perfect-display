import type { ReactNode } from "react";

export function ChipGroup<T extends string>({
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
        const on = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(option)}
            className={on ? "chip chip-on" : "chip"}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function VisibilityNote({ kind, children }: { kind: "public" | "private"; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={kind === "public" ? "label-public" : "label-private"}>
        {kind === "public" ? "Visible to your matches" : "Used privately for matching"}
      </span>
      {children ? <span className="text-xs text-muted-foreground">{children}</span> : null}
    </div>
  );
}

export function StepShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="card-soft p-6 sm:p-9">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl sm:text-3xl">{title}</h2>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-7 space-y-7">{children}</div>
      {footer ? <div className="mt-9 flex flex-wrap items-center gap-3">{footer}</div> : null}
    </div>
  );
}

export function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i < step ? "w-8 bg-primary" : "w-4 bg-border"
          }`}
        />
      ))}
    </div>
  );
}
