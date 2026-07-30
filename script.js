import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let materials = [];
let movements = [];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

async function loadData() {
  const { data: mats, error: errMats } = await supabase.from('materials').select('*').order('name');
  if (errMats) { console.error(errMats); showToast('Error al cargar materiales'); return; }
  materials = mats || [];

  const { data: movs, error: errMovs } = await supabase.from('movements').select('*').order('date', { ascending: false });
  if (errMovs) { console.error(errMovs); showToast('Error al cargar movimientos'); return; }
  movements = movs || [];
}

function computeFor(materialId) {
  let entradas = 0, salidas = 0, lastSalida = null;
  for (const mv of movements) {
    if (mv.material_id !== materialId) continue;
    if (mv.type === 'Entrada') entradas += Number(mv.qty);
    else {
      salidas += Number(mv.qty);
      if (!lastSalida || mv.date > lastSalida) lastSalida = mv.date;
    }
  }
  return { entradas, salidas, existencia: entradas - salidas, lastSalida };
}

$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.view').forEach(v => v.classList.remove('active'));
    $('#view-' + btn.dataset.view).classList.add('active');
  });
});

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function renderInventario(filter) {
  filter = (filter || '').trim().toLowerCase();
  const body = $('#inv-body');
  body.innerHTML = '';
  let lowCount = 0, totalExist = 0;
  const rows = materials
    .filter(m => m.name.toLowerCase().includes(filter))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const m of materials) {
    const c = computeFor(m.id);
    totalExist += c.existencia;
    if (c.existencia <= m.min) lowCount++;
  }

  $('#stat-row').innerHTML = `
    <div class="stat"><div class="label">Materiales</div><div class="value">${materials.length}</div></div>
    <div class="stat good"><div class="label">Existencia total</div><div class="value">${totalExist}</div></div>
    <div class="stat ${lowCount > 0 ? 'warn' : ''}"><div class="label">Bajo stock</div><div class="value">${lowCount}</div></div>
  `;

  if (materials.length === 0) {
    $('#inv-empty').style.display = 'block';
    return;
  }
  $('#inv-empty').style.display = rows.length ? 'none' : 'block';
  if (rows.length === 0 && materials.length > 0) {
    $('#inv-empty').innerHTML = '<div class="big">Sin resultados</div>No hay materiales que coincidan con tu búsqueda.';
  }

  for (const m of rows) {
    const c = computeFor(m.id);
    const low = c.existencia <= m.min;
    const pct = m.min > 0 ? Math.min(100, Math.round((c.existencia / (m.min * 2 || 1)) * 100)) : 100;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Material" class="mat-name">${escapeHtml(m.name)}</td>
      <td data-label="Entradas" class="num">${c.entradas}</td>
      <td data-label="Salidas" class="num">${c.salidas}</td>
      <td data-label="Existencia" class="num">${c.existencia}</td>
      <td data-label="Nivel">
        <div class="stockbar">
          <div class="track"><div class="fill ${low ? 'low' : 'ok'}" style="width:${pct}%"></div></div>
          <span class="mono">min ${m.min}</span>
        </div>
      </td>
      <td data-label="Última salida" class="mono">${c.lastSalida ? c.lastSalida : '—'}</td>
      <td data-label="Estado"><span class="pill ${low ? 'pill-low' : 'pill-ok'}">${low ? 'BAJO STOCK' : 'OK'}</span></td>
    `;
    body.appendChild(tr);
  }
}

$('#search-input').addEventListener('input', (e) => renderInventario(e.target.value));

function renderMateriales() {
  const body = $('#mat-body');
  body.innerHTML = '';
  $('#mat-count').textContent = materials.length ? `(${materials.length})` : '';
  $('#mat-empty').style.display = materials.length ? 'none' : 'block';
  const sorted = [...materials].sort((a, b) => a.name.localeCompare(b.name));
  for (const m of sorted) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Material" class="mat-name">${escapeHtml(m.name)}</td>
      <td data-label="Stock mínimo" class="num mono">${m.min}</td>
      <td class="actions-cell"><button class="btn btn-danger" data-del="${m.id}">Eliminar</button></td>
    `;
    body.appendChild(tr);
  }
  body.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.del;
      const mat = materials.find(m => m.id === id);
      if (!confirm(`¿Eliminar "${mat.name}"? También se borrará su historial de movimientos.`)) return;
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) { showToast('Error al eliminar'); return; }
      materials = materials.filter(m => m.id !== id);
      movements = movements.filter(mv => mv.material_id !== id);
      renderAll();
      showToast('Material eliminado');
    });
  });
}

