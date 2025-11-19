import { getMe, fetchConnections } from './api.js';

export async function renderProfileStats() {
  const stats = {
    conexoes: 0,
    interesses: 0,
    bubbles: 0 // Placeholder, ajuste conforme sua lógica
  };
  try {
    const me = await getMe();
    stats.interesses = me.gostos ? me.gostos.length : 0;
    const connections = await fetchConnections();
    stats.conexoes = connections.filter(c => c.status === 'connected' && (c.from._id === me._id || c.to._id === me._id)).length;
    stats.bubbles = 0;
  } catch (e) {}
  // Atualiza DOM com checagem
  const statEls = document.querySelectorAll('.stat-value');
  if (statEls.length >= 3) {
    statEls[0].textContent = stats.conexoes;
    statEls[1].textContent = stats.interesses;
    statEls[2].textContent = stats.bubbles;
  }
}

document.addEventListener('DOMContentLoaded', renderProfileStats);
window.addEventListener('storage', renderProfileStats);
