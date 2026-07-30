import { supabase, materials, movements } from '../db.js';
import { $, showToast, showConfirmModal, escapeHtml } from '../ui.js';

let onChange = null;

function setOnChange(cb) { onChange = cb; }

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
      <td data-label="Observación" class="mono">${escapeHtml(mv.observation || '')}</td>
      <td class="actions-cell"><button class="btn btn-danger" data-delmv="${mv.id}">Borrar</button></td>
    `;
    body.appendChild(tr);
  }
  body.querySelectorAll('[data-delmv]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.delmv;
      const mv = movements.find(m => m.id === id);
      if (!mv) return;
      showConfirmModal('¿Borrar este movimiento? Se revertirá el stock del material.', async () => {
        const mat = materials.find(m => m.id === mv.material_id);
        if (mat) {
          const delta = mv.type === 'Entrada' ? -mv.qty : mv.qty;
          const nuevaCantidad = Math.max(0, mat.cantidad + delta);
          const { error: errUpd } = await supabase.from('materials').update({ cantidad: nuevaCantidad }).eq('id', mat.id);
          if (errUpd) { showToast('Error al revertir stock'); return; }
          mat.cantidad = nuevaCantidad;
        }
        const { error } = await supabase.from('movements').delete().eq('id', id);
        if (error) { showToast('Error al borrar'); return; }
        movements.splice(movements.findIndex(m => m.id === id), 1);
        if (onChange) onChange();
        showToast('Movimiento borrado');
      });
    });
  });
}

function setupMovements(onChangeCb) {
  setOnChange(onChangeCb);

  $('#mov-add').addEventListener('click', async () => {
    const matSel = $('#mov-material');
    const tipo = $('#mov-tipo').value;
    const qtyInput = $('#mov-cantidad');
    const dateInput = $('#mov-fecha');
    const obsInput = $('#mov-observacion');
    const materialId = matSel.value;
    const qty = Number(qtyInput.value);
    const date = dateInput.value || new Date().toISOString().slice(0, 10);
    const observation = obsInput.value.trim();

    if (!materialId) { showToast('Primero selecciona un material'); return; }
    if (!qty || qty <= 0) { showToast('Escribe una cantidad válida'); qtyInput.focus(); return; }

    const mat = materials.find(m => m.id === materialId);
    if (!mat) { showToast('Material no encontrado'); return; }

    if (tipo === 'Salida' && qty > mat.cantidad) {
      showToast(`Stock insuficiente. Disponible: ${mat.cantidad}`);
      return;
    }

    const delta = tipo === 'Entrada' ? qty : -qty;
    const { error: errUpd } = await supabase.from('materials').update({ cantidad: mat.cantidad + delta }).eq('id', mat.id);
    if (errUpd) { showToast('Error al actualizar stock'); return; }
    mat.cantidad += delta;

    const { data, error } = await supabase.from('movements').insert({ material_id: materialId, type: tipo, qty, date, observation }).select();
    if (error) { showToast('Error al registrar'); return; }
    movements.push(data[0]);

    qtyInput.value = '';
    obsInput.value = '';
    if (onChange) onChange();
    showToast(`${tipo} registrada`);
  });
}

export { fillMaterialSelect, renderMovimientos, setupMovements };
