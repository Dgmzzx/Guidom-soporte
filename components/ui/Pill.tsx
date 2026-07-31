import type { ReactNode } from "react";

type Tone = "entrada" | "salida" | "ok" | "low";

const tones: Record<Tone, string> = {
  entrada: "border-flux/30 bg-flux/10 text-flux",
  salida: "border-safety/30 bg-safety/10 text-safety",
  ok: "border-flux/30 bg-flux/10 text-flux",
  low: "border-amber/30 bg-amber/10 text-amber",
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
