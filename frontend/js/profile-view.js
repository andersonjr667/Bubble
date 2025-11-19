import { getMe, updateUser, deleteUser } from './api.js';
import { uploadAvatar } from './api.js';
function logout() {
  localStorage.removeItem('bubble_token');
  location.href = 'login.html';
//
let userId = null;
function renderProfileWrapper() { return renderProfile.apply(this, arguments); }
window.renderProfile = renderProfileWrapper;
async function renderProfile() {
    // Logar dados do usuário para depuração
    let user, me;
    const token = localStorage.getItem('bubble_token');
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get('id');
    if (!token) {
      document.getElementById('profile-card').innerHTML = '<p>Faça login para ver seu perfil.</p>';
      document.getElementById('link-cadastro').style.display = '';
      document.getElementById('link-login').style.display = '';
      document.getElementById('link-conhecer').style.display = 'none';
      document.getElementById('link-perfil').style.display = 'none';
      document.getElementById('link-chat').style.display = 'none';
      return;
    }
    if (profileId) {
      [me, user] = await Promise.all([getMe(), (await import('./api.js')).fetchUser(profileId)]);
      // Highlights
      const highlightsMobile = document.getElementById('profile-instagram-highlights-mobile');
      if (highlightsMobile) {
        highlightsMobile.innerHTML = '';
        if (user.gostos && user.gostos.length) {
            const gostoImages = {
              'musica': 'assets/highlights/musica.png',
              'cinema': 'assets/highlights/cinema.png',
              'esportes': 'assets/highlights/sport.png',
              'leitura': 'assets/highlights/book.png',
              'tecnologia': 'assets/highlights/tech.png',
              'viagens': 'assets/highlights/travel.png',
              'arte': 'assets/highlights/art.png',
              'games': 'assets/highlights/game.png',
              'culinaria': 'assets/highlights/culinaria.png',
              'fotografia': 'assets/highlights/fotografia.png',
              'moda': 'assets/highlights/fashion.png',
              'danca': 'assets/highlights/danca.png',
              'natureza': 'assets/highlights/nature.png',
              'animais': 'assets/highlights/animal.png',
              'politica': 'assets/highlights/politica.png',
              'negocios': 'assets/highlights/negocios.png'
            };
          user.gostos.forEach(g => {
            // Corrigir normalização igual ao desktop
              const key = g.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
            const imgSrc = gostoImages[key];
            if (imgSrc) {
              const item = document.createElement('div');
              item.className = 'highlight-item';
              item.innerHTML = `<div class="highlight-circle"><img src="${imgSrc}" alt="${g}"></div><span class="highlight-label">${g}</span>`;
              highlightsMobile.appendChild(item);
            }
          });
        }
      }
        document.getElementById('profile-name-mobile').textContent = '[DEBUG] Usuário sem nome';
        document.getElementById('profile-bio-mobile').textContent = '[DEBUG] user: ' + JSON.stringify(user);
      } else {
        document.getElementById('profile-name-mobile').textContent = user.name;
        document.getElementById('profile-bio-mobile').textContent = user.bio || '';
      }
      document.getElementById('stat-posts-mobile').textContent = user.posts || '0';
      document.getElementById('stat-followers-mobile').textContent = user.followers || '0';
      document.getElementById('stat-following-mobile').textContent = user.following || '0';
      // Highlights
      const highlightsMobile = document.getElementById('profile-instagram-highlights-mobile');
      if (highlightsMobile) {
        highlightsMobile.innerHTML = '';
        if (user.gostos && user.gostos.length) {
          const gostoImages = {
            'musica': 'assets/highlights/musica.png',
            'cinema': 'assets/highlights/cinema.png',
            'esportes': 'assets/highlights/sport.png',
            'leitura': 'assets/highlights/book.png',
            'tecnologia': 'assets/highlights/tech.png',
            'viagens': 'assets/highlights/travel.png',
            'arte': 'assets/highlights/art.png',
            'games': 'assets/highlights/game.png',
            'culinaria': 'assets/highlights/culinaria.png',
            'fotografia': 'assets/highlights/fotografia.png',
            'moda': 'assets/highlights/fashion.png',
            'danca': 'assets/highlights/danca.png',
            'natureza': 'assets/highlights/nature.png',
            'animais': 'assets/highlights/animal.png',
            'politica': 'assets/highlights/politica.png',
            'negocios': 'assets/highlights/negocios.png'
          };
          user.gostos.forEach(g => {
            const key = g.normalize('NFD').replace(/[\u0000-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
            const imgSrc = gostoImages[key];
            if (imgSrc) {
              const item = document.createElement('div');
              item.className = 'highlight-item';
              item.innerHTML = `<div class=\"highlight-circle\"><img src=\"${imgSrc}\" alt=\"${g}\"></div><span class=\"highlight-label\">${g}</span>`;
              highlightsMobile.appendChild(item);
            }
          });
        }
      }
      // Botão seguir mobile
      const btnFollowMobile = document.getElementById('btn-follow-mobile');
      if (btnFollowMobile) {
        if (profileId && profileId !== me._id) {
          btnFollowMobile.style.display = '';
          btnFollowMobile.onclick = async () => {
            btnFollowMobile.disabled = true;
            btnFollowMobile.textContent = 'Seguindo...';
            const { createConnection } = await import('./api.js');
            const res = await createConnection(profileId);
            if (res.status === 'pending' || res.status === 'connected') {
              btnFollowMobile.textContent = 'Seguindo';
            } else {
              btnFollowMobile.textContent = 'Erro';
            }
          };
        } else {
          btnFollowMobile.style.display = 'none';
        }
      }
    }
  // (as variáveis já foram declaradas acima, não repetir)
  // Instagram/Desktop
  document.getElementById('profile-avatar').src = user.avatarUrl || 'assets/avatars/avatar1.png';
  document.getElementById('profile-name').textContent = user.name || '';
  document.getElementById('profile-bio').textContent = user.bio || '';
  document.getElementById('profile-link-bio').textContent = user.link || '';
  // Stats (mock se não houver)
  document.getElementById('stat-posts').textContent = user.posts || '0';
  document.getElementById('stat-followers').textContent = user.followers || '0';
  document.getElementById('stat-following').textContent = user.following || '0';
  // Botão seguir e esconder botões de edição se não for o próprio perfil
  const btnFollow = document.getElementById('btn-follow');
  // btnEdit e btnDelete são declarados globalmente abaixo
  const btnLogout = document.getElementById('btn-logout');
  if (profileId && profileId !== me._id) {
    if (btnFollow) {
      btnFollow.style.display = '';
      btnFollow.onclick = async () => {
        btnFollow.disabled = true;
        btnFollow.textContent = 'Seguindo...';
        const { createConnection } = await import('./api.js');
        const res = await createConnection(profileId);
        if (res.status === 'pending' || res.status === 'connected') {
          btnFollow.textContent = 'Seguindo';
        } else {
          btnFollow.textContent = 'Erro';
        }
      };
    }
    if (btnEdit) btnEdit.style.display = 'none';
    if (btnLogout) btnLogout.style.display = 'none';
    if (btnDelete) btnDelete.style.display = 'none';
  } else {
    if (btnFollow) btnFollow.style.display = 'none';
    if (btnEdit) btnEdit.style.display = '';
    if (btnLogout) btnLogout.style.display = '';
    if (btnDelete) btnDelete.style.display = '';
  }
  // Corrigir campo de compartilhar
  // Compartilhar perfil (desktop)
  const shareInput = document.getElementById('profile-link');
  const copyBtn = document.getElementById('copy-link-btn');
  if (shareInput) {
    // Sempre gera o link com o id do perfil exibido
    const idToShare = (profileId || user._id);
    const url = window.location.origin + window.location.pathname + '?id=' + idToShare;
    shareInput.value = url;
    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          shareInput.select();
          document.execCommand('copy');
        }
        showToast('Link copiado!');
      };
    }
  }
  // Remove gostos do desktop (não exibe mais a linha de gostos)
  const gostosDiv = document.getElementById('profile-gostos');
  if (gostosDiv) gostosDiv.innerHTML = '';
  // Destaques (tipo stories) com imagens padrão
  const gostoImages = {
    'musica': 'assets/highlights/musica.png',
    'cinema': 'assets/highlights/cinema.png',
    'esportes': 'assets/highlights/sport.png',
    'leitura': 'assets/highlights/book.png',
    'tecnologia': 'assets/highlights/tech.png',
    'viagens': 'assets/highlights/travel.png',
    'arte': 'assets/highlights/art.png',
    'games': 'assets/highlights/game.png',
    'culinaria': 'assets/highlights/culinaria.png',
    'fotografia': 'assets/highlights/fotografia.png',
    'moda': 'assets/highlights/fashion.png',
    'danca': 'assets/highlights/danca.png',
    'natureza': 'assets/highlights/nature.png',
    'animais': 'assets/highlights/animal.png',
    'politica': 'assets/highlights/politica.png',
    'negocios': 'assets/highlights/negocios.png'
  };
  const highlightsDiv = document.getElementById('profile-instagram-highlights');
  highlightsDiv.innerHTML = '';
    if (user.gostos && user.gostos.length) {
      user.gostos.forEach(g => {
        const item = document.createElement('div');
        item.className = 'highlight-item';
        // Remove acentos e deixa minúsculo para garantir compatibilidade
        const key = g.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
        const imgSrc = gostoImages[key];
        if (imgSrc) {
          item.innerHTML = `<div class="highlight-circle" style="background:#fff;padding:0;"><img src="${imgSrc}" alt="${g}" style="width:90px;height:90px;border-radius:50%;object-fit:cover;"></div><span class="highlight-label">${g}</span>`;
          highlightsDiv.appendChild(item);
        }
      });
    }
    // Melhorar formulário de edição: mostrar todos os gostos disponíveis com imagens
    const editGostos = document.getElementById('edit-gostos');
    if (editGostos) {
      const gostosList = [
        { label: 'Música', key: 'musica' },
        { label: 'Cinema', key: 'cinema' },
        { label: 'Esportes', key: 'esportes' },
        { label: 'Leitura', key: 'book' },
        { label: 'Tecnologia', key: 'tech' },
        { label: 'Viagens', key: 'travel' },
        { label: 'Arte', key: 'art' },
        { label: 'Games', key: 'game' },
        { label: 'Culinária', key: 'culinaria' },
        { label: 'Fotografia', key: 'fotografia' },
        { label: 'Moda', key: 'fashion' },
        { label: 'Dança', key: 'danca' },
        { label: 'Natureza', key: 'nature' },
        { label: 'Animais', key: 'animal' },
        { label: 'Política', key: 'politica' },
        { label: 'Negócios', key: 'negocios' }
      ];
      editGostos.innerHTML = '<legend style="font-weight:700;color:var(--azul-secundario);margin-bottom:8px;">Gostos:</legend><div class="gostos-grid"></div>';
      const grid = editGostos.querySelector('.gostos-grid');
      gostosList.forEach(g => {
        const label = document.createElement('label');
        label.className = 'gosto-option';
        label.innerHTML = `
          <input type="checkbox" name="gostos" value="${g.label}">
          <img src="assets/highlights/${g.key}.png" alt="${g.label}">
          ${g.label}
        `;
        grid.appendChild(label);
      });
      // Marcar os gostos do usuário
      if (user.gostos && user.gostos.length) {
        grid.querySelectorAll('input[type=checkbox]').forEach(cb => {
          cb.checked = user.gostos.includes(cb.value);
        });
      }
    }
  // Mobile visual
  document.getElementById('profile-avatar-mobile').src = user.avatarUrl || 'assets/avatars/avatar1.png';
  document.getElementById('profile-name-mobile').textContent = user.name || '';
  document.getElementById('profile-bio-mobile').textContent = user.bio || '';
  document.getElementById('stat-posts-mobile').textContent = user.posts || '0';
  document.getElementById('stat-followers-mobile').textContent = user.followers || '0';
  document.getElementById('stat-following-mobile').textContent = user.following || '0';
  // Gostos mobile (com cor e destaque)
  const gostosMobileDiv = document.getElementById('profile-gostos-mobile');
  if (gostosMobileDiv) {
    gostosMobileDiv.innerHTML = '';
    if (user.gostos && user.gostos.length) {
      user.gostos.forEach(g => {
        const span = document.createElement('span');
        span.className = 'gosto-tag-tiktok';
        // Substituir por ícone SVG simples (exemplo: círculo colorido)
        span.innerHTML = `<svg width='16' height='16' style='margin-right:5px;vertical-align:middle;' fill='var(--ciano-principal)' viewBox='0 0 16 16'><circle cx='8' cy='8' r='7'/></svg>${g}`;
        gostosMobileDiv.appendChild(span);
      });
    }
  }
  // Compartilhar perfil (mobile)
  const shareInputMobile = document.getElementById('profile-link-mobile');
  const copyBtnMobile = document.getElementById('copy-link-btn-mobile');
  if (shareInputMobile) {
    const idToShare = (profileId || user._id);
    const url = window.location.origin + window.location.pathname + '?id=' + idToShare;
    shareInputMobile.value = url;
    if (copyBtnMobile) {
      copyBtnMobile.onclick = async () => {
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          shareInputMobile.select();
          document.execCommand('copy');
        }
        showToast('Link copiado!');
      };
    }
  }
  // Preenche formulário de edição
  document.getElementById('edit-name').value = user.name || '';
  document.getElementById('edit-age').value = user.age || '';
  document.getElementById('edit-bio').value = user.bio || '';
  document.getElementById('edit-avatarUrl').value = user.avatarUrl || '';
  document.querySelectorAll('#edit-gostos input[type=checkbox]').forEach(cb => {
    cb.checked = user.gostos && user.gostos.includes(cb.value);
  });
}


