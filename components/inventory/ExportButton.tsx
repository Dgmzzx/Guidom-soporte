"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/Toast";

export default function ExportButton() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        toast.show(body?.error ?? "Error al exportar.", "error");
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename =
        match?.[1] ?? `inventario_${new Date().toISOString().slice(0, 10)}.xlsx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.show("Excel descargado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" onClick={handleExport} disabled={loading}>
      {loading ? "Generando..." : "Exportar a Excel"}
    </Button>
  );
}
