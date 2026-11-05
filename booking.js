(() => {
  'use strict';
  const form = document.getElementById('booking-request-form');
  const status = document.getElementById('booking-status');
  const submit = document.getElementById('submit-booking');
  const date = document.getElementById('booking-date');
  if (!form || !status || !submit || !date) return;

  const localUKDate = () => {
    // Use the appointment location's date even for visitors travelling or using other time zones.
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const p = Object.fromEntries(parts.filter(x => x.type !== 'literal').map(x => [x.type,x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  };
  const setMinDate = () => { date.min = localUKDate(); };
  setMinDate();
  if (document.getElementById('copyright-year')) document.getElementById('copyright-year').textContent = String(new Date().getFullYear());
  date.addEventListener('change', () => { date.setCustomValidity(''); });

  const originalContent = submit.innerHTML;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMinDate();
    if (date.value && date.value < date.min) date.setCustomValidity('Choose today or a future date.');
    else date.setCustomValidity('');
    if (!form.reportValidity()) return;

    const email = document.getElementById('booking-email').value.trim();
    const dateText = date.value;
    const timeText = document.getElementById('booking-time').value;
    submit.disabled = true;
    submit.textContent = 'Sending your request…';
    status.hidden = true;
    status.className = 'form-feedback';

    try {
      // Web3Forms accepts JSON and automatically uses the 'email' field as Reply-To.
      const body = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(form.action, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body)
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Request not accepted');

      form.hidden = true;
      status.innerHTML = '<strong>Request sent ✓</strong><p>Thanks! Your request has been sent. I’ll check my diary and reply to your email to confirm a time or offer an alternative.<br><br><b>Please don’t travel to an appointment until I’ve confirmed it with you.</b></p><button class="resend" type="button">Send another request</button>';
      status.querySelector('.resend').addEventListener('click', () => {
        form.reset();
        form.hidden = false;
        status.hidden = true;
        status.innerHTML = '';
        submit.disabled = false;
        submit.innerHTML = originalContent;
        setMinDate();
        form.querySelector('#booking-date').focus();
      });
      status.hidden = false;
      status.scrollIntoView({behavior:'smooth',block:'nearest'});
    } catch (_) {
      status.classList.add('is-error');
      status.innerHTML = '<strong>We couldn’t send your request.</strong><p>Please check your connection and try again. If the problem continues, email <a href="mailto:edzbarber.bookings@gmail.com">edzbarber.bookings@gmail.com</a> with your preferred date and time. No appointment has been confirmed.</p>';
      status.hidden = false;
      submit.disabled = false;
      submit.innerHTML = originalContent;
    }
  });
})();
