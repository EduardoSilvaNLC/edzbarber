(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const form = $('booking-request-form');
  if (!form) return;
  const section = $('booking');
  const service = $('service-choice');
  const date = $('date-choice');
  const time = $('time-choice');
  const selectors = $('booking-selectors');
  const details = $('details-panel');
  const continueButton = $('continue-booking');
  const submitButton = $('send-request');
  const error = $('booking-error');
  const result = $('booking-result');
  const hint = $('date-help');
  const schedule = window.EDZ_BOOKING_SCHEDULE || {};
  const services = {
    haircut: { name: "Men's Haircut", price: 15 },
    beard: { name: 'Beard Trim', price: 7 },
    both: { name: 'Haircut + Beard', price: 22 }
  };
  const regular = schedule.regularDayTimes || ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const dayOff = schedule.dayOffTimes || ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const daysOff = schedule.daysOff || [];
  const closedDates = schedule.closedDates || [];
  const blockedTimes = schedule.blockedTimes || {};
  const leadMinutes = Number(schedule.minimumLeadMinutes) || 60;
  const maxDaysAhead = Number(schedule.maxDaysAhead) || 90;
  let sending = false;

  // UK time is authoritative even if someone visits the site from another timezone.
  const ukParts = () => Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).filter(x => x.type !== 'literal').map(x => [x.type, x.value]));
  function todayISO() {
    const n = ukParts();
    return `${n.year}-${n.month}-${n.day}`;
  }
  function maxDateISO() {
    const d = new Date(`${todayISO()}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + maxDaysAhead);
    return d.toISOString().slice(0, 10);
  }
  function britishDate(iso) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
  }
  function validDate(iso) {
    if (!/^\d{4}-\d\d-\d\d$/.test(iso || '')) return false;
    const parsed = new Date(`${iso}T12:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === iso && iso >= todayISO() && iso <= maxDateISO() && !closedDates.includes(iso);
  }
  function slotsFor(iso) {
    if (!validDate(iso)) return [];
    const options = daysOff.includes(iso) ? dayOff : regular;
    let slots = options.filter(x => /^([01]\d|2[0-3]):[0-5]\d$/.test(x) && !(blockedTimes[iso] || []).includes(x));
    if (iso === todayISO()) {
      const now = ukParts();
      const min = Number(now.hour) * 60 + Number(now.minute) + leadMinutes;
      slots = slots.filter(x => Number(x.slice(0, 2)) * 60 + Number(x.slice(3)) >= min);
    }
    return [...new Set(slots)].sort();
  }
  function showError(message) {
    error.textContent = message;
    error.hidden = !message;
  }
  function updateTimes() {
    date.min = todayISO();
    date.max = maxDateISO();
    const previous = time.value;
    const slots = slotsFor(date.value);
    time.replaceChildren();
    const first = new Option(date.value ? (slots.length ? 'Select a time' : 'No request times on this date') : 'Choose a date first', '');
    time.add(first);
    slots.forEach(t => time.add(new Option(t, t)));
    time.value = slots.includes(previous) ? previous : '';
    time.disabled = slots.length === 0;
    hint.textContent = slots.length
      ? 'All requests need manual confirmation; no online payment.'
      : 'Choose a date to see preferred request times. These are not live availability.';
    showError('');
  }
  function resetToBooking() {
    details.hidden = true;
    selectors.hidden = false;
    hint.hidden = false;
    continueButton.focus({ preventScroll: true });
  }
  function enterDetails() {
    showError('');
    if (!validDate(date.value)) {
      showError('Please choose an available future date.');
      date.focus(); return;
    }
    if (!slotsFor(date.value).includes(time.value)) {
      showError('Please select a preferred time for this date.');
      time.focus(); return;
    }
    const picked = services[service.value] || services.haircut;
    $('booking-summary').replaceChildren();
    const a = document.createElement('strong');
    a.textContent = `${picked.name} — £${picked.price}`;
    const b = document.createElement('span');
    b.textContent = `${britishDate(date.value)} at ${time.value} (UK time)`;
    $('booking-summary').append(a, b);
    selectors.hidden = true;
    hint.hidden = true;
    details.hidden = false;
    $('customer-name').focus({ preventScroll: true });
    if (window.innerWidth < 760) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function resultMessage(type, title, message) {
    result.hidden = false;
    result.className = `booking-result${type === 'error' ? ' error' : ''}`;
    result.replaceChildren();
    const h = document.createElement('h3'); h.textContent = title;
    const p = document.createElement('p'); p.textContent = message;
    result.append(h, p);
  }
  date.addEventListener('change', updateTimes);
  date.addEventListener('input', updateTimes);
  service.addEventListener('change', () => showError(''));
  time.addEventListener('change', () => showError(''));
  continueButton.addEventListener('click', enterDetails);
  $('edit-selection').addEventListener('click', () => {
    resetToBooking();
    showError('');
  });
  document.querySelectorAll('[data-book-service]').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-book-service');
      if (services[value]) service.value = value;
      if (!details.hidden) resetToBooking();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    if (!validDate(date.value) || !slotsFor(date.value).includes(time.value)) {
      resetToBooking(); showError('Please select a valid date and preferred time.'); return;
    }
    if (details.hidden) { enterDetails(); return; }
    for (const field of ['customer-name', 'customer-phone', 'customer-email', 'request-consent'].map($)) {
      if (!field.checkValidity()) {
        showError('Please complete your contact details and accept the booking request notice.');
        field.reportValidity(); field.focus(); return;
      }
    }
    showError('');
    const chosen = services[service.value] || services.haircut;
    $('submitted-service').value = chosen.name;
    $('submitted-price').value = `£${chosen.price}`;
    $('submitted-date').value = britishDate(date.value);
    $('submitted-time').value = `${time.value} (UK time)`;
    $('booking-subject').value = `EDZ Barber | Booking request: ${chosen.name} £${chosen.price}`;
    const payload = Object.fromEntries(new FormData(form).entries());
    sending = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending request…';
    result.hidden = true;
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error('Web3Forms could not accept the form');
      if (typeof window.edzTrackSuccessfulBooking === 'function') window.edzTrackSuccessfulBooking();
      const successDate = britishDate(date.value);
      const successTime = time.value;
      form.hidden = true;
      resultMessage('success', 'Your request was sent',
        `Thank you! I've received your request for ${chosen.name} on ${successDate} at ${successTime}. I'll check my diary and reply by WhatsApp Business or email. Your appointment is NOT confirmed until I reply — please wait before travelling.`);
      const again = document.createElement('button'); again.type = 'button';
      again.textContent = 'Send another request';
      again.addEventListener('click', () => {
        form.reset(); form.hidden = false; result.hidden = true;
        selectors.hidden = false; details.hidden = true; hint.hidden = false;
        time.value = ''; updateTimes(); section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      result.append(again);
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      resultMessage('error', 'Request not sent',
        'Sorry, your request could not be submitted. Please try again. Alternatively, email edzbarber.bookings@gmail.com with your service, date and preferred time. No appointment has been confirmed.');
      const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Try again';
      retry.addEventListener('click', () => { result.hidden = true; }); result.append(retry);
    } finally {
      sending = false;
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send Booking Request <svg class="icon" aria-hidden="true"><use href="#ic-arrow"/></svg>';
    }
  });
  const menu = document.querySelector('.menu-button');
  const nav = $('main-nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      menu.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
    }));
  }
  const sticky = document.querySelector('.sticky-book');
  if (sticky && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      sticky.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.05 }).observe(section);
  }
  const year = $('year');
  if (year) year.textContent = new Date().getFullYear();
  date.min = todayISO(); date.max = maxDateISO(); updateTimes();
})();
