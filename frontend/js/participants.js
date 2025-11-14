import { fetchUsers, fetchUser, createConnection } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
  const participantsList = document.getElementById('participants-list');
  const searchInput = document.getElementById('participants-search');
  const filterSelect = document.getElementById('participants-filter');
  let page = 1;
  let gosto = '';
  let q = '';
  async function loadParticipants() {
    const res = await fetchUsers({ page, gosto, q });
    participantsList.innerHTML = '';
    res.users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${user.avatarUrl}" alt="Avatar" style="width:48px;height:48px;border-radius:50%">
        <h4>${user.name}</h4>
        <button onclick="showProfileModal('${user._id}')">Ver perfil</button>
      `;
      participantsList.appendChild(card);
    });
  }
  searchInput.oninput = e => {
    q = e.target.value;
    loadParticipants();
  };
  filterSelect.onchange = e => {
    gosto = e.target.value;
    loadParticipants();
  };
  loadParticipants();
});

window.showProfileModal = async function(id) {
  const modal = document.getElementById('profile-modal');
  const content = document.getElementById('profile-modal-content');
  const user = await fetchUser(id);
  content.innerHTML = `
    <img src="${user.avatarUrl}" alt="Avatar" style="width:64px;height:64px;border-radius:50%">
    <h3>${user.name}</h3>
    <p>${user.bio}</p>
    <div>Gostos: ${user.gostos.join(', ')}</div>
    <button class="bubble-btn" onclick="bubbleConnect('${user._id}')">Bubble</button>
  `;
  modal.style.display = 'flex';
  modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
};
