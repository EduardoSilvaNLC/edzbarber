
/* Fresha booking */
const FRESHA_BOOKING_URL =
  'https://www.fresha.com/en-GB/a/edz-barber-cambridge-47-51-norfolk-street-vykvcwd2?_gl=1*xmnd0v*_gcl_au*MTI5MTM2MjU0LjE3OTE2NTIwODYuMTM2NTY2MTE1LjE3OTE2NTMzMzEuMTc5MTY1MzMzMC4xNjcyMTUzNDkzLjE3OTE2NTMzMzEuMTc5MTY1MzMzMA..*_ga*OTM4ODk5NTg1LjE3OTE2NTIwODY.*_ga_SMQNG7NE8C*czE3OTE2NTIwODUkbzEkZzEkdDE3OTE2NTQzODEkajYwJGwwJGgw&pId=3115817&preview=b47a7860-7c64-4f92-8964-db8458ee4c36';

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
