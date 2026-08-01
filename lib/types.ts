export type Material = {
  id: string;
  name: string;
  category: string | null;
  unit: string;
  location: string | null;
  observations: string | null;
  cantidad: number;
  umbral: number;
  created_at: string;
};

export type Movement = {
  id: string;
  material_id: string;
  type: "Entrada" | "Salida";
  qty: number;
  date: string;
  observation: string | null;
  created_at: string;
};

export type MovementType = Movement["type"];

export type ComputedMovement = {
  entradas: number;
  salidas: number;
  lastSalida: string | null;
};
