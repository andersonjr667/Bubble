

window.addEventListener('DOMContentLoaded', async () => {
  let tentativas = 0;
  while (!window.userId && tentativas < 30) {
    await new Promise(r => setTimeout(r, 100));
    tentativas++;
  }
  const userId = window.userId;
  if (!userId) return;
  const url = window.location.origin + '/perfil.html?user=' + userId;
  const linkInput = document.getElementById('profile-link');
  if (linkInput) linkInput.value = url;
  if (typeof gerarQRCode === 'function') {
    gerarQRCode('profile-qr', url);
  }
  // Copiar link
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(url);
      copyBtn.textContent = 'Copiado!';
      setTimeout(() => (copyBtn.textContent = 'Copiar'), 1200);
    };
  }
});
