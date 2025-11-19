import { getMe, updateUser, deleteUser } from './api.js';
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
  document.getElementById('profile-avatar').src = user.avatarUrl || 'assets/avatars/avatar1.png';
  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-age').textContent = 'Idade: ' + user.age;
  document.getElementById('profile-bio').textContent = user.bio;
  // Exibe gostos como chips estilizados
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
  // Preenche formulário de edição
  document.getElementById('edit-name').value = user.name;
  document.getElementById('edit-age').value = user.age;
  document.getElementById('edit-bio').value = user.bio;
  document.getElementById('edit-avatarUrl').value = user.avatarUrl;
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
