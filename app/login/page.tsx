import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — Guidom·Soporte",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = typeof searchParams.next === "string" ? searchParams.next : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-line bg-steel p-8 shadow-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="font-display text-2xl font-bold tracking-tight text-paper">
              Guidom<span className="text-safety">·</span>Soporte
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-widest2 text-paper-dim">
              Conteo de entradas y salidas
            </div>
            <div className="mt-4 h-px w-full bg-line" />
          </div>
          <LoginForm next={next} />
        </div>
        <p className="mt-4 text-center font-mono text-[10px] text-paper-dim/60">
          Acceso restringido — almacén industrial
        </p>
      </div>
    </main>
  );
}
