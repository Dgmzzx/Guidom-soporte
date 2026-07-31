import type { ReactNode } from "react";

export default function Header({ actions }: { actions?: ReactNode }) {
  return (
    <header className="flex items-center justify-between border-b border-line bg-steel-deep/60 px-5 py-4 sm:px-8">
      <div className="flex flex-col gap-0.5">
        <div className="font-display text-lg font-bold leading-none tracking-tight text-paper">
          Guidom<span className="text-safety">·</span>Soporte
        </div>
        <div className="font-mono text-[9px] uppercase tracking-widest2 text-paper-dim">
          Conteo de entradas y salidas
        </div>
      </div>
      {actions}
    </header>
  );
}
