
/* Fresha booking */
const FRESHA_BOOKING_URL =
  'https://www.fresha.com/en-GB/a/edz-barber-cambridge-47-51-norfolk-street-vykvcwd2';

document.querySelectorAll('[data-fresha]').forEach(link => {
  link.href = FRESHA_BOOKING_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

/* Instagram: @EDZBARBER */
const INSTAGRAM_USERNAME = 'EDZBARBER';

const instagramUrl =
  `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

document.querySelectorAll('[data-instagram]').forEach(link => {
  link.href = instagramUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

/* Copyright year */
document.getElementById('year').textContent =
  new Date().getFullYear();

/* Mobile menu */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  const opened = mobileMenu.classList.toggle('open');

  menuBtn.setAttribute('aria-expanded', String(opened));
  menuBtn.setAttribute(
    'aria-label',
    opened ? 'Close menu' : 'Open menu'
  );

  menuBtn.textContent = opened ? '×' : '☰';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = '☰';
  });
});
