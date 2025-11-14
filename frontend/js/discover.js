import { fetchUsers, createConnection } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
  const discoverList = document.getElementById('discover-list');
  const modeToggle = document.getElementById('discover-mode');
  let mode = 'parecidos';
  async function loadDiscover() {
    const res = await fetchUsers({ mode });
    discoverList.innerHTML = '';
    res.users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${user.avatarUrl}" alt="Avatar" style="width:64px;height:64px;border-radius:50%">
        <h3>${user.name}</h3>
        <p>${user.bio}</p>
        <div>Gostos: ${user.gostos.join(', ')}</div>
        <button class="bubble-btn" aria-label="Conectar" onclick="bubbleConnect('${user._id}')">Bubble</button>
      `;
      discoverList.appendChild(card);
    });
  }
  modeToggle.onchange = e => {
    mode = e.target.value;
    loadDiscover();
  };
  loadDiscover();
});

window.bubbleConnect = async function(id) {
  const res = await createConnection(id);
  if (res.status === 'pending') {
    showToast('Conexão solicitada — chat será implementado depois');
  } else if (res.status === 'connected') {
    showToast('Conexão feita!');
  } else {
    showToast(res.message || 'Erro ao conectar');
  }
};
