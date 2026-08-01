import { revalidatePath } from "next/cache";

export function mensajeError(
  error: { message?: string } | null,
  fallback: string,
): string {
  if (!error?.message) return fallback;
  if (/No autorizado|JWT|sesión expirada|expired/i.test(error.message)) {
    return "Tu sesión expiró. Vuelve a iniciar sesión.";
  }
  return error.message;
}

export function revalidateAll() {
  revalidatePath("/inventario");
  revalidatePath("/materiales");
  revalidatePath("/movimientos");
}
