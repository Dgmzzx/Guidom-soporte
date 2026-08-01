"use client";

import { BinTag } from "@/components/ui/BinTag";
import { Pill } from "@/components/ui/Pill";
import { StockBar } from "@/components/ui/StockBar";
import type { InventoryRow } from "./InventoryView";

export default function InventoryTable({
  rows,
  hasResults,
  isFiltered,
}: {
  rows: InventoryRow[];
  hasResults: boolean;
  isFiltered: boolean;
}) {
  if (!hasResults) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-line bg-steel-deep/40 p-10 text-center">
        <div className="font-display text-xl font-bold text-paper">
          Aún no hay materiales
        </div>
        <p className="mt-1 text-sm text-paper-dim">
          Ve a la pestaña &quot;Materiales&quot; para dar de alta el primero.
        </p>
      </div>
    );
  }

  if (rows.length === 0 && isFiltered) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-line bg-steel-deep/40 p-10 text-center">
        <div className="font-display text-xl font-bold text-paper">
          Sin resultados
        </div>
        <p className="mt-1 text-sm text-paper-dim">
          No hay materiales que coincidan con tu búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-steel">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-line font-mono text-[10px] uppercase tracking-widest text-paper-dim">
            <th className="px-4 py-3 font-medium">Material</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 text-right font-medium">Entradas</th>
            <th className="px-4 py-3 text-right font-medium">Salidas</th>
            <th className="px-4 py-3 text-right font-medium">Existencia</th>
            <th className="px-4 py-3 font-medium">Nivel</th>
            <th className="px-4 py-3 font-medium">Última salida</th>
            <th className="px-4 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => {
            const low = m.existencia <= m.umbral;
            return (
              <tr
                key={m.id}
                className="group border-b border-line/60 transition-colors last:border-b-0 hover:bg-steel-hover"
              >
                <td className="px-4 py-3">
                  <div className="mb-1.5 transition-transform duration-150 group-hover:-translate-y-px">
                    <BinTag code={m.code} location={m.location} />
                  </div>
                  <div className="font-semibold text-paper">{m.name}</div>
                </td>
                <td className="px-4 py-3 text-paper-dim">{m.category || "—"}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-paper">
                  {m.entradas}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-paper">
                  {m.salidas}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-paper">
                  {m.existencia}
                </td>
                <td className="px-4 py-3">
                  <StockBar cantidad={m.existencia} umbral={m.umbral} />
                </td>
                <td className="px-4 py-3 font-mono text-[12px] text-paper-dim">
                  {m.lastSalida ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Pill tone={low ? "low" : "ok"}>
                    {low ? "Bajo stock" : "OK"}
                  </Pill>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
