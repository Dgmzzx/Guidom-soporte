"use client";

import { useEffect, useRef, useState } from "react";
import { BinTag } from "@/components/ui/BinTag";

export type SearchMaterial = {
  id: string;
  name: string;
  category: string;
  location: string | null;
  cantidad: number;
  code: string;
};

export default function SearchBar({
  materials,
  query,
  onQueryChange,
  onSelect,
}: {
  materials: SearchMaterial[];
  query: string;
  onQueryChange: (v: string) => void;
  onSelect: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const matches = q
    ? materials.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 8)
    : [];

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function pick(m: SearchMaterial) {
    onSelect(m.id, m.name);
    setOpen(false);
    setHighlight(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (matches.length === 0 || !open) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const m = highlight >= 0 ? matches[highlight] : matches[0];
      if (m) pick(m);
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  }

  return (
    <div ref={wrapRef} className="relative flex-1">
      <div className="flex items-center gap-2 rounded-[6px] border border-line bg-steel px-3 focus-within:border-safety/60">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4 shrink-0 text-paper-dim"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          placeholder="Buscar material..."
          autoComplete="off"
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent py-2 text-sm text-paper placeholder:text-paper-dim/60 focus:outline-none"
        />
      </div>

      {open && matches.length > 0 && (
        <div className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-[6px] border border-line bg-steel shadow-xl">
          {matches.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                pick(m);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                i === highlight ? "bg-steel-hover" : ""
              }`}
            >
              <BinTag code={m.code} location={m.location} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] text-paper">{m.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                  {m.category || "—"}
                </div>
              </div>
              <span className="shrink-0 font-mono text-[12px] tabular-nums text-paper">
                {m.cantidad}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
