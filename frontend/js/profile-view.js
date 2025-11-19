import { getMe, updateUser, deleteUser } from './api.js';
import { uploadAvatar } from './api.js';
function logout() {
  localStorage.removeItem('bubble_token');
  location.href = 'login.html';
}
let userId = null;
async function renderProfile() {
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
  let user, me;
  if (profileId) {
    // Visualizando perfil de outra pessoa
    [me, user] = await Promise.all([getMe(), (await import('./api.js')).fetchUser(profileId)]);
    userId = me._id;
    window.userId = userId;
  } else {
    user = await getMe();
    me = user;
    userId = user._id;
    window.userId = userId;
  }
  if (!user || user.message) {
    document.getElementById('profile-card').innerHTML = '<p>Erro ao carregar perfil.</p>';
    return;
  }
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
  const btnEdit = document.getElementById('btn-edit');
  const btnLogout = document.getElementById('btn-logout');
  const btnDelete = document.getElementById('btn-delete');
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
  // TikTok/Mobile
  document.getElementById('profile-avatar-mobile').src = user.avatarUrl || 'assets/avatars/avatar1.png';
  document.getElementById('profile-name-mobile').textContent = user.name || '';
  document.getElementById('profile-handle-mobile').textContent = (user.username ? '@' + user.username : '') + (user.age ? ' · ' + user.age + ' anos' : '');
  document.getElementById('profile-bio-mobile').textContent = user.bio || '';
  document.getElementById('stat-followers-mobile').textContent = user.followers || '0';
  document.getElementById('stat-following-mobile').textContent = user.following || '0';
  document.getElementById('stat-likes-mobile').textContent = user.likes || '0';
  // Gostos mobile (com emoji)
  const gostoIcons = {
    'Música': '🎵',
    'Filmes': '🎬',
    'Esportes': '🏅',
    'Viagens': '✈️',
    'Tecnologia': '💻',
    'Leitura': '📚'
  };
  const gostosMobileDiv = document.getElementById('profile-gostos-mobile');
  gostosMobileDiv.innerHTML = '';
  if (user.gostos && user.gostos.length) {
    user.gostos.forEach(g => {
      const span = document.createElement('span');
      span.className = 'gosto-tag-tiktok';
      const icon = gostoIcons[g] || '⭐';
      span.innerHTML = `<span style=\"margin-right:6px;\">${icon}</span>${g}`;
      gostosMobileDiv.appendChild(span);
    });
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
renderProfile();
window.addEventListener('storage', renderProfile);

// Edição de perfil
const btnEdit = document.getElementById('btn-edit');
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
      renderProfile();
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
const btnDelete = document.getElementById('btn-delete');
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
