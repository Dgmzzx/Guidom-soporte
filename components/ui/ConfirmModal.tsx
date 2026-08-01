"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message: ReactNode;
  confirmText?: string;
  tone?: "danger" | "amber";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-graphite/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-xl border border-line bg-steel p-6 shadow-2xl"
      >
        {title && <h3 className="font-display text-lg font-bold text-paper">{title}</h3>}
        <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-paper-dim">
          {message}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant={tone === "danger" ? "danger" : "amber"} onClick={onConfirm} disabled={loading}>
            {loading ? "Procesando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
