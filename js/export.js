import { materials, movements, computeFor } from './db.js';
import { showToast } from './ui.js';

function exportToExcel() {
  if (materials.length === 0) {
    showToast('No hay materiales que exportar');
    return;
  }
  const byId = Object.fromEntries(materials.map(m => [m.id, m.name]));

  const invRows = [...materials]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(m => {
      const c = computeFor(m.id);
      const low = Number(m.cantidad) <= Number(m.umbral);
      return {
        'Material': m.name,
        'Categoría': m.category || '',
        'Total Entradas': c.entradas,
        'Total Salidas': c.salidas,
        'Existencia': Number(m.cantidad),
        'Umbral': Number(m.umbral),
        'Última Salida': c.lastSalida || 'Sin salidas',
        'Estado': low ? 'BAJO STOCK' : 'OK'
      };
    });

  const movRows = [...movements]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(mv => ({
      'Fecha': mv.date,
      'Material': byId[mv.material_id] || '(eliminado)',
      'Tipo': mv.type,
      'Cantidad': mv.qty,
      'Observación': mv.observation || ''
    }));

  const wb = XLSX.utils.book_new();
  const wsInv = XLSX.utils.json_to_sheet(invRows);
  wsInv['!cols'] = [{ wch: 26 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsInv, 'Inventario');
  const wsMov = XLSX.utils.json_to_sheet(movRows.length ? movRows : [{ 'Fecha': '', 'Material': '', 'Tipo': '', 'Cantidad': '', 'Observación': '' }]);
  wsMov['!cols'] = [{ wch: 14 }, { wch: 26 }, { wch: 12 }, { wch: 10 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsMov, 'Movimientos');
  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `inventario_${today}.xlsx`);
  showToast('Excel descargado');
}

export { exportToExcel };
