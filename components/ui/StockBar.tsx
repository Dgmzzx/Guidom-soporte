export function StockBar({
  cantidad,
  umbral,
}: {
  cantidad: number;
  umbral: number;
}) {
  const low = cantidad <= umbral;
  const pct = umbral > 0 ? Math.min(100, Math.round((cantidad / (umbral * 2)) * 100)) : 100;

  return (
    <div className="flex min-w-[130px] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-steel-hover">
        <div
          className={`h-full rounded-full ${low ? "bg-amber" : "bg-flux"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-paper-dim">umbral {umbral}</span>
    </div>
  );
}
