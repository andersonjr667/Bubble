import { register, login, setToken, getMe } from './api.js';

// Lógica de login/registro
window.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) {
    loginForm.onsubmit = async e => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;
      if (!email || !password) return showToast('Preencha todos os campos');
      const res = await login({ email, password });
      if (res.token) {
        setToken(res.token);
        showToast('Login realizado com sucesso!');
        location.hash = '#discover';
      } else {
        showToast(res.message || 'Login falhou');
      }
    };
  }
  if (registerForm) {
    registerForm.onsubmit = async e => {
      e.preventDefault();
      const data = {
        name: registerForm.name.value,
        email: registerForm.email.value,
        password: registerForm.password.value,
        confirmPassword: registerForm.confirmPassword.value,
        age: registerForm.age.value,
        gostos: Array.from(registerForm.querySelectorAll('input[name="gostos"]:checked')).map(i => i.value),
        bio: registerForm.bio.value,
        avatarUrl: registerForm.avatarUrl.value
      };
      if (registerForm.preference) {
        data.preference = registerForm.preference.value;
      }
      if (data.password.length < 8) return showToast('Senha deve ter 8+ caracteres');
      if (data.password !== data.confirmPassword) return showToast('Senhas não conferem');
      if (data.gostos.length < 3 || data.gostos.length > 8) return showToast('Selecione de 3 a 8 gostos');
      const res = await register(data);
      if (res.token) {
        setToken(res.token);
        showToast('Cadastro realizado com sucesso!');
        location.hash = '#discover';
      } else if (res.message && res.message.includes('Email já cadastrado')) {
        showToast('Este email já está cadastrado. Use outro ou faça login.');
      } else {
        showToast(res.message || 'Registro falhou');
      }
    };
  }
});

function showToast(msg) {
  let toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
window.showToast = showToast;
