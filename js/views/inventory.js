import { materials, movements, computeFor } from '../db.js';
import { $, escapeHtml } from '../ui.js';

function renderInventario(filter) {
  filter = (filter || '').trim().toLowerCase();
  const body = $('#inv-body');
  body.innerHTML = '';
  let lowCount = 0, totalExist = 0;
  const rows = materials
    .filter(m => m.name.toLowerCase().includes(filter))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const m of materials) {
    totalExist += Number(m.cantidad);
    if (Number(m.cantidad) <= Number(m.umbral)) lowCount++;
  }

  const now = new Date();
  const mesActual = now.toISOString().slice(0, 7);
  const entradasMes = movements.filter(mv => mv.type === 'Entrada' && mv.date.startsWith(mesActual)).length;
  const salidasMes = movements.filter(mv => mv.type === 'Salida' && mv.date.startsWith(mesActual)).length;

  $('#stat-row').innerHTML = `
    <div class="stat"><div class="label">Materiales</div><div class="value">${materials.length}</div></div>
    <div class="stat good"><div class="label">Existencia total</div><div class="value">${totalExist}</div></div>
    <div class="stat ${lowCount > 0 ? 'warn' : ''}"><div class="label">Bajo stock</div><div class="value">${lowCount}</div></div>
    <div class="stat"><div class="label">Entradas del mes</div><div class="value">${entradasMes}</div></div>
    <div class="stat"><div class="label">Salidas del mes</div><div class="value">${salidasMes}</div></div>
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
    const cantidad = Number(m.cantidad);
    const umbral = Number(m.umbral);
    const low = cantidad <= umbral;
    const pct = umbral > 0 ? Math.min(100, Math.round((cantidad / (umbral * 2 || 1)) * 100)) : 100;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Material" class="mat-name">${escapeHtml(m.name)}</td>
      <td data-label="Categoría">${escapeHtml(m.category || '—')}</td>
      <td data-label="Entradas" class="num">${c.entradas}</td>
      <td data-label="Salidas" class="num">${c.salidas}</td>
      <td data-label="Existencia" class="num">${cantidad}</td>
      <td data-label="Nivel">
        <div class="stockbar">
          <div class="track"><div class="fill ${low ? 'low' : 'ok'}" style="width:${pct}%"></div></div>
          <span class="mono">umbral ${umbral}</span>
        </div>
      </td>
      <td data-label="Última salida" class="mono">${c.lastSalida ? c.lastSalida : '—'}</td>
      <td data-label="Estado"><span class="pill ${low ? 'pill-low' : 'pill-ok'}">${low ? 'BAJO STOCK' : 'OK'}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderAutocomplete(filter) {
  const list = $('#autocomplete-list');
  const val = filter.trim().toLowerCase();
  if (!val || materials.length === 0) { list.classList.remove('show'); return; }

  const matches = materials
    .filter(m => m.name.toLowerCase().includes(val))
    .slice(0, 8);

  if (matches.length === 0) { list.classList.remove('show'); return; }

  list.innerHTML = matches.map(m => `
    <div class="autocomplete-item" data-id="${m.id}">
      <span class="ac-name">${escapeHtml(m.name)}</span>
      <span class="ac-qty">${Number(m.cantidad)}</span>
      <span class="ac-cat">${escapeHtml(m.category || '—')}</span>
    </div>
  `).join('');
  list.classList.add('show');
}

function selectAutocomplete(id) {
  const list = $('#autocomplete-list');
  list.classList.remove('show');
  const mat = materials.find(m => m.id === id);
  if (mat) {
    $('#search-input').value = mat.name;
    renderInventario(mat.name);
  }
}

function setupSearch() {
  const input = $('#search-input');
  let highlightIdx = -1;

  input.addEventListener('input', (e) => {
    renderInventario(e.target.value);
    renderAutocomplete(e.target.value);
    highlightIdx = -1;
  });

  input.addEventListener('keydown', (e) => {
    const list = $('#autocomplete-list');
    const items = list.querySelectorAll('.autocomplete-item');
    if (!list.classList.contains('show') || items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items.forEach(el => el.classList.remove('highlight'));
      highlightIdx = Math.min(highlightIdx + 1, items.length - 1);
      items[highlightIdx].classList.add('highlight');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items.forEach(el => el.classList.remove('highlight'));
      highlightIdx = Math.max(highlightIdx - 1, 0);
      items[highlightIdx].classList.add('highlight');
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      selectAutocomplete(items[highlightIdx].dataset.id);
    } else if (e.key === 'Escape') {
      list.classList.remove('show');
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => $('#autocomplete-list').classList.remove('show'), 200);
  });

  document.addEventListener('click', (e) => {
    const list = $('#autocomplete-list');
    if (!list.contains(e.target) && e.target !== input) {
      list.classList.remove('show');
    }
  });

  $('#autocomplete-list').addEventListener('click', (e) => {
    const item = e.target.closest('.autocomplete-item');
    if (item) selectAutocomplete(item.dataset.id);
  });
}

export { renderInventario, setupSearch };
