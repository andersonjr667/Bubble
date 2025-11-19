import { fetchConnections, fetchMessages, sendMessage, getMe } from './api.js';

let selectedUserId = null;
let selectedUserName = '';

let myConnections = [];
let myUser = null;
async function renderChatUsers() {
  const token = localStorage.getItem('bubble_token');
  const userList = document.getElementById('chat-user-list');
  if (!token) {
    userList.innerHTML = '<li>Faça login para ver suas conversas.</li>';
    return;
  }
  try {
    myUser = await getMe();
    // Busca conexões criadas por mim (curtidas)
    const connections = await fetchConnections();
    myConnections = connections.filter(c => c.from._id === myUser._id && (c.status === 'pending' || c.status === 'connected'));
    if (!myConnections.length) {
      userList.innerHTML = '<li>Você ainda não curtiu ninguém.</li>';
      return;
    }
    userList.innerHTML = myConnections.map(c => {
      const other = c.to;
      let status = c.status === 'connected' ? '' : ' <span style="color:var(--cinza-escuro);font-size:0.9em;">(Aguardando match)</span>';
      return `<li class="chat-user" data-id="${other._id}" data-name="${other.name}" data-status="${c.status}">
        <img src="${other.avatarUrl || '/assets/avatars/avatar1.png'}" style="width:28px;height:28px;border-radius:50%;vertical-align:middle;margin-right:8px;">
        ${other.name}${status}
      </li>`;
    }).join('');
  } catch (err) {
    userList.innerHTML = '<li>Erro ao carregar curtidas.</li>';
  }
}

async function openChat(userId, userName) {
  selectedUserId = userId;
  selectedUserName = userName;
  document.getElementById('chat-title').textContent = 'Chat com ' + userName;
  // Descobre status da conexão
  let status = 'pending';
  const conn = myConnections.find(c => c.to._id === userId);
  if (conn) status = conn.status;
  if (status !== 'connected') {
    document.getElementById('chat-form').style.display = 'none';
  } else {
    document.getElementById('chat-form').style.display = '';
    document.getElementById('chat-input').value = '';
  }
  document.getElementById('chat-history').innerHTML = '<div class="chat-message">Carregando...</div>';
  try {
    const messages = await fetchMessages(userId);
    let content = '';
    if (!messages.length) {
      content = '<div class="chat-message">Inicie uma conversa!</div>';
    } else {
      content = messages.map(m =>
        `<div class="chat-message"><b>${m.from === userId ? userName : 'Você'}:</b> ${m.text}</div>`
      ).join('');
    }
    // Se não for match, mostra aviso
    if (status !== 'connected') {
      content = `<div class="chat-message" style="color:var(--cinza-escuro);font-style:italic;">(Aguardando ${userName} dar match com você)</div>` + content;
    }
    document.getElementById('chat-history').innerHTML = content;
    document.getElementById('chat-history').scrollTop = 99999;
  } catch (err) {
    document.getElementById('chat-history').innerHTML = '<div class="chat-message">Erro ao carregar mensagens.</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderChatUsers();
  document.getElementById('chat-form').style.display = 'none';
});
window.addEventListener('storage', renderChatUsers);

document.getElementById('chat-user-list').onclick = function(e) {
  const li = e.target.closest('.chat-user[data-id]');
  if (li) {
    openChat(li.getAttribute('data-id'), li.getAttribute('data-name'));
  }
};

document.getElementById('chat-form').onsubmit = async function(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  if (input.value.trim() && selectedUserId) {
    await sendMessage(selectedUserId, input.value);
    openChat(selectedUserId, selectedUserName);
    input.value = '';
  }
};
