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
        setTimeout(() => {
          window.location.href = 'perfil.html';
        }, 600);
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
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 800);
      } else if (res.message && res.message.includes('Email já cadastrado')) {
        showToast('Este email já está cadastrado. Use outro ou faça login.');
      } else {
        showToast(res.message || 'Registro falhou');
      }
    };
    // Corrige erro de campo não focusable no submit do último passo
    registerForm.addEventListener('submit', function(e) {
      const terms = document.getElementById('terms');
      if (terms && !terms.checked && terms.offsetParent === null) {
        // Se o campo está required mas não visível, remove o required para evitar erro
        terms.required = false;
      }
    }, true);
  }
  // Multi-step cadastro avançar/voltar
  const steps = Array.from(document.querySelectorAll('.form-step'));
  let currentStep = steps.findIndex(s => s.classList.contains('active'));
  // Atualiza barra de progresso conforme o passo
  const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
  function updateProgress(idx) {
    progressSteps.forEach((step, i) => {
      const indicator = step.querySelector('.step-indicator');
      const label = step.querySelector('.step-label');
      if (i < idx) {
        indicator.classList.add('completed');
        indicator.classList.remove('active');
        label.classList.remove('active');
        label.classList.add('completed');
      } else if (i === idx) {
        indicator.classList.add('active');
        indicator.classList.remove('completed');
        label.classList.add('active');
        label.classList.remove('completed');
      } else {
        indicator.classList.remove('active', 'completed');
        label.classList.remove('active', 'completed');
      }
    });
  }
  function showStep(idx) {
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    currentStep = idx;
    updateProgress(idx);
    // Foca no primeiro input visível do passo
    const firstInput = steps[idx].querySelector('input,select,textarea');
    if (firstInput) firstInput.focus();
  }
  function validateStep(idx) {
    const step = steps[idx];
    let valid = true;
    step.querySelectorAll('input,select,textarea').forEach(input => {
      if (!input.checkValidity()) valid = false;
    });
    return valid;
  }
  // Botões avançar
  const next1 = document.getElementById('next-1');
  const next2 = document.getElementById('next-2');
  const next3 = document.getElementById('next-3');
  if (next1) next1.onclick = () => {
    if (validateStep(0)) showStep(1); else showToast('Preencha todos os campos obrigatórios.');
  };
  if (next2) next2.onclick = () => {
    if (validateStep(1)) showStep(2); else showToast('Selecione pelo menos 3 interesses.');
  };
  // Preenche revisão no passo final
  function fillReview() {
    document.getElementById('review-name').textContent = registerForm.name.value;
    document.getElementById('review-email').textContent = registerForm.email.value;
    document.getElementById('review-age').textContent = registerForm.age.value;
    document.getElementById('review-bio').textContent = registerForm.bio.value;
    const gostos = Array.from(registerForm.querySelectorAll('input[name="gostos"]:checked')).map(i => i.value);
    document.getElementById('review-gostos').textContent = gostos.join(', ');
  }
  if (next3) next3.onclick = () => {
    if (validateStep(2)) {
      fillReview();
      showStep(3);
    } else showToast('Escolha um avatar.');
  };
  // Botões voltar
  const back2 = document.getElementById('back-2');
  const back3 = document.getElementById('back-3');
  const back4 = document.getElementById('back-4');
  if (back2) back2.onclick = () => showStep(0);
  if (back3) back3.onclick = () => showStep(1);
  if (back4) back4.onclick = () => showStep(2);
});

function showToast(msg) {
  let toast = document.createElement('div');
  toast.classList.add('toast');

  toast.innerText = msg;
  document.body.appendChild(toast);
  // Forçar reflow para garantir a transição
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300); // Remover após a transição
  }, 3000);
}
window.showToast = showToast;
