"use client";

import { useState } from "react";
import type { Material } from "@/lib/types";
import { registrarMovimiento } from "@/lib/actions/movements";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { inputCls, selectCls } from "@/components/ui/classes";
import { useToast } from "@/components/Toast";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function MovementsForm({ materials }: { materials: Material[] }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"Entrada" | "Salida">("Entrada");
  const [materialId, setMaterialId] = useState("");
  const [qty, setQty] = useState("");
  const [date, setDate] = useState(today);
  const [observation, setObservation] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!materialId) {
      toast.show("Selecciona un material.", "error");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.set("materialId", materialId);
    fd.set("type", type);
    fd.set("qty", qty);
    fd.set("date", date);
    fd.set("observation", observation);
    const res = await registrarMovimiento(fd);
    setLoading(false);

    if (res && "error" in res && res.error) {
      toast.show(res.error, "error");
      return;
    }
    setQty("");
    setObservation("");
    toast.show(
      type === "Entrada" ? "Entrada registrada." : "Salida registrada.",
    );
  }

  const segBtn = (value: "Entrada" | "Salida", label: string) => {
    const active = type === value;
    const color =
      value === "Entrada"
        ? "border-flux/40 bg-flux/15 text-flux"
        : "border-safety/40 bg-safety/15 text-safety";
    return (
      <button
        type="button"
        onClick={() => setType(value)}
        className={`flex-1 rounded-[6px] border px-4 py-2 text-[13px] font-semibold transition-all ${
          active ? color : "border-line bg-transparent text-paper-dim hover:text-paper"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="rounded-lg border border-line bg-steel p-5">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-lg font-bold text-paper">
          Registrar movimiento
        </h2>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Field label="Material" className="lg:col-span-2">
          <select
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            className={selectCls}
            required
          >
            <option value="">Selecciona…</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
            Tipo
          </span>
          <div className="flex gap-1.5">{segBtn("Entrada", "Entrada")}{segBtn("Salida", "Salida")}</div>
        </div>

        <Field label="Cantidad">
          <input
            type="number"
            min="0"
            step="any"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className={inputCls}
            placeholder="0"
            required
          />
        </Field>

        <Field label="Fecha">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Observación">
          <div className="flex gap-2">
            <input
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className={inputCls}
              placeholder="Opcional"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={loading || materials.length === 0}
              className="whitespace-nowrap"
            >
              {loading ? "Guardando…" : "Registrar"}
            </Button>
          </div>
        </Field>
      </form>
    </div>
  );
}
