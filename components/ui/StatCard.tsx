type Tone = "default" | "good" | "warn";

const valueColors: Record<Tone, string> = {
  default: "text-paper",
  good: "text-flux",
  warn: "text-amber",
};

const dotColors: Record<Tone, string> = {
  default: "bg-steelblue",
  good: "bg-flux",
  warn: "bg-amber",
};

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: Tone;
}) {
  return (
    <div className="rounded-lg border border-line bg-steel px-4 py-3">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[tone]}`} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          {label}
        </span>
      </div>
      <div className={`mt-1 font-display text-2xl font-bold tabular-nums ${valueColors[tone]}`}>
        {value}
      </div>
    </div>
  );
}