$('#mat-add').addEventListener('click', async () => {
  const nameInput = $('#mat-nombre');
  const minInput = $('#mat-minimo');
  const name = nameInput.value.trim();
  const min = Number(minInput.value || 0);
  if (!name) { showToast('Escribe un nombre de material'); nameInput.focus(); return; }
  if (materials.some(m => m.name.toLowerCase() === name.toLowerCase())) {
    showToast('Ese material ya existe'); return;
  }
  const { data, error } = await supabase.from('materials').insert({ name, min: min < 0 ? 0 : min }).select();
  if (error) { showToast('Error al guardar'); return; }
  materials.push(data[0]);
  nameInput.value = '';
  minInput.value = '';
  renderAll();
  showToast('Material agregado');
  nameInput.focus();
});

function fillMaterialSelect() {
  const sel = $('#mov-material');
  const current = sel.value;
  sel.innerHTML = materials.length
    ? materials.slice().sort((a, b) => a.name.localeCompare(b.name)).map(m => `<option value="${m.id}">${escapeHtml(m.name)}</option>`).join('')
    : '<option value="">No hay materiales — agrégalos primero</option>';
  if (materials.some(m => m.id === current)) sel.value = current;
}

function renderMovimientos() {
  const body = $('#mov-body');
  body.innerHTML = '';
  $('#mov-count').textContent = movements.length ? `(${movements.length})` : '';
  $('#mov-empty').style.display = movements.length ? 'none' : 'block';
  const byId = Object.fromEntries(materials.map(m => [m.id, m.name]));
  const sorted = [...movements].sort((a, b) => b.date.localeCompare(a.date) || 0);
  for (const mv of sorted) {
    const tr = document.createElement('tr');
    const matName = byId[mv.material_id] || '(eliminado)';
    tr.innerHTML = `
      <td data-label="Fecha" class="mono">${mv.date}</td>
      <td data-label="Material">${escapeHtml(matName)}</td>
      <td data-label="Tipo"><span class="pill ${mv.type === 'Entrada' ? 'pill-entrada' : 'pill-salida'}">${mv.type}</span></td>
      <td data-label="Cantidad" class="num mono">${mv.qty}</td>
      <td class="actions-cell"><button class="btn btn-danger" data-delmv="${mv.id}">Borrar</button></td>
    `;
    body.appendChild(tr);
  }
  body.querySelectorAll('[data-delmv]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.delmv;
      const { error } = await supabase.from('movements').delete().eq('id', id);
      if (error) { showToast('Error al borrar'); return; }
      movements = movements.filter(mv => mv.id !== id);
      renderAll();
      showToast('Movimiento borrado');
    });
  });
}

$('#mov-add').addEventListener('click', async () => {
  const matSel = $('#mov-material');
  const tipo = $('#mov-tipo').value;
  const qtyInput = $('#mov-cantidad');
  const dateInput = $('#mov-fecha');
  const materialId = matSel.value;
  const qty = Number(qtyInput.value);
  const date = dateInput.value || new Date().toISOString().slice(0, 10);

  if (!materialId) { showToast('Primero agrega un material'); return; }
  if (!qty || qty <= 0) { showToast('Escribe una cantidad válida'); qtyInput.focus(); return; }

  const { data, error } = await supabase.from('movements').insert({ material_id: materialId, type: tipo, qty, date }).select();
  if (error) { showToast('Error al registrar'); return; }
  movements.push(data[0]);
  qtyInput.value = '';
  renderAll();
  showToast(`${tipo} registrada`);
});

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
      const low = c.existencia <= m.min;
      return {
        'Material': m.name,
        'Total Entradas': c.entradas,
        'Total Salidas': c.salidas,
        'Existencia': c.existencia,
        'Stock Mínimo': m.min,
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
      'Cantidad': mv.qty
    }));

  const wb = XLSX.utils.book_new();
  const wsInv = XLSX.utils.json_to_sheet(invRows);
  wsInv['!cols'] = [{ wch: 26 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 13 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsInv, 'Inventario');
  const wsMov = XLSX.utils.json_to_sheet(movRows.length ? movRows : [{ 'Fecha': '', 'Material': '', 'Tipo': '', 'Cantidad': '' }]);
  wsMov['!cols'] = [{ wch: 14 }, { wch: 26 }, { wch: 12 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, wsMov, 'Movimientos');
  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `inventario_${today}.xlsx`);
  showToast('Excel descargado');
}

$('#export-btn').addEventListener('click', exportToExcel);

function renderAll() {
  renderInventario($('#search-input').value);
  renderMateriales();
  fillMaterialSelect();
  renderMovimientos();
}

async function init() {
  $('#mov-fecha').value = new Date().toISOString().slice(0, 10);
  await loadData();
  renderAll();
}

init();