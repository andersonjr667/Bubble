export function updateHeaderLinks() {
  const token = localStorage.getItem('bubble_token');
  const cadastro = document.getElementById('link-cadastro');
  const login = document.getElementById('link-login');
  const conhecer = document.getElementById('link-conhecer');
  const perfil = document.getElementById('link-perfil');
  const chat = document.getElementById('link-chat');
  const nav = document.getElementById('header-nav');
  if (cadastro) cadastro.style.display = token ? 'none' : '';
  if (login) login.style.display = token ? 'none' : '';
  if (conhecer) conhecer.style.display = token ? '' : 'none';
  if (perfil) perfil.style.display = token ? '' : 'none';
  if (chat) chat.style.display = token ? '' : 'none';
  // Botão sair
  let btnSair = document.getElementById('btn-sair');
  if (!btnSair) {
    btnSair = document.createElement('button');
    btnSair.id = 'btn-sair';
    btnSair.textContent = 'Sair';
    btnSair.className = 'header-link btn-sair';
    btnSair.style.marginLeft = '1em';
    btnSair.onclick = () => {
      localStorage.removeItem('bubble_token');
      updateHeaderLinks();
      window.location.href = 'login.html';
    };
    nav.appendChild(btnSair);
  }
  btnSair.style.display = token ? '' : 'none';
}
window.addEventListener('storage', updateHeaderLinks);
window.addEventListener('DOMContentLoaded', updateHeaderLinks);
// Nenhuma alteração, apenas garantir importação correta
