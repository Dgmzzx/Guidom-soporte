function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

function showConfirmModal(msg, onConfirm, options = {}) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-msg').textContent = msg;
  overlay.classList.add('show');
  const confirmBtn = document.getElementById('modal-confirm');
  const cancelBtn = document.getElementById('modal-cancel');
  confirmBtn.textContent = options.confirmText || 'Eliminar';
  confirmBtn.className = `btn ${options.confirmClass || 'btn-danger'}`;
  const close = () => overlay.classList.remove('show');
  cancelBtn.onclick = close;
  confirmBtn.onclick = () => { close(); onConfirm(); };
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
}

function escapeHtml(str) {
  if (str == null) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

export { $, $$, showToast, showConfirmModal, escapeHtml };
