import { supabase, loadData } from '../db.js';
import { $ } from '../ui.js';
import { renderInventario, setupSearch } from '../views/inventory.js';
import { exportToExcel } from '../export.js';

async function init() {
  await loadData();
  renderInventario('');
  setupSearch();
  $('#export-btn').addEventListener('click', exportToExcel);
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
