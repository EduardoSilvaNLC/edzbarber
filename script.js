/* Fresha booking: paste your exact public Fresha booking URL below. */
const FRESHA_BOOKING_URL = '';

document.querySelectorAll('[data-fresha]').forEach(link => {
  const isValidFreshaUrl = (() => {
    try {
      const url = new URL(FRESHA_BOOKING_URL);
      return url.protocol === 'https:' && (url.hostname === 'fresha.com' || url.hostname.endsWith('.fresha.com'));
    } catch { return false; }
  })();
  if (isValidFreshaUrl) {
    link.href = FRESHA_BOOKING_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.addEventListener('click', event => {
      event.preventDefault();
      alert('Fresha booking link coming soon. For now, please message me on Instagram @EDZBARBER.');
    });
  }
});

/* Instagram: @EDZBARBER */
const INSTAGRAM_USERNAME = 'EDZBARBER';

const configured = INSTAGRAM_USERNAME !== 'SEU_USUARIO_AQUI' && /^[a-zA-Z0-9._]{1,30}$/.test(INSTAGRAM_USERNAME);
const instagramUrl = configured ? `https://www.instagram.com/${INSTAGRAM_USERNAME}/` : 'https://www.instagram.com/';

document.querySelectorAll('[data-instagram]').forEach(link => {
  link.href = instagramUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  if (!configured) {
    link.addEventListener('click', event => {
      event.preventDefault();
      alert('Before publishing: add your Instagram username in script.js');
    });
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  const opened = mobileMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(opened));
  menuBtn.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
  menuBtn.textContent = opened ? '×' : '☰';
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.textContent = '☰';
}));
