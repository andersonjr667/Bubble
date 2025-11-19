import { fetchUsers, getMe, createConnection, fetchConnections } from './api.js';

let users = [];
let currentIndex = 0;
let passedIds = [];

function showLoginMsg() {
  const card = document.getElementById('tinder-card');
  if (card) card.innerHTML = '<p>Faça login para conhecer pessoas.</p>';
}

function createDesktopActions(onPass, onLike, onSuperLike) {
  const actions = document.createElement('div');
  actions.className = 'profile-actions profile-actions-desktop';
  actions.innerHTML = `
    <button class="btn-pass" title="Passar">&#10006;</button>
    <button class="btn-super-like" title="Super Like">&#11088;</button>
    <button class="btn-like" title="Curtir">&#10084;</button>
  `;
  actions.querySelector('.btn-pass').onclick = onPass;
  actions.querySelector('.btn-like').onclick = onLike;
  actions.querySelector('.btn-super-like').onclick = onSuperLike;
  return actions;
}


async function handleLike(type) {
  if (!users.length || currentIndex >= users.length) return;
  const user = users[currentIndex];
  try {
    await createConnection(user._id); // cria conexão real
  } catch (err) { /* ignora erro 409 */ }
  currentIndex++;
  renderProfile();
}

function handlePass() {
  if (!users.length || currentIndex >= users.length) return;
  const user = users[currentIndex];
  passedIds.push(user._id);
  localStorage.setItem('bubble_passed', JSON.stringify(passedIds));
  currentIndex++;
  renderProfile();
}

function renderProfile() {
  const stack = document.getElementById('profiles-stack');
  if (!stack) return;
  stack.innerHTML = '';
  // Pula usuários passados
  while (users.length && currentIndex < users.length && passedIds.includes(users[currentIndex]._id)) {
    currentIndex++;
  }
  if (!users.length || currentIndex >= users.length) {
    stack.innerHTML = '<div class="empty-state"><h3>Nenhum perfil encontrado.</h3></div>';
    return;
  }
  const user = users[currentIndex];
  const card = document.createElement('div');
  card.className = 'profile-card';
  card.innerHTML = `
    <img src="${user.avatarUrl || 'assets/avatars/avatar1.png'}" alt="Avatar" class="profile-image">
    <div class="profile-info">
      <div class="profile-header">
        <div class="profile-name-age">
          <h3 class="profile-name">${user.name}</h3>
          <p class="profile-age">${user.age} anos</p>
        </div>
      </div>
      <p class="profile-bio">${user.bio || ''}</p>
      <div class="profile-interests">
        ${(user.gostos || []).map(g => `<span class="interest-tag">${g}</span>`).join(' ')}
      </div>
    </div>
  `;
  const actions = createDesktopActions(
    handlePass, // Passar
    () => handleLike('like'), // Curtir
    () => handleLike('superlike') // Super Like
  );
  card.appendChild(actions);
  stack.appendChild(card);
}

async function renderTinder() {
  const stack = document.getElementById('profiles-stack');
  if (!stack) return;
  stack.innerHTML = '';
  const token = localStorage.getItem('bubble_token');
  if (!token) {
    stack.innerHTML = '<div class="empty-state"><h3>Faça login para conhecer pessoas.</h3></div>';
    return;
  }
  try {
    const me = await getMe();
    const res = await fetchUsers();
    const connections = await fetchConnections();
    // Filtra usuários já conectados (match)
    const connected = new Set();
    connections.forEach(c => {
      if (c.status === 'connected') {
        if (c.from._id === me._id) connected.add(c.to._id);
        if (c.to._id === me._id) connected.add(c.from._id);
      }
    });
    users = (res.users || []).filter(u => u._id && u._id !== me._id && !connected.has(u._id));
    // Carrega passados do localStorage
    try {
      passedIds = JSON.parse(localStorage.getItem('bubble_passed')) || [];
    } catch { passedIds = []; }
    currentIndex = 0;
    renderProfile();
  } catch (err) {
    stack.innerHTML = `<div class="empty-state"><h3>${err.message || 'Erro ao buscar perfis.'}</h3></div>`;
  }
}

async function renderChatUsers() {
  // Não faz nada nesta tela
}
renderTinder();
window.addEventListener('storage', renderTinder);

// Permite resetar passados manualmente (opcional)
window.resetPassed = function() {
  localStorage.removeItem('bubble_passed');
  renderTinder();
};
