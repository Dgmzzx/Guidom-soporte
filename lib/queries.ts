import { createClient } from "@/lib/supabase/server";
import type { ComputedMovement, Material, Movement } from "@/lib/types";

export async function getMaterials(): Promise<Material[]> {
  const supabase = createClient();
  const { data } = await supabase.from("materials").select("*").order("name");
  return (data as Material[]) ?? [];
}

export async function getMovements(): Promise<Movement[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("movements")
    .select("*")
    .order("date", { ascending: false });
  return (data as Movement[]) ?? [];
}

export function computeFor(
  movements: Movement[],
  materialId: string,
): ComputedMovement {
  let entradas = 0;
  let salidas = 0;
  let lastSalida: string | null = null;

  for (const mv of movements) {
    if (mv.material_id !== materialId) continue;
    if (mv.type === "Entrada") {
      entradas += Number(mv.qty);
    } else {
      salidas += Number(mv.qty);
      if (!lastSalida || mv.date > lastSalida) lastSalida = mv.date;
    }
  }

  return { entradas, salidas, lastSalida };
}

export async function getInventoryData() {
  const [materials, movements] = await Promise.all([
    getMaterials(),
    getMovements(),
  ]);
  const byId = new Map(materials.map((m) => [m.id, m.name]));
  return { materials, movements, byId };
}
