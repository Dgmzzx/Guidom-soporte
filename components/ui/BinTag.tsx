function barcodeBars(seed: string) {
  const out: number[] = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 1000003;
    out.push((h % 3) + 1);
    out.push(((h >> 2) % 2) + 1);
  }
  return out.slice(0, 22);
}

export function BinTag({
  code,
  location,
}: {
  code: string;
  location?: string | null;
}) {
  const bars = barcodeBars(code);

  return (
    <span className="inline-flex items-stretch overflow-hidden rounded-[5px] border border-line bg-steel shadow-sm">
      <span
        aria-hidden="true"
        className="flex items-center gap-[2px] bg-graphite px-2 py-1"
      >
        {bars.map((w, i) => (
          <span key={i} style={{ width: w }} className="h-3 bg-paper/70" />
        ))}
      </span>
      <span className="flex items-center border-l border-line px-2 py-1 font-mono text-[11px] font-semibold tracking-wide text-paper">
        {code}
      </span>
      <span className="flex items-center border-l border-line px-2 py-1 font-mono text-[11px] text-paper-dim">
        {location || "—"}
      </span>
    </span>
  );
}
