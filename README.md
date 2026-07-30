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

