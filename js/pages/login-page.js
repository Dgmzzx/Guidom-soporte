import { checkAuth, setupAuth } from '../auth.js';

checkAuth().then(authed => {
  if (authed) window.location.href = 'inventario.html';
});

setupAuth(() => {
  window.location.href = 'inventario.html';
});
