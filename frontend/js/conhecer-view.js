import { fetchUsers } from './api.js';
function showLoginMsg() {
  document.getElementById('tinder-card').innerHTML = '<p>Faça login para conhecer pessoas.</p>';
}
async function renderTinder() {
  const token = localStorage.getItem('bubble_token');
  if (!token) return showLoginMsg();
  try {
    const res = await fetchUsers();
    if (!res.users || !res.users.length) {
      document.getElementById('tinder-card').innerHTML = '<p>Nenhum perfil encontrado.</p>';
      return;
    }
    const user = res.users[0];
    document.getElementById('tinder-avatar').src = user.avatarUrl || '/assets/avatars/avatar1.png';
    document.getElementById('tinder-name').textContent = user.name;
    document.getElementById('tinder-age').textContent = 'Idade: ' + user.age;
    document.getElementById('tinder-bio').textContent = user.bio;
    // Exibe gostos como chips
    const gostosDiv = document.getElementById('tinder-gostos');
    gostosDiv.innerHTML = '';
    if (user.gostos && user.gostos.length) {
      user.gostos.forEach(g => {
        const span = document.createElement('span');
        span.textContent = g;
        gostosDiv.appendChild(span);
      });
    }
  } catch (err) {
    document.getElementById('tinder-card').innerHTML = `<p style='color:#d00;'>${err.message || 'Erro ao buscar perfis.'}</p>`;
  }
}
renderTinder();
window.addEventListener('storage', renderTinder);
