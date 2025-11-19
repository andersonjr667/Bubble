import { fetchConversations, fetchMessages, sendMessage, getMe } from './api.js';

let selectedUserId = null;
let selectedUserName = '';

async function renderChatUsers() {
  const token = localStorage.getItem('bubble_token');
  const userList = document.getElementById('chat-user-list');
  if (!token) {
    userList.innerHTML = '<li>Faça login para ver suas conversas.</li>';
    return;
  }
  try {
    const me = await getMe();
    const connections = await fetchConversations();
    if (!connections.length) {
      userList.innerHTML = '<li>Nenhum match encontrado.</li>';
      return;
    }
    userList.innerHTML = connections.map(c => {
      const other = c.from._id === me._id ? c.to : c.from;
      return `<li class="chat-user" data-id="${other._id}" data-name="${other.name}">
        <img src="${other.avatarUrl || '/assets/avatars/avatar1.png'}" style="width:28px;height:28px;border-radius:50%;vertical-align:middle;margin-right:8px;">
        ${other.name}
      </li>`;
    }).join('');
  } catch (err) {
    userList.innerHTML = '<li>Erro ao carregar matches.</li>';
  }
}

async function openChat(userId, userName) {
  selectedUserId = userId;
  selectedUserName = userName;
  document.getElementById('chat-title').textContent = 'Chat com ' + userName;
  document.getElementById('chat-form').style.display = '';
  document.getElementById('chat-input').value = '';
  document.getElementById('chat-history').innerHTML = '<div class="chat-message">Carregando...</div>';
  try {
    const messages = await fetchMessages(userId);
    if (!messages.length) {
      document.getElementById('chat-history').innerHTML = '<div class="chat-message">Inicie uma conversa!</div>';
      return;
    }
    document.getElementById('chat-history').innerHTML = messages.map(m =>
      `<div class="chat-message"><b>${m.from === userId ? userName : 'Você'}:</b> ${m.text}</div>`
    ).join('');
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
