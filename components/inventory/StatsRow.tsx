import { StatCard } from "@/components/ui/StatCard";

export default function StatsRow({
  materialsCount,
  totalExist,
  lowCount,
  entradasMes,
  salidasMes,
}: {
  materialsCount: number;
  totalExist: number;
  lowCount: number;
  entradasMes: number;
  salidasMes: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <StatCard label="Materiales" value={materialsCount} />
      <StatCard label="Existencia total" value={totalExist} tone="good" />
      <StatCard label="Bajo stock" value={lowCount} tone="warn" />
      <StatCard label="Entradas del mes" value={entradasMes} />
      <StatCard label="Salidas del mes" value={salidasMes} />
    </div>
  );
}
