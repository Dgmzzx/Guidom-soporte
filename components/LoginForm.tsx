"use client";

import { useState } from "react";
import { login } from "@/lib/actions/auth";

export default function LoginForm({ next }: { next?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    if (res && "error" in res) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next || "/inventario"} />

      <div>
        <label
          htmlFor="email"
          className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-[6px] border border-line bg-graphite px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus:border-safety/60 focus:outline-none"
          placeholder="nombre@guidom.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-[6px] border border-line bg-graphite px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus:border-safety/60 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-[6px] border border-alert/30 bg-alert/10 px-3 py-2 text-[13px] text-alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-[6px] bg-safety px-4 py-2 text-[13px] font-semibold text-graphite shadow-sm transition-all duration-150 hover:bg-safety-hover active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-safety/70 focus-visible:ring-offset-2 focus-visible:ring-offset-graphite disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