window.logout = logout;

// Garante que renderProfile está disponível globalmente após a definição
window.renderProfile = renderProfile;
window.addEventListener('storage', () => window.renderProfile());
window.addEventListener('DOMContentLoaded', () => window.renderProfile());

// Edição de perfil
let btnEdit = document.getElementById('btn-edit');
const btnCancel = document.getElementById('btn-cancel');
const editForm = document.getElementById('edit-form');
const profileCard = document.getElementById('profile-card');
if (btnEdit && editForm) {
  btnEdit.onclick = () => {
    editForm.style.display = 'flex';
    profileCard.style.display = 'none';
  };
}
if (btnCancel && editForm && profileCard) {
  btnCancel.onclick = () => {
    editForm.style.display = 'none';
    profileCard.style.display = '';
  };
}
if (editForm) {
  editForm.onsubmit = async e => {
    e.preventDefault();
    const data = {
      name: editForm['edit-name'].value,
      age: editForm['edit-age'].value,
      bio: editForm['edit-bio'].value,
      avatarUrl: editForm['edit-avatarUrl'].value,
      gostos: Array.from(editForm.querySelectorAll('input[name="gostos"]:checked')).map(i => i.value)
    };
    const res = await updateUser(userId, data);
    if (res && res.name) {
      showToast('Perfil atualizado!');
      editForm.style.display = 'none';
      profileCard.style.display = '';
      window.renderProfile();
    } else {
      showToast(res.message || 'Erro ao atualizar perfil');
    }
  };

  // Avatar upload/preview logic
  const avatarFileInput = document.getElementById('edit-avatarFile');
  const avatarUrlInput = document.getElementById('edit-avatarUrl');
  const avatarPreview = document.getElementById('edit-avatarPreview');
  const avatarRadios = document.querySelectorAll('input[name="avatarPadrao"]');

  // Preview avatar from URL
  avatarUrlInput.addEventListener('input', () => {
    if (avatarUrlInput.value) {
      avatarPreview.innerHTML = `<img src="${avatarUrlInput.value}" alt="preview" style="width:80px;height:80px;border-radius:50%;border:2px solid var(--ciano-principal);object-fit:cover;">`;
    } else {
      avatarPreview.innerHTML = '';
    }
  });

  // Preview avatar from file and upload
  avatarFileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    // Preview
    const reader = new FileReader();
    reader.onload = ev => {
      avatarPreview.innerHTML = `<img src="${ev.target.result}" alt="preview" style="width:80px;height:80px;border-radius:50%;border:2px solid var(--ciano-principal);object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
    // Upload
    showToast('Enviando avatar...');
    const res = await uploadAvatar(file);
    if (res.url) {
      avatarUrlInput.value = res.url;
      showToast('Avatar atualizado!');
    } else {
      showToast(res.message || 'Erro ao enviar avatar');
    }
  });

  // Seleção de avatar padrão
  avatarRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        const url = `assets/avatars/${radio.value}`;
        avatarUrlInput.value = url;
        avatarPreview.innerHTML = `<img src="${url}" alt="preview" style="width:80px;height:80px;border-radius:50%;border:2px solid var(--ciano-principal);object-fit:cover;">`;
      }
    });
  });
}
// Excluir perfil
let btnDelete = document.getElementById('btn-delete');
if (btnDelete) {
  btnDelete.onclick = async () => {
    if (confirm('Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita.')) {
      const res = await deleteUser(userId);
      if (res && res.message && res.message.includes('removido')) {
        showToast('Perfil excluído!');
        setTimeout(() => logout(), 1500);
      } else {
        showToast(res.message || 'Erro ao excluir perfil');
      }
    }
  };
}
function showToast(msg) {
  let toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Tinder-like swipe animation for profile card (mobile only)
if (window.innerWidth <= 768) {
  let startX = null;
  const card = document.getElementById('profile-card');
  if (card) {
    card.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    card.addEventListener('touchend', e => {
      if (startX !== null) {
        const endX = e.changedTouches[0].clientX;
        if (endX - startX > 90) {
          card.classList.add('swipe');
          setTimeout(() => card.style.display = 'none', 700);
        }
      }
      startX = null;
    });
  }
}
