import { getMaterials } from "@/lib/queries";
import MaterialsForm from "@/components/materials/MaterialsForm";
import MaterialsTable from "@/components/materials/MaterialsTable";

export default async function MaterialesPage() {
  const materials = await getMaterials();

  return (
    <div className="flex flex-col gap-6">
      <MaterialsForm />
      <MaterialsTable materials={materials} />
    </div>
  );
}
