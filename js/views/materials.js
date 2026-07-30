import { supabase, materials, movements } from '../db.js';
import { $, showToast, showConfirmModal, escapeHtml } from '../ui.js';

let onChange = null;

function setOnChange(cb) { onChange = cb; }

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
      <td data-label="Categoría">${escapeHtml(m.category || '—')}</td>
      <td data-label="Cantidad" class="num mono">${Number(m.cantidad)}</td>
      <td data-label="Umbral" class="num mono">${Number(m.umbral)}</td>
      <td data-label="Ubicación">${escapeHtml(m.location || '—')}</td>
      <td class="actions-cell"><button class="btn btn-danger" data-del="${m.id}">Eliminar</button></td>
    `;
    body.appendChild(tr);
  }
  body.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.del;
      const mat = materials.find(m => m.id === id);
      showConfirmModal(`¿Eliminar "${mat.name}"? También se borrará su historial de movimientos.`, async () => {
        const { error } = await supabase.from('materials').delete().eq('id', id);
        if (error) { showToast('Error al eliminar'); return; }
        materials.splice(materials.findIndex(m => m.id === id), 1);
        movements = movements.filter(mv => mv.material_id !== id);
        if (onChange) onChange();
        showToast('Material eliminado');
      });
    });
  });
}

function setupMaterials(onChangeCb) {
  setOnChange(onChangeCb);

  $('#mat-add').addEventListener('click', async () => {
    const nameInput = $('#mat-nombre');
    const catInput = $('#mat-categoria');
    const unidadInput = $('#mat-unidad');
    const cantInput = $('#mat-cantidad');
    const umbralInput = $('#mat-umbral');
    const ubicInput = $('#mat-ubicacion');
    const obsInput = $('#mat-observaciones');

    const name = nameInput.value.trim();
    if (!name) { showToast('Escribe un nombre de material'); nameInput.focus(); return; }

    const existing = materials.find(m => m.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      const cantNueva = Math.max(0, Number(cantInput.value || 0));
      const total = existing.cantidad + cantNueva;
      showConfirmModal(
        `"${existing.name}" ya existe.\n\nStock actual: ${existing.cantidad} ${existing.unit}\nCantidad ingresada: ${cantNueva}\nNuevo stock: ${total}\n\n¿Agregar al stock?`,
        async () => {
          const nuevaCantidad = existing.cantidad + cantNueva;
          const { error } = await supabase.from('materials').update({ cantidad: nuevaCantidad }).eq('id', existing.id);
          if (error) { showToast('Error al actualizar'); return; }
          existing.cantidad = nuevaCantidad;
          if (cantNueva > 0) {
            const { data: mov, error: errMov } = await supabase.from('movements').insert({
              material_id: existing.id, type: 'Entrada', qty: cantNueva,
              date: new Date().toISOString().slice(0, 10), observation: 'Agregado desde duplicado'
            }).select();
            if (!errMov) movements.push(mov[0]);
          }
          nameInput.value = ''; catInput.value = ''; cantInput.value = '';
          umbralInput.value = ''; ubicInput.value = ''; obsInput.value = '';
          if (onChange) onChange();
          showToast('Stock actualizado');
          nameInput.focus();
        },
        { confirmText: 'Agregar al stock', confirmClass: 'btn-amber' }
      );
      return;
    }

    const category = catInput.value.trim();
    const unit = unidadInput.value;
    const cantidad = Math.max(0, Number(cantInput.value || 0));
    const umbral = Math.max(0, Number(umbralInput.value || 0));
    const location = ubicInput.value.trim();
    const observations = obsInput.value.trim();

    const { data, error } = await supabase.from('materials').insert({
      name, category, unit, cantidad, umbral, location, observations
    }).select();
    if (error) { showToast('Error al guardar'); return; }
    materials.push(data[0]);

    if (cantidad > 0) {
      const { data: mov, error: errMov } = await supabase.from('movements').insert({
        material_id: data[0].id, type: 'Entrada', qty: cantidad,
        date: new Date().toISOString().slice(0, 10), observation: 'Alta inicial'
      }).select();
      if (!errMov) movements.push(mov[0]);
    }

    nameInput.value = ''; catInput.value = ''; cantInput.value = '';
    umbralInput.value = ''; ubicInput.value = ''; obsInput.value = '';
    if (onChange) onChange();
    showToast('Material agregado');
    nameInput.focus();
  });
}

export { renderMateriales, setupMaterials };
