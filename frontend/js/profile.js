import { getMe, updateUser, uploadAvatar, deleteUser } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profile-form');
  const avatarInput = document.getElementById('avatar-input');
  const deleteBtn = document.getElementById('delete-account');
  async function loadProfile() {
    const user = await getMe();
    if (!user) return;
    profileForm.name.value = user.name;
    profileForm.age.value = user.age;
    profileForm.bio.value = user.bio;
    profileForm.avatarUrl.value = user.avatarUrl;
    user.gostos.forEach(g => {
      const el = profileForm.querySelector(`input[value='${g}']`);
      if (el) el.checked = true;
    });
  }
  profileForm.onsubmit = async e => {
    e.preventDefault();
    const data = {
      name: profileForm.name.value,
      age: profileForm.age.value,
      bio: profileForm.bio.value,
      avatarUrl: profileForm.avatarUrl.value,
      gostos: Array.from(profileForm.querySelectorAll('input[name="gostos"]:checked')).map(i => i.value)
    };
    const res = await updateUser(user._id, data);
    if (res.name) showToast('Perfil atualizado!');
    else showToast(res.message || 'Erro ao atualizar');
  };
  avatarInput.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadAvatar(file);
    if (res.url) {
      profileForm.avatarUrl.value = res.url;
      showToast('Avatar atualizado!');
    } else {
      showToast(res.message || 'Erro no upload');
    }
  };
  deleteBtn.onclick = async () => {
    if (confirm('Tem certeza que deseja deletar sua conta?')) {
      const res = await deleteUser(user._id);
      if (res.message) {
        showToast('Conta deletada');
        location.hash = '#welcome';
      }
    }
  };
  loadProfile();
});
