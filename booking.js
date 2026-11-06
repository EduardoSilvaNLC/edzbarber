(() => {
  'use strict';
  const form = document.getElementById('booking-request-form');
  const status = document.getElementById('booking-status');
  const submit = document.getElementById('submit-booking');
  const date = document.getElementById('booking-date');
  const serviceChecks = Array.from(document.querySelectorAll('.service-checkbox'));
  const selectedServices = document.getElementById('selected-services');
  const selectedTotal = document.getElementById('selected-total');
  const serviceNames = document.getElementById('service-summary-name');
  const serviceTotal = document.getElementById('service-summary-total');
  const servicesError = document.getElementById('services-error');
  const captchaError = document.getElementById('captcha-error');
  const captchaArea = document.getElementById('captcha-area');
  let sending = false;
  const clearCaptchaError = () => {
    if (captchaError) captchaError.hidden = true;
  };
  const resetCaptcha = () => {
    try {
      if (window.hcaptcha && typeof window.hcaptcha.reset === 'function') window.hcaptcha.reset();
    } catch (_) { /* Fail safely if the challenge library is unavailable. */ }
  };
  if (!form || !status || !submit || !date || !selectedServices || !selectedTotal || !serviceChecks.length) return;

  function updateServices() {
    const chosen = serviceChecks.filter(box => box.checked);
    const total = chosen.reduce((sum, box) => sum + Number(box.dataset.price || 0), 0);
    const serviceDescriptions = chosen.map(box => box.value);
    // These named fields are delivered to the booking email by Web3Forms.
    selectedServices.value = serviceDescriptions.join(' + ');
    selectedTotal.value = `£${total}`;
    serviceNames.textContent = chosen.map(box => box.value.split(' — ')[0]).join(' + ') || 'No service selected';
    serviceTotal.textContent = `£${total}`;
    if (chosen.length) {
      servicesError.hidden = true;
      serviceChecks.forEach(box => box.removeAttribute('aria-invalid'));
    }
    return chosen;
  }
  serviceChecks.forEach(box => box.addEventListener('change', updateServices));
  updateServices();

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
    if (sending) return;
    setMinDate();
    if (date.value && date.value < date.min) date.setCustomValidity('Choose today or a future date.');
    else date.setCustomValidity('');
    const chosenServices = updateServices();
    if (!chosenServices.length) {
      servicesError.hidden = false;
      serviceChecks.forEach(box => box.setAttribute('aria-invalid', 'true'));
      serviceChecks[0].focus();
      return;
    }
    if (!form.reportValidity()) return;
    // hCaptcha is mandatory: do not send a request without a verified-looking token.
    // The real token validation must be enabled in the Web3Forms form dashboard.
    const captchaToken = form.querySelector('[name="h-captcha-response"]')?.value?.trim();
    if (!captchaToken) {
      if (captchaError) {
        const widgetLoaded = Boolean(captchaArea?.querySelector('iframe'));
        captchaError.textContent = widgetLoaded
          ? 'Please complete the security check before sending.'
          : 'Security check could not load. Refresh the page, or email us to book.';
        captchaError.hidden = false;
      }
      captchaArea?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    clearCaptchaError();
    form.elements.subject.value = `EDZ Barber | Booking request: ${serviceNames.textContent} (${selectedTotal.value})`;

    sending = true;
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

      // Only a confirmed Web3Forms submission may be counted as a Google Ads lead.
      // The consent helper sends no tracking event unless the visitor opted in.
      if (typeof window.edzTrackSuccessfulBooking === 'function') {
        window.edzTrackSuccessfulBooking();
      }

      sending = false;
      form.hidden = true;
      status.innerHTML = '<strong>Request sent ✓</strong><p>Thanks! Your request has been sent. I’ll check my diary and reply to your email to confirm a time or offer an alternative.<br><br><b>Please don’t travel to an appointment until I’ve confirmed it with you.</b></p><button class="resend" type="button">Send another request</button>';
      status.querySelector('.resend').addEventListener('click', () => {
        form.reset();
        resetCaptcha();
        clearCaptchaError();
        form.hidden = false;
        status.hidden = true;
        status.innerHTML = '';
        submit.disabled = false;
        submit.innerHTML = originalContent;
        setMinDate();
        updateServices();
        form.querySelector('#booking-date').focus();
      });
      status.hidden = false;
      status.scrollIntoView({behavior:'smooth',block:'nearest'});
    } catch (_) {
      sending = false;
      // hCaptcha tokens are short-lived/single-use; allow a fresh challenge on retry.
      resetCaptcha();
      if (captchaError) {
        captchaError.textContent = 'Please complete the security check again before retrying.';
        captchaError.hidden = false;
      }
      status.classList.add('is-error');
      status.innerHTML = '<strong>We couldn’t send your request.</strong><p>Please check your connection and try again. If the problem continues, email <a href="mailto:edzbarber.bookings@gmail.com">edzbarber.bookings@gmail.com</a> with your preferred date and time. No appointment has been confirmed.</p>';
      status.hidden = false;
      submit.disabled = false;
      submit.innerHTML = originalContent;
    }
  });
})();
