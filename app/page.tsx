import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { StatCard } from "@/components/ui/StatCard";
import { StockBar } from "@/components/ui/StockBar";
import { BinTag } from "@/components/ui/BinTag";

type Sample = {
  code: string;
  name: string;
  category: string;
  location: string;
  entradas: number;
  salidas: number;
  existencia: number;
  umbral: number;
  lastSalida: string | null;
};

const sample: Sample[] = [
  {
    code: "M-0012",
    name: "Tornillo 1/4 x 1",
    category: "Ferretería",
    location: "Estante A3",
    entradas: 23,
    salidas: 4,
    existencia: 19,
    umbral: 12,
    lastSalida: "2026-07-28",
  },
  {
    code: "M-0034",
    name: "Cable calibre 12",
    category: "Electricidad",
    location: "Estante B1",
    entradas: 8,
    salidas: 12,
    existencia: 6,
    umbral: 15,
    lastSalida: "2026-07-30",
  },
  {
    code: "M-0041",
    name: "Tubo PVC 1/2",
    category: "Plomería",
    location: "Caja C7",
    entradas: 5,
    salidas: 0,
    existencia: 5,
    umbral: 0,
    lastSalida: null,
  },
  {
    code: "M-0057",
    name: "Taladro inalámbrico",
    category: "Herramientas",
    location: "Rack 2",
    entradas: 2,
    salidas: 1,
    existencia: 1,
    umbral: 1,
    lastSalida: "2026-07-22",
  },
];

function SectionTitle({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="rounded-[5px] border border-safety/40 bg-safety/10 px-2 py-0.5 font-mono text-[11px] font-bold text-safety">
        {step}
      </span>
      <h2 className="font-display text-lg font-bold text-paper">{children}</h2>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header
        actions={
          <Button variant="ghost" size="sm">
            Cerrar sesión
          </Button>
        }
      />
      <Tabs />

      <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
        <div className="mb-6">
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-safety">
            Preview — Sistema de diseño
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-paper">
            Dirección &ldquo;Almacén industrial&rdquo;
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-paper-dim">
            Mockup de la vista Inventario con los tokens finales (graphite, steel,
            safety, flux, amber) y los componentes: BinTag, StockBar, Pill y
            StatCard.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Materiales" value="4" />
          <StatCard label="Existencia total" value="31" tone="good" />
          <StatCard label="Bajo stock" value="2" tone="warn" />
          <StatCard label="Entradas del mes" value="6" />
          <StatCard label="Salidas del mes" value="3" />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-[6px] border border-line bg-steel px-3 focus-within:border-safety/60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-paper-dim"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar material..."
              className="w-full bg-transparent py-2 text-sm text-paper placeholder:text-paper-dim/60 focus:outline-none"
            />
          </div>
          <Button variant="ghost">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M12 15V3M12 15l-4-4M12 15l4-4" />
              <path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
            </svg>
            Exportar a Excel
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-steel">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 text-right font-medium">Entradas</th>
                <th className="px-4 py-3 text-right font-medium">Salidas</th>
                <th className="px-4 py-3 text-right font-medium">Existencia</th>
                <th className="px-4 py-3 font-medium">Nivel</th>
                <th className="px-4 py-3 font-medium">Última salida</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sample.map((m) => {
                const low = m.existencia <= m.umbral;
                return (
                  <tr
                    key={m.code}
                    className="group border-b border-line/60 last:border-b-0 transition-colors hover:bg-steel-hover"
                  >
                    <td className="px-4 py-3">
                      <div className="mb-1.5 transition-transform duration-150 group-hover:-translate-y-px">
                        <BinTag code={m.code} location={m.location} />
                      </div>
                      <div className="font-semibold text-paper">{m.name}</div>
                    </td>
                    <td className="px-4 py-3 text-paper-dim">{m.category}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-paper">
                      {m.entradas}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-paper">
                      {m.salidas}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-paper">
                      {m.existencia}
                    </td>
                    <td className="px-4 py-3">
                      <StockBar cantidad={m.existencia} umbral={m.umbral} />
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-paper-dim">
                      {m.lastSalida ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={low ? "low" : "ok"}>
                        {low ? "Bajo stock" : "OK"}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <section>
            <SectionTitle step="01">Botones</SectionTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Registrar</Button>
              <Button variant="amber">Agregar</Button>
              <Button variant="ghost">Exportar</Button>
              <Button variant="danger">Borrar</Button>
            </div>
          </section>

          <section>
            <SectionTitle step="02">Píldoras</SectionTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Pill tone="entrada">Entrada</Pill>
              <Pill tone="salida">Salida</Pill>
              <Pill tone="ok">OK</Pill>
              <Pill tone="low">Bajo stock</Pill>
            </div>
          </section>

          <section>
            <SectionTitle step="03">Formulario</SectionTitle>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                  Material
                </label>
                <input
                  className="w-full rounded-[6px] border border-line bg-steel px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus:border-safety/60 focus:outline-none"
                  placeholder="Ej. Tornillo 1/4"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                  Tipo
                </label>
                <select className="w-full rounded-[6px] border border-line bg-steel px-3 py-2 text-sm text-paper focus:border-safety/60 focus:outline-none">
                  <option>Entrada</option>
                  <option>Salida</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 rounded-lg border border-dashed border-line bg-steel-deep/40 p-4 text-center">
          <p className="font-mono text-[11px] text-paper-dim">
            Parte 1 completa — el resto de vistas se construye en las partes 5–7.
          </p>
        </div>
      </div>
    </main>
  );
}
