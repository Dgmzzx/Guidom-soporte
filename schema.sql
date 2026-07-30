CREATE TABLE materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  unit TEXT DEFAULT 'piezas',
  location TEXT DEFAULT '',
  observations TEXT DEFAULT '',
  cantidad INTEGER DEFAULT 0,
  umbral INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Entrada', 'Salida')),
  qty INTEGER NOT NULL,
  date DATE NOT NULL,
  observation TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_movements_material_id ON movements(material_id);
CREATE INDEX idx_movements_date ON movements(date);