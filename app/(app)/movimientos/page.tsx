import { getInventoryData } from "@/lib/queries";
import MovementsForm from "@/components/movements/MovementsForm";
import MovementsTable from "@/components/movements/MovementsTable";

export default async function MovimientosPage() {
  const { materials, movements } = await getInventoryData();

  const materialNames: Record<string, string> = {};
  materials.forEach((m) => {
    materialNames[m.id] = m.name;
  });

  return (
    <div className="flex flex-col gap-6">
      <MovementsForm materials={materials} />
      <MovementsTable movements={movements} materialNames={materialNames} />
    </div>
  );
}
