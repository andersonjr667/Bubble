import { getMe, updateUser } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('questionnaire-form');
  if (!form) return;
  form.onsubmit = async e => {
    e.preventDefault();
    const gostos = Array.from(form.querySelectorAll('input[name="gostos"]:checked')).map(i => i.value);
    const preference = form.preference.value;
    if (gostos.length < 3 || gostos.length > 8) {
      showToast('Selecione de 3 a 8 gostos');
      return;
    }
    const user = await getMe();
    const res = await updateUser(user._id, { gostos, preference, firstLogin: false });
    if (res.gostos) {
      showToast('Preferências salvas!');
      location.hash = '#discover';
    } else {
      showToast(res.message || 'Erro ao salvar preferências');
    }
  };
});
