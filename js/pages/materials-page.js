import { supabase, loadData } from '../db.js';
import { $ } from '../ui.js';
import { renderMateriales, setupMaterials } from '../views/materials.js';

function renderAll() {
  renderMateriales();
}

async function init() {
  await loadData();
  renderAll();
  setupMaterials(renderAll);
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
