"use client";

import { useState } from "react";
import type { Material } from "@/lib/types";
import { materialCode } from "@/lib/material-code";
import { eliminarMaterial } from "@/lib/actions/materials";
import { BinTag } from "@/components/ui/BinTag";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/Toast";

export default function MaterialsTable({ materials }: { materials: Material[] }) {
  const toast = useToast();
  const [pending, setPending] = useState<Material | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!pending) return;
    setLoading(true);
    const fd = new FormData();
    fd.set("id", pending.id);
    const res = await eliminarMaterial(fd);
    setLoading(false);
    setPending(null);
    if (res && "error" in res && res.error) {
      toast.show(res.error, "error");
    } else {
      toast.show("Material eliminado.");
    }
  }

  if (materials.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-steel p-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">
          sin registros
        </p>
        <p className="mt-2 font-display text-lg font-bold text-paper">Aún no hay materiales</p>
        <p className="mt-1 text-sm text-paper-dim">Usa el formulario para agregar el primero.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-steel">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] uppercase tracking-widest text-paper-dim">
              <th className="px-4 py-2.5 font-normal">Material</th>
              <th className="px-4 py-2.5 font-normal">Categoría</th>
              <th className="px-4 py-2.5 font-normal text-right">Stock</th>
              <th className="px-4 py-2.5 font-normal text-right">Umbral</th>
              <th className="px-4 py-2.5 font-normal">Ubicación</th>
              <th className="px-4 py-2.5 font-normal" />
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => {
              const low = m.umbral > 0 && m.cantidad <= m.umbral;
              return (
                <tr
                  key={m.id}
                  className="border-b border-line/60 last:border-b-0 hover:bg-graphite/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <BinTag code={materialCode(m.id)} location={m.location} />
                      <span className="font-semibold text-paper">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-paper-dim">
                    {m.category ? (
                      <Pill tone="neutral">{m.category}</Pill>
                    ) : (
                      <span className="text-paper-dim/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        low ? "text-alert" : "text-flux"
                      }`}
                    >
                      {m.cantidad}
                    </span>
                    <span className="ml-1 font-mono text-[10px] text-paper-dim">
                      {m.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-paper-dim">
                    {m.umbral}
                  </td>
                  <td className="px-4 py-3 font-mono text-paper-dim">
                    {m.location || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-alert/80 hover:border-alert/40 hover:text-alert"
                      onClick={() => setPending(m)}
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

      <ConfirmModal
        open={!!pending}
        title="Eliminar material"
        message={
          pending
            ? `${pending.name}\nStock: ${pending.cantidad} ${pending.unit}\n\nSe eliminará también su historial de movimientos. Esta acción no se puede deshacer.`
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
