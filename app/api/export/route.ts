import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";
import { computeFor } from "@/lib/queries";
import type { Material, Movement } from "@/lib/types";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [{ data: matsData }, { data: movsData }] = await Promise.all([
    supabase.from("materials").select("*").order("name"),
    supabase.from("movements").select("*").order("date", { ascending: false }),
  ]);

  const materials = (matsData as Material[]) ?? [];
  const movements = (movsData as Movement[]) ?? [];

  if (materials.length === 0) {
    return NextResponse.json(
      { error: "No hay materiales que exportar." },
      { status: 400 },
    );
  }

  const byId = new Map(materials.map((m) => [m.id, m.name]));

  const invRows = [...materials]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((m) => {
      const c = computeFor(movements, m.id);
      const low = Number(m.cantidad) <= Number(m.umbral);
      return {
        Material: m.name,
        Categoría: m.category ?? "",
        "Total Entradas": c.entradas,
        "Total Salidas": c.salidas,
        Existencia: Number(m.cantidad),
        Umbral: Number(m.umbral),
        "Última Salida": c.lastSalida ?? "Sin salidas",
        Estado: low ? "BAJO STOCK" : "OK",
      };
    });

  const movRows = movements.map((mv) => ({
    Fecha: mv.date,
    Material: byId.get(mv.material_id) ?? "(eliminado)",
    Tipo: mv.type,
    Cantidad: mv.qty,
    Observación: mv.observation ?? "",
  }));

  const wb = XLSX.utils.book_new();

  const wsInv = XLSX.utils.json_to_sheet(invRows);
  wsInv["!cols"] = [
    { wch: 26 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 10 },
    { wch: 14 },
    { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(wb, wsInv, "Inventario");

  const wsMov = XLSX.utils.json_to_sheet(
    movRows.length
      ? movRows
      : [{ Fecha: "", Material: "", Tipo: "", Cantidad: "", Observación: "" }],
  );
  wsMov["!cols"] = [
    { wch: 14 },
    { wch: 26 },
    { wch: 12 },
    { wch: 10 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, wsMov, "Movimientos");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="inventario_${today}.xlsx"`,
    },
  });
}
