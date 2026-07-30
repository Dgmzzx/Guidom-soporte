# Guidom·Soporte — Conteo de Entradas y Salidas

Aplicación web de inventario para gestionar materiales y registrar movimientos de entrada y salida. Construida con JavaScript vanilla y Supabase como backend.

## Características

- Autenticación por email con Supabase Auth
- CRUD de materiales con stock mínimo configurable
- Registro de movimientos (entrada/salida) con fecha
- Vista de inventario con cálculo automático de existencia
- Indicador de nivel: stock bajo, agotado o sin mínimo definido
- Exportación a Excel (SheetJS)
- Historial de movimientos con opción de eliminar
- Confirmación modal antes de eliminar registros

## Tecnologías

- HTML5 / CSS3 / JavaScript (ES Modules)
- [Supabase](https://supabase.com) — Auth, PostgreSQL, REST API
- [SheetJS](https://sheetjs.com) — Exportación a Excel
- Google Fonts (Space Grotesk, Inter, JetBrains Mono)

## Uso

1. Clona el repositorio y abre `index.html` en un navegador.
2. Inicia sesión con un usuario registrado en Supabase.
3. Ve a la pestaña **Materiales** para dar de alta el primer material.
4. Registra movimientos en la pestaña **Movimientos**.
5. Consulta el inventario actualizado en la pestaña **Inventario**.

> También puedes servir los archivos con cualquier servidor HTTP local (ej. `python -m http.server 8000`).

## Estructura

```
inventario-app/
├── index.html           # Interfaz principal
├── style.css            # Estilos
├── script.js            # Lógica de la aplicación
├── supabase-config.js   # Credenciales de Supabase
└── schema.sql           # Esquema de base de datos
```

## Base de datos

```sql
-- Materiales
CREATE TABLE materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  min INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Movimientos
CREATE TABLE movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Entrada', 'Salida')),
  qty INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Notas

- `supabase-config.js` debe contener las credenciales (`SUPABASE_URL` y `SUPABASE_ANON_KEY`) de un proyecto de Supabase activo.
- La tabla `movements` tiene un índice sobre `material_id` y `date` para consultas eficientes.
