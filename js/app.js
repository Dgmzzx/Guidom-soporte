import { loadData } from './db.js';
import { checkAuth, setupAuth } from './auth.js';
import { $, $$ } from './ui.js';
import { exportToExcel } from './export.js';
import { renderInventario, setupSearch } from './views/inventory.js';
import { fillMaterialSelect, renderMovimientos, setupMovements } from './views/movements.js';
import { renderMateriales, setupMaterials } from './views/materials.js';

function renderAll() {
  renderInventario($('#search-input').value);
  renderMateriales();
  fillMaterialSelect();
  renderMovimientos();
}

let inited = false;

async function init() {
  if (inited) return;
  inited = true;
  $('#mov-fecha').value = new Date().toISOString().slice(0, 10);
  await loadData();
  renderAll();
}

$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.view').forEach(v => v.classList.remove('active'));
    $('#view-' + btn.dataset.view).classList.add('active');
  });
});

setupSearch();
setupMovements(renderAll);
setupMaterials(renderAll);

$('#export-btn').addEventListener('click', exportToExcel);

setupAuth(init);
checkAuth().then(authed => {
  if (authed) init();
});
