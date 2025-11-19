import { getMe, updateUser, deleteUser } from './api.js';
import { uploadAvatar } from './api.js';
function logout() {
  localStorage.removeItem('bubble_token');
  location.href = 'login.html';
}
let userId = null;
async function renderProfile() {
  const token = localStorage.getItem('bubble_token');
  if (!token) {
    document.getElementById('profile-card').innerHTML = '<p>Faça login para ver seu perfil.</p>';
    document.getElementById('link-cadastro').style.display = '';
    document.getElementById('link-login').style.display = '';
    document.getElementById('link-conhecer').style.display = 'none';
    document.getElementById('link-perfil').style.display = 'none';
    document.getElementById('link-chat').style.display = 'none';
    return;
  }
  const user = await getMe();
  if (!user || user.message) {
    document.getElementById('profile-card').innerHTML = '<p>Erro ao carregar perfil.</p>';
    return;
  }
  userId = user._id;
  window.userId = userId;
  // Instagram/Desktop
  document.getElementById('profile-avatar').src = user.avatarUrl || 'assets/avatars/avatar1.png';
  document.getElementById('profile-name').textContent = user.name || '';
  document.getElementById('profile-bio').textContent = user.bio || '';
  document.getElementById('profile-link-bio').textContent = user.link || '';
  // Stats (mock se não houver)
  document.getElementById('stat-posts').textContent = user.posts || '0';
  document.getElementById('stat-followers').textContent = user.followers || '0';
  document.getElementById('stat-following').textContent = user.following || '0';
  // Gostos
  const gostosDiv = document.getElementById('profile-gostos');
  gostosDiv.innerHTML = '';
  if (user.gostos && user.gostos.length) {
    user.gostos.forEach(g => {
      const span = document.createElement('span');
      span.className = 'gosto-tag';
      span.textContent = g;
      gostosDiv.appendChild(span);
    });
  }
  // Destaques (mock: gostos)
  const highlightsDiv = document.getElementById('profile-instagram-highlights');
  highlightsDiv.innerHTML = '';
  if (user.gostos && user.gostos.length) {
    user.gostos.forEach(g => {
      const item = document.createElement('div');
      item.className = 'highlight-item';
      item.innerHTML = `<div class="highlight-circle">${g[0] ? g[0].toUpperCase() : ''}</div><span class="highlight-label">${g}</span>`;
      highlightsDiv.appendChild(item);
    });
  }
  // TikTok/Mobile
  document.getElementById('profile-avatar-mobile').src = user.avatarUrl || 'assets/avatars/avatar1.png';
  document.getElementById('profile-name-mobile').textContent = user.name || '';
  document.getElementById('profile-handle-mobile').textContent = (user.username ? '@' + user.username : '') + (user.age ? ' · ' + user.age + ' anos' : '');
  document.getElementById('profile-bio-mobile').textContent = user.bio || '';
  document.getElementById('stat-followers-mobile').textContent = user.followers || '0';
  document.getElementById('stat-following-mobile').textContent = user.following || '0';
  document.getElementById('stat-likes-mobile').textContent = user.likes || '0';
  // Gostos mobile
  const gostosMobileDiv = document.getElementById('profile-gostos-mobile');
  gostosMobileDiv.innerHTML = '';
  if (user.gostos && user.gostos.length) {
    user.gostos.forEach(g => {
      const span = document.createElement('span');
      span.className = 'gosto-tag-tiktok';
      span.textContent = g;
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
