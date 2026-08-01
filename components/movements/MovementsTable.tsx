"use client";

import { useMemo, useState } from "react";
import type { Movement } from "@/lib/types";
import { eliminarMovimiento } from "@/lib/actions/movements";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { inputCls, selectCls } from "@/components/ui/classes";
import { useToast } from "@/components/Toast";

export default function MovementsTable({
  movements,
  materialNames,
}: {
  movements: Movement[];
  materialNames: Record<string, string>;
}) {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"Todos" | "Entrada" | "Salida">(
    "Todos",
  );
  const [pending, setPending] = useState<Movement | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movements.filter((mv) => {
      if (typeFilter !== "Todos" && mv.type !== typeFilter) return false;
      if (!q) return true;
      const name = materialNames[mv.material_id] ?? "";
      return (
        name.toLowerCase().includes(q) || (mv.observation ?? "").toLowerCase().includes(q)
      );
    });
  }, [movements, query, typeFilter, materialNames]);

  async function handleDelete() {
    if (!pending) return;
    setLoading(true);
    const fd = new FormData();
    fd.set("id", pending.id);
    const res = await eliminarMovimiento(fd);
    setLoading(false);
    setPending(null);
    if (res && "error" in res && res.error) {
      toast.show(res.error, "error");
    } else {
      toast.show("Movimiento eliminado.");
    }
  }

  if (movements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-steel p-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">
          sin registros
        </p>
        <p className="mt-2 font-display text-lg font-bold text-paper">
          Aún no hay movimientos
        </p>
        <p className="mt-1 text-sm text-paper-dim">
          Registra la primera entrada o salida de stock.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-steel">
      <div className="flex flex-col gap-2 border-b border-line p-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={inputCls}
          placeholder="Buscar por material u observación…"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className={`${selectCls} sm:w-40`}
        >
          <option>Todos</option>
          <option>Entrada</option>
          <option>Salida</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center text-sm text-paper-dim">
          Sin resultados para los filtros actuales.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                <th className="px-4 py-2.5 font-normal">Fecha</th>
                <th className="px-4 py-2.5 font-normal">Tipo</th>
                <th className="px-4 py-2.5 font-normal">Material</th>
                <th className="px-4 py-2.5 font-normal text-right">Cantidad</th>
                <th className="px-4 py-2.5 font-normal">Observación</th>
                <th className="px-4 py-2.5 font-normal" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((mv) => {
                const salida = mv.type === "Salida";
                return (
                  <tr
                    key={mv.id}
                    className="border-b border-line/60 last:border-b-0 hover:bg-graphite/40"
                  >
                    <td className="px-4 py-3 font-mono text-[12px] text-paper-dim">
                      {mv.date}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={salida ? "salida" : "entrada"}>
                        {salida ? "Salida" : "Entrada"}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 font-medium text-paper">
                      {materialNames[mv.material_id] ?? "—"}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono tabular-nums ${
                        salida ? "text-safety" : "text-flux"
                      }`}
                    >
                      {salida ? "−" : "+"}
                      {mv.qty}
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-paper-dim">
                      {mv.observation || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-alert/80 hover:border-alert/40 hover:text-alert"
                        onClick={() => setPending(mv)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!pending}
        title="Eliminar movimiento"
        message={
          pending
            ? `${materialNames[pending.material_id] ?? "Material"}\n${
                pending.type
              } de ${pending.qty}\nFecha: ${pending.date}\n\nEsto ajustará el stock del material. ¿Continuar?`
            : ""
        }
        confirmText="Eliminar"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setPending(null)}
        loading={loading}
      />
    </div>
  );
}
