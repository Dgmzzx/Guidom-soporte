"use client";

import { useMemo, useState } from "react";
import SearchBar, { type SearchMaterial } from "./SearchBar";
import InventoryTable from "./InventoryTable";
import StatsRow from "./StatsRow";
import ExportButton from "./ExportButton";

export type InventoryRow = {
  id: string;
  code: string;
  name: string;
  category: string;
  location: string | null;
  entradas: number;
  salidas: number;
  existencia: number;
  umbral: number;
  lastSalida: string | null;
};

export type InventoryStats = {
  materialsCount: number;
  totalExist: number;
  lowCount: number;
  entradasMes: number;
  salidasMes: number;
};

export default function InventoryView({
  rows,
  stats,
}: {
  rows: InventoryRow[];
  stats: InventoryStats;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (selectedId) return rows.filter((r) => r.id === selectedId);
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, q, selectedId]);

  const searchMaterials: SearchMaterial[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    location: r.location,
    cantidad: r.existencia,
    code: r.code,
  }));

  function handleQueryChange(v: string) {
    setQuery(v);
    setSelectedId(null);
  }

  function handleSelect(id: string, name: string) {
    setSelectedId(id);
    setQuery(name);
  }

  return (
    <>
      <StatsRow {...stats} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          materials={searchMaterials}
          query={query}
          onQueryChange={handleQueryChange}
          onSelect={handleSelect}
        />
        <ExportButton />
      </div>

      <InventoryTable
        rows={filtered}
        hasResults={rows.length > 0}
        isFiltered={q.length > 0 || selectedId !== null}
      />
    </>
  );
}
