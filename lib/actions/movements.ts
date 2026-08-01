"use server";

import { createClient } from "@/lib/supabase/server";
import { mensajeError, revalidateAll } from "./helpers";

export type ActionResult = { error?: string } | void;

export async function registrarMovimiento(
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const materialId = String(formData.get("materialId") ?? "");
  const type = String(formData.get("type") ?? "");
  const qty = Number(formData.get("qty") ?? 0);
  const date = String(formData.get("date") ?? "").trim();
  const observation = String(formData.get("observation") ?? "").trim();

  if (!materialId) return { error: "Selecciona un material." };
  if (type !== "Entrada" && type !== "Salida")
    return { error: "Tipo de movimiento inválido." };
  if (!Number.isFinite(qty) || qty <= 0)
    return { error: "Escribe una cantidad válida." };

  const { error } = await supabase.rpc("registrar_movimiento", {
    p_material_id: materialId,
    p_type: type,
    p_qty: qty,
    p_date: date || null,
    p_observation: observation,
  });
  if (error) {
    return { error: mensajeError(error, "No se pudo registrar el movimiento.") };
  }

  revalidateAll();
}

export async function eliminarMovimiento(
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Movimiento no encontrado." };

  const { error } = await supabase.rpc("eliminar_movimiento", { p_id: id });
  if (error) return { error: mensajeError(error, "No se pudo borrar el movimiento.") };

  revalidateAll();
}
