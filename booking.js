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
    haircut: { name: "Men's Haircut", price: 20 },
    beard: { name: 'Beard Trim', price: 7 },
    both: { name: 'Haircut + Beard', price: 27 }
  };
  const regular = schedule.regularDayTimes || ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const dayOff = schedule.dayOffTimes || ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const daysOff = schedule.daysOff || [];
  const closedDates = schedule.closedDates || [];
  const blockedTimes = schedule.blockedTimes || {};
  const leadMinutes = Number(schedule.minimumLeadMinutes) || 60;
  const maxDaysAhead = Number(schedule.maxDaysAhead) || 90;
  let sending = false;
  const promoToggle = $('promo-toggle');
  const promoDetails = $('promo-details');
  const promoInput = $('promo-code');
  const promoApply = $('promo-apply');
  const promoMessage = $('promo-message');
  const promoPrice = $('promo-price');
  let activePromo = null;
  let validatingPromo = false;

  function clearPromo() {
    activePromo = null;
    promoPrice.hidden = true;
    promoMessage.textContent = '';
    promoMessage.classList.remove('is-error');
  }
  promoToggle.addEventListener('click', () => {
    promoDetails.hidden = !promoDetails.hidden;
    promoToggle.setAttribute('aria-expanded', String(!promoDetails.hidden));
  });
  promoInput.addEventListener('input', clearPromo);
  promoInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); promoApply.click(); }
  });
  promoApply.addEventListener('click', async () => {
    if (validatingPromo) return;
    clearPromo();
    const code = promoInput.value.trim().toUpperCase();
    if (!code) {
      promoMessage.textContent = 'Enter a promo code first.';
      promoMessage.classList.add('is-error');
      return;
    }
    validatingPromo = true;
    promoApply.disabled = true;
    promoApply.textContent = 'Checking…';
    const selectedService = service.value;
    try {
      const response = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ code, service: service.value })
      });
      const data = await response.json();
      // Ignore an old response if the visitor changed the code or service mid-check.
      if (selectedService !== service.value || code !== promoInput.value.trim().toUpperCase()) return;
      if (!response.ok || !data.valid) {
        promoMessage.textContent = data.message || 'Invalid or expired promo code.';
        promoMessage.classList.add('is-error');
        return;
      }
      activePromo = { code: data.code, discount: data.discount, price: data.total };
      promoPrice.querySelector('.promo-old').textContent = `£${data.regularPrice}`;
      promoPrice.querySelector('strong').textContent = `£${data.total}`;
      promoPrice.querySelector('.promo-saved').textContent = `You save £${data.discount}`;
      promoPrice.querySelector('span:first-child').textContent = data.serviceName + ' total';
      promoPrice.hidden = false;
      promoMessage.textContent = `Code ${data.code} applied — £${data.discount} off your haircut.`;
    } catch (_) {
      promoMessage.textContent = 'Could not check your code. Please try again.';
      promoMessage.classList.add('is-error');
    } finally {
      validatingPromo = false;
      promoApply.disabled = false;
      promoApply.textContent = 'Apply';
    }
  });

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
    if (promoInput.value.trim() && !activePromo) {
      showError('Please click Apply to check your promo code, or clear the code to continue without a discount.');
      return;
    }
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
    a.textContent = activePromo ? `${picked.name} — £${activePromo.price} (promo ${activePromo.code}; regular £${picked.price})` : `${picked.name} — £${picked.price}`;
    const b = document.createElement('span');
    b.textContent = `${britishDate(date.value)} at ${time.value} `;
    $('booking-summary').append(a, b);
    // Remove focus from the Continue button before hiding it. On iOS browsers,
    // a focused control disappearing can cause scroll anchoring/jumping.
    continueButton.blur();
    selectors.hidden = true;
    hint.hidden = true;
    details.hidden = false;

    // Announce the new step without automatically opening the iPhone keyboard.
    // Focusing the name input here used to resize the visual viewport in Safari
    // and Instagram's embedded browser, making the page appear to stretch.
    const title = details.querySelector('h3');
    if (title) {
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    }

    // One immediate, stable reposition on narrow screens — no smooth animation
    // and no second scroll caused by autofocusing a text field.
    if (window.matchMedia('(max-width: 760px)').matches) {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, Math.max(0, section.getBoundingClientRect().top + window.scrollY - 8));
      root.style.scrollBehavior = previous;
    }
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
  service.addEventListener('change', () => { showError(''); clearPromo(); });
  time.addEventListener('change', () => showError(''));
  continueButton.addEventListener('click', enterDetails);
  $('edit-selection').addEventListener('click', () => {
    resetToBooking();
    showError('');
  });
  document.querySelectorAll('[data-book-service]').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-book-service');
      if (services[value]) { service.value = value; clearPromo(); }
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
    const promoCode = activePromo ? activePromo.code : '';
    if (promoInput.value.trim() && !promoCode) {
      showError('Please click Apply to check the code, or clear the field to continue at the regular price.');
      return;
    }
    sending = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending request…';
    result.hidden = true;
    try {
      let quote = null;
      // Only discounted bookings require server-signed verification.
      // Normal bookings can continue to use Web3Forms even if Vercel API is down.
      if (promoCode) {
        const quoteResponse = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            service: service.value, date: date.value, time: time.value,
            promo_code: promoCode,
            name: $('customer-name').value, phone: $('customer-phone').value,
            email: $('customer-email').value,
            request_acknowledged: $('request-consent').checked ? 'Yes' : 'No'
          })
        });
        quote = await quoteResponse.json();
        if (!quoteResponse.ok || quote.success !== true || quote.promoCode !== promoCode || quote.total !== 15) {
          showError(quote.message || 'Promo code could not be validated. Please try again or remove it.');
          return;
        }
      }
      // Web3Forms is called from the browser, NOT from a Vercel function.
      const regularPrice = chosen.price;
      const finalPrice = quote ? quote.total : regularPrice;
      const discount = quote ? quote.discount : 0;
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.service = chosen.name;
      payload.regular_price = `£${regularPrice}`;
      payload.discount = `£${discount}`;
      payload.promo_code = quote ? quote.promoCode : 'None';
      payload.price = `£${finalPrice}`;
      payload.preferred_date = britishDate(date.value);
      payload.preferred_time = time.value;
      payload.subject = `EDZ Barber | Booking request: ${chosen.name} £${finalPrice}${quote ? ' [PROMO EDZ5]' : ''}`;
      payload.verified_quote = quote ? (window.location.origin + quote.verificationPath) : 'Standard price (no promo code)';
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
        `Thank you! Your request for ${chosen.name} (£${finalPrice}${quote ? ` with code ${promoCode}` : ''}) on ${successDate} at ${successTime} was sent. I'll check my diary and reply by WhatsApp Business or Email. Your appointment is NOT confirmed until I reply — please wait before travelling.`);
      const again = document.createElement('button'); again.type = 'button';
      again.textContent = 'Send another request';
      again.addEventListener('click', () => {
        form.reset(); clearPromo(); promoDetails.hidden = true; promoToggle.setAttribute('aria-expanded','false'); form.hidden = false; result.hidden = true;
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
