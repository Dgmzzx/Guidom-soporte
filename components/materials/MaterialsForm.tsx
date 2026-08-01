"use client";

import { useState } from "react";
import { agregarStock, crearMaterial } from "@/lib/actions/materials";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Field } from "@/components/ui/Field";
import { inputCls, selectCls } from "@/components/ui/classes";
import { useToast } from "@/components/Toast";

const UNIDADES = ["piezas", "kg", "metros", "litros", "caja", "rollo"];
const CATEGORIAS = [
  "Electricidad",
  "Plomería",
  "Ferretería",
  "Herramientas",
  "Pintura",
  "Carpintería",
];

type FormState = {
  name: string;
  category: string;
  unit: string;
  cantidad: string;
  umbral: string;
  location: string;
  observations: string;
};

const emptyForm: FormState = {
  name: "",
  category: "",
  unit: "piezas",
  cantidad: "",
  umbral: "",
  location: "",
  observations: "",
};

type Duplicate = {
  id: string;
  name: string;
  cantidad: number;
  unit: string;
  qty: number;
};

export default function MaterialsForm() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [dup, setDup] = useState<Duplicate | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function update(field: keyof FormState) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function toFormData() {
    const fd = new FormData();
    (Object.keys(form) as (keyof FormState)[]).forEach((k) => fd.set(k, form[k]));
    return fd;
  }

  function reset() {
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await crearMaterial(toFormData());
    setLoading(false);

    if (!res) {
      reset();
      toast.show("Material agregado.");
      return;
    }
    if ("error" in res && res.error) {
      toast.show(res.error, "error");
      return;
    }
    if ("duplicate" in res) {
      setDup({
        id: res.id,
        name: res.name,
        cantidad: res.cantidad,
        unit: res.unit,
        qty: Number(form.cantidad || 0),
      });
    }
  }

  async function handleAddStock() {
    if (!dup) return;
    setLoading(true);
    const fd = new FormData();
    fd.set("materialId", dup.id);
    fd.set("qty", String(dup.qty));
    const res = await agregarStock(fd);
    setLoading(false);
    setDup(null);

    if (!res) {
      reset();
      toast.show("Stock actualizado.");
      return;
    }
    if ("error" in res && res.error) toast.show(res.error, "error");
  }

  return (
    <div className="rounded-lg border border-line bg-steel p-5">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-lg font-bold text-paper">Nuevo material</h2>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nombre">
            <input
              name="name"
              value={form.name}
              onChange={update("name")}
              className={inputCls}
              placeholder="Ej. Tornillo 1/4"
              required
            />
          </Field>
          <Field label="Categoría">
            <input
              name="category"
              list="cat-list"
              value={form.category}
              onChange={update("category")}
              className={inputCls}
              placeholder="Ej. Electricidad"
            />
            <datalist id="cat-list">
              {CATEGORIAS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Unidad">
            <select name="unit" value={form.unit} onChange={update("unit")} className={selectCls}>
              {UNIDADES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cantidad inicial">
            <input
              name="cantidad"
              type="number"
              min="0"
              value={form.cantidad}
              onChange={update("cantidad")}
              className={inputCls}
              placeholder="0"
            />
          </Field>
          <Field label="Umbral">
            <input
              name="umbral"
              type="number"
              min="0"
              value={form.umbral}
              onChange={update("umbral")}
              className={inputCls}
              placeholder="0"
            />
          </Field>
          <Field label="Ubicación">
            <input
              name="location"
              value={form.location}
              onChange={update("location")}
              className={inputCls}
              placeholder="Ej. Estante A3"
            />
          </Field>
          <Field label="Observaciones" className="sm:col-span-2">
            <input
              name="observations"
              value={form.observations}
              onChange={update("observations")}
              className={inputCls}
              placeholder="Opcional"
            />
          </Field>
          <div className="flex items-end">
            <Button type="submit" variant="amber" className="w-full sm:w-auto" disabled={loading}>
              {loading ? "Guardando..." : "Agregar"}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmModal
        open={!!dup}
        title="Material ya existe"
        message={
          dup
            ? `${dup.name} ya existe.\n\nStock actual: ${dup.cantidad} ${dup.unit}\nCantidad ingresada: ${dup.qty}\nNuevo stock: ${dup.cantidad + dup.qty}\n\n¿Agregar al stock?`
            : ""
        }
        confirmText="Agregar al stock"
        tone="amber"
        onConfirm={handleAddStock}
        onCancel={() => setDup(null)}
      />
    </div>
  );
}
