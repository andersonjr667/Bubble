// Gera QR code usando a biblioteca QRCode.js (https://davidshimjs.github.io/qrcodejs/)
// Este arquivo deve ser incluído como módulo na página de perfil
function gerarQRCode(elementId, url) {
  if (!window.QRCode) {
    console.error('QRCode.js não carregado');
    return;
  }
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = '';
  new window.QRCode(el, {
    text: url,
    width: 128,
    height: 128,
    colorDark: '#222',
    colorLight: '#fff',
    correctLevel: window.QRCode.CorrectLevel.H
  });
}
// Torna a função global
window.gerarQRCode = gerarQRCode;
