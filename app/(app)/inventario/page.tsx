import type { Metadata } from "next";
import InventoryView, {
  type InventoryRow,
  type InventoryStats,
} from "@/components/inventory/InventoryView";
import { computeFor, getInventoryData } from "@/lib/queries";
import { materialCode } from "@/lib/material-code";

export const metadata: Metadata = {
  title: "Inventario — Guidom·Soporte",
};

export default async function InventarioPage() {
  const { materials, movements } = await getInventoryData();

  const rows: InventoryRow[] = materials.map((m) => {
    const c = computeFor(movements, m.id);
    return {
      id: m.id,
      code: materialCode(m.id),
      name: m.name,
      category: m.category ?? "",
      location: m.location,
      entradas: c.entradas,
      salidas: c.salidas,
      existencia: Number(m.cantidad),
      umbral: Number(m.umbral),
      lastSalida: c.lastSalida,
    };
  });

  const totalExist = materials.reduce((s, m) => s + Number(m.cantidad), 0);
  const lowCount = materials.filter(
    (m) => Number(m.cantidad) <= Number(m.umbral),
  ).length;
  const mes = new Date().toISOString().slice(0, 7);
  const entradasMes = movements.filter(
    (mv) => mv.type === "Entrada" && mv.date.startsWith(mes),
  ).length;
  const salidasMes = movements.filter(
    (mv) => mv.type === "Salida" && mv.date.startsWith(mes),
  ).length;

  const stats: InventoryStats = {
    materialsCount: materials.length,
    totalExist,
    lowCount,
    entradasMes,
    salidasMes,
  };

  return <InventoryView rows={rows} stats={stats} />;
}
