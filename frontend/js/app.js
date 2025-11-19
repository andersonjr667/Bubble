// SPA router simples
import './auth.js';
import './discover.js';
import './profile.js';
import './participants.js';
import './questionnaire.js';

const views = ['welcome', 'login', 'register', 'questionnaire', 'discover', 'participants', 'profile'];
function showView(view) {
  views.forEach(v => {
    const el = document.getElementById(v + '-view');
    if (el) el.setAttribute('aria-hidden', v !== view);
  });
}
window.addEventListener('hashchange', () => {
  const hash = location.hash.replace('#', '') || 'welcome';
  showView(hash);
});
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('bubble_token');
  if (!token) {
    showView('welcome');
  } else {
    // Checa se o usuário já respondeu o questionário
    fetch('https://bubble-gnfj.onrender.com/api/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(user => {
        if (user && user.firstLogin) {
          showView('questionnaire');
        } else {
          showView('discover');
        }
      })
      .catch(() => showView('welcome'));
  }
});

function updateHeaderLinks() {
  const nav = document.getElementById('header-nav');
  nav.innerHTML = '';
  const token = localStorage.getItem('bubble_token');
  if (token) {
    nav.innerHTML = `
      <button onclick=\"location.hash='#discover'\">Descoberta</button>
      <button onclick=\"location.hash='#participants'\">Participantes</button>
      <button onclick=\"location.hash='#profile'\">Meu Perfil</button>
      <button onclick=\"logoutBubble()\">Sair</button>
    `;
  } else {
    nav.innerHTML = `
      <button onclick=\"location.hash='#login'\">Entrar</button>
      <button onclick=\"location.hash='#register'\">Registrar</button>
    `;
  }
}
window.logoutBubble = function() {
  localStorage.removeItem('bubble_token');
  location.hash = '#welcome';
  updateHeaderLinks();
};
window.addEventListener('DOMContentLoaded', updateHeaderLinks);
window.addEventListener('hashchange', updateHeaderLinks);
