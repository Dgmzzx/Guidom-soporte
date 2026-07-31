import { supabase, loadData } from '../db.js';
import { $ } from '../ui.js';
import { fillMaterialSelect, renderMovimientos, setupMovements } from '../views/movements.js';

function renderAll() {
  fillMaterialSelect();
  renderMovimientos();
}

async function init() {
  $('#mov-fecha').value = new Date().toISOString().slice(0, 10);
  await loadData();
  renderAll();
  setupMovements(renderAll);
  $('#logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') window.location.href = 'index.html';
  });
}

const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  window.location.href = 'index.html';
} else {
  init();
}
