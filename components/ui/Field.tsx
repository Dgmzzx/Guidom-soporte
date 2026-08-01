import type { ReactNode } from "react";

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
        {label}
      </label>
      {children}
    </div>
  );
}
