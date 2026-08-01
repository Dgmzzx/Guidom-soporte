"use server";

import { createClient } from "@/lib/supabase/server";
import { mensajeError, revalidateAll } from "./helpers";

export type ActionResult = { error?: string } | void;

export async function crearMaterial(
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const unit = String(formData.get("unit") ?? "piezas").trim() || "piezas";
  const cantidad = Number(formData.get("cantidad") ?? 0);
  const umbral = Number(formData.get("umbral") ?? 0);
  const location = String(formData.get("location") ?? "").trim();
  const observations = String(formData.get("observations") ?? "").trim();

  if (!name) return { error: "Escribe un nombre de material." };
  if (!Number.isFinite(cantidad) || cantidad < 0)
    return { error: "Cantidad inicial inválida." };
  if (!Number.isFinite(umbral) || umbral < 0)
    return { error: "Umbral inválido." };

  const { error } = await supabase.rpc("crear_material", {
    p_name: name,
    p_category: category,
    p_unit: unit,
    p_cantidad: cantidad,
    p_umbral: umbral,
    p_location: location,
    p_observations: observations,
  });
  if (error) return { error: mensajeError(error, "No se pudo crear el material.") };

  revalidateAll();
}

export async function agregarStock(
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const materialId = String(formData.get("materialId") ?? "");
  const qty = Number(formData.get("qty") ?? 0);

  if (!materialId) return { error: "Material no encontrado." };
  if (!Number.isFinite(qty) || qty <= 0)
    return { error: "Escribe una cantidad válida." };

  const { error } = await supabase.rpc("agregar_stock", {
    p_material_id: materialId,
    p_qty: qty,
  });
  if (error) return { error: mensajeError(error, "No se pudo agregar stock.") };

  revalidateAll();
}

export async function eliminarMaterial(
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Material no encontrado." };

  const { error } = await supabase.rpc("eliminar_material", { p_id: id });
  if (error) return { error: mensajeError(error, "No se pudo eliminar el material.") };

  revalidateAll();
}
