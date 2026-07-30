import { supabase } from './db.js';
import { $ } from './ui.js';

let session = null;

async function checkAuth() {
  const { data: { session: sess } } = await supabase.auth.getSession();
  session = sess;
  if (sess) {
    $('#auth-overlay').classList.remove('show');
    document.querySelector('.app').style.display = 'block';
    return true;
  } else {
    $('#auth-overlay').classList.add('show');
    document.querySelector('.app').style.display = 'none';
    return false;
  }
}

function setupAuth(onLogin) {
  supabase.auth.onAuthStateChange((event, sess) => {
    session = sess;
    if (sess) {
      $('#auth-overlay').classList.remove('show');
      document.querySelector('.app').style.display = 'block';
      if (typeof onLogin === 'function') onLogin();
    } else {
      $('#auth-overlay').classList.add('show');
      document.querySelector('.app').style.display = 'none';
    }
  });

  $('#auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#auth-email').value.trim();
    const password = $('#auth-password').value;
    const errorEl = $('#auth-error');
    const btn = $('#auth-submit');
    errorEl.textContent = '';
    errorEl.classList.remove('show');
    btn.disabled = true;
    btn.textContent = 'Ingresando...';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    btn.disabled = false;
    btn.textContent = 'Iniciar sesión';
    if (error) {
      errorEl.textContent = error.message === 'Invalid login credentials'
        ? 'Credenciales incorrectas'
        : 'Error al iniciar sesión';
      errorEl.classList.add('show');
      return;
    }
  });

  $('#logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
  });
}

export { session, checkAuth, setupAuth };
