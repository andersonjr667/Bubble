// API client para Bubble
const BASE_URL = 'https://bubble-gnfj.onrender.com/api';

function getToken() {
  return localStorage.getItem('bubble_token');
}
function setToken(token) {
  localStorage.setItem('bubble_token', token);
}
function removeToken() {
  localStorage.removeItem('bubble_token');
}
function authHeader() {
  const token = getToken();
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

async function register(data) {
  const res = await fetch(BASE_URL + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
async function login(data) {
  const res = await fetch(BASE_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
async function getMe() {
  const res = await fetch(BASE_URL + '/auth/me', {
    headers: { ...authHeader() }
  });
  return res.json();
}
async function fetchUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(BASE_URL + '/users?' + query, {
    headers: { ...authHeader() }
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { message: 'Erro inesperado ao processar resposta do servidor.' };
  }
  if (!res.ok) {
    throw new Error(data.message || 'Erro ao buscar usuários');
  }
  return data;
}
async function fetchUser(id) {
  const res = await fetch(BASE_URL + '/users/' + id, {
    headers: { ...authHeader() }
  });
  return res.json();
}
async function updateUser(id, data) {
  const res = await fetch(BASE_URL + '/users/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
}
async function deleteUser(id) {
  const res = await fetch(BASE_URL + '/users/' + id, {
    method: 'DELETE',
    headers: { ...authHeader() }
  });
  return res.json();
}
async function uploadAvatar(file) {
  const form = new FormData();
  form.append('avatar', file);
  const res = await fetch(BASE_URL + '/upload/avatar', {
    method: 'POST',
    headers: { ...authHeader() },
    body: form
  });
  return res.json();
}
async function createConnection(to) {
  const res = await fetch(BASE_URL + '/connections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ to })
  });
  return res.json();
}
async function fetchConnections() {
  const res = await fetch(BASE_URL + '/connections', {
    headers: { ...authHeader() }
  });
  return res.json();
}
async function fetchConversations() {
  const res = await fetch(BASE_URL + '/chat', {
    headers: { ...authHeader() }
  });
  return res.json();
}
async function fetchMessages(userId) {
  const res = await fetch(BASE_URL + '/chat/' + userId, {
    headers: { ...authHeader() }
  });
  return res.json();
}
async function sendMessage(userId, text) {
  const res = await fetch(BASE_URL + '/chat/' + userId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ text })
  });
  return res.json();
}

export {
  getToken, setToken, removeToken, authHeader,
  register, login, getMe,
  fetchUsers, fetchUser, updateUser, deleteUser,
  uploadAvatar, createConnection, fetchConnections,
  fetchConversations, fetchMessages, sendMessage
};
