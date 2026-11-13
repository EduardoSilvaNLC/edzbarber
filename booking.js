(() => {
  'use strict';
  const form = document.getElementById('booking-request-form');
  const status = document.getElementById('booking-status');
  const submit = document.getElementById('submit-booking');
  const date = document.getElementById('booking-date');
  const time = document.getElementById('booking-time');
  const serviceChecks = Array.from(document.querySelectorAll('.service-checkbox'));
  const selectedServices = document.getElementById('selected-services');
  const selectedTotal = document.getElementById('selected-total');
  const serviceNames = document.getElementById('service-summary-name');
  const serviceTotal = document.getElementById('service-summary-total');
  const servicesError = document.getElementById('services-error');
  if (!form || !status || !submit || !date || !time || !selectedServices || !selectedTotal || !serviceChecks.length) return;

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
  // Display the selected date in British order, independent of browser locale.
  // Keep the native calendar control so that mobile and desktop date picking still works.
  const ukDatePreview = document.getElementById('date-uk-preview');
  const formatUKDate = (iso) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
  };
  const formatUKTime = (clock) => {
    // Keep 24-hour HH:MM time both on screen and in the booking email.
    const match = /^(\d{2}):(\d{2})$/.exec(clock || '');
    return match ? `${match[1]}:${match[2]}` : '';
  };
  const updateDatePreview = () => {
    if (ukDatePreview) ukDatePreview.textContent = date.value
      ? `Selected date: ${formatUKDate(date.value)}`
      : 'UK date format: DD/MM/YYYY';
  };
  const setMinDate = () => { date.min = localUKDate(); };
  setMinDate();
  if (document.getElementById('copyright-year')) document.getElementById('copyright-year').textContent = String(new Date().getFullYear());
  date.addEventListener('change', () => { date.setCustomValidity(''); updateDatePreview(); });
  date.addEventListener('input', updateDatePreview);
  updateDatePreview();
  time.addEventListener('change', () => { time.setCustomValidity(''); });

  const originalContent = submit.innerHTML;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMinDate();
    if (date.value && date.value < date.min) date.setCustomValidity('Choose today or a future date.');
    else date.setCustomValidity('');
    // Validate the business hours even if the customer modifies the page controls.
    const allowedTimes = Array.from(time.options).map(option => option.value).filter(Boolean);
    if (time.value && !allowedTimes.includes(time.value)) {
      time.setCustomValidity('Please select a time between 09:00 and 19:00.');
    } else {
      time.setCustomValidity('');
    }
    const chosenServices = updateServices();
    if (!chosenServices.length) {
      servicesError.hidden = false;
      serviceChecks.forEach(box => box.setAttribute('aria-invalid', 'true'));
      serviceChecks[0].focus();
      return;
    }
    if (!form.reportValidity()) return;
    form.elements.subject.value = `EDZ Barber | Booking request: ${serviceNames.textContent} (${selectedTotal.value})`;

    submit.disabled = true;
    submit.textContent = 'Sending your request…';
    status.hidden = true;
    status.className = 'form-feedback';

    try {
      // Web3Forms accepts JSON and automatically uses the 'email' field as Reply-To.
      const body = Object.fromEntries(new FormData(form).entries());
      // Send DD/MM/YYYY date and 24-hour HH:MM time in the booking email.
      body.preferred_date = formatUKDate(date.value);
      body.preferred_time = formatUKTime(time.value);
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

      form.hidden = true;
      status.innerHTML = '<strong>Request sent ✓</strong><p>Thanks! Your request has been sent. I’ll check my diary and confirm your time or offer an alternative by WhatsApp Business message or email.<br><br><b>Please don’t travel to an appointment until I’ve confirmed it with you.</b></p><button class="resend" type="button">Send another request</button>';
      status.querySelector('.resend').addEventListener('click', () => {
        form.reset();
        form.hidden = false;
        status.hidden = true;
        status.innerHTML = '';
        submit.disabled = false;
        submit.innerHTML = originalContent;
        setMinDate();
        updateServices();
        updateDatePreview();
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
