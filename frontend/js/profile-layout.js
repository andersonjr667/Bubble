// Alternância entre layouts mobile/desktop sem inline script
function updateLayout() {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    document.body.classList.add('mobile-layout');
    document.body.classList.remove('desktop-layout');
  } else {
    document.body.classList.add('desktop-layout');
    document.body.classList.remove('mobile-layout');
  }
}
window.addEventListener('resize', updateLayout);
updateLayout();
