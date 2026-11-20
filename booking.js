(() => {
  'use strict';
  const form = document.querySelector('#booking-request-form');
  if (!form) return;
  const $ = selector => document.querySelector(selector);
  const steps = [...document.querySelectorAll('[data-step]')];
  const progress = [...document.querySelectorAll('[data-progress]')];
  const date = $('#booking-date');
  const timeGrid = $('#time-grid');
  const status = $('#booking-status');
  const submit = $('#submit-booking');
  const serviceOptions = [...document.querySelectorAll('input[name="service_choice"]')];
  const config = window.EDZ_BOOKING_SCHEDULE || {};
  const regularDayTimes = config.regularDayTimes || ['16:00', '17:00', '18:00', '19:00'];
  const dayOffTimes = config.dayOffTimes || ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
  const daysOff = config.daysOff || [];
  const closedDates = config.closedDates || [];
  const blockedTimes = config.blockedTimes || {};
  const leadMinutes = Number(config.minimumLeadMinutes) || 60;
  const services = {
    haircut: {name:"Men's Haircut", price:15},
    beard: {name:'Beard Trim', price:7},
    both: {name:'Haircut + Beard', price:22}
  };
  let step = 0;
  let selectedTime = '';
  let pending = false;
  const londonNow = () => Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone:'Europe/London', year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hourCycle:'h23'
  }).formatToParts(new Date()).filter(p => p.type !== 'literal').map(p => [p.type,p.value]));
  const ukToday = () => { const p=londonNow(); return `${p.year}-${p.month}-${p.day}`; };
  const showBritishDate = iso => {const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? `${m[3]}/${m[2]}/${m[1]}` : '';};
  const getService = () => services[(serviceOptions.find(r => r.checked) || serviceOptions[0]).value] || services.haircut;

  function setStep(target, scroll = false) {
    step = target;
    steps.forEach(el => { el.hidden = Number(el.dataset.step) !== step; });
    progress.forEach(el => {
      const n = Number(el.dataset.progress);
      el.classList.toggle('current', n === step);
      el.classList.toggle('done', n < step);
      if (n === step) el.setAttribute('aria-current','step'); else el.removeAttribute('aria-current');
    });
    if (scroll) $('#booking').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
  }
  function chooseService(value) {
    const r = serviceOptions.find(x => x.value === value);
    if (!r) return;
    r.checked = true;
    document.querySelectorAll('.service-option').forEach(label => label.classList.toggle('selected',label.contains(r)));
    const s = getService();
    $('#booking-services').value = `${s.name} — £${s.price}`;
    $('#booking-total').value = `£${s.price}`;
  }
  serviceOptions.forEach(r => r.addEventListener('change',() => chooseService(r.value)));
  chooseService('haircut');

  function requestTimes(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '') || iso < ukToday() || closedDates.includes(iso)) return [];
    const all = daysOff.includes(iso) ? dayOffTimes : regularDayTimes;
    let times = all.filter(t => /^([01]\d|2[0-3]):[0-5]\d$/.test(t) && !(blockedTimes[iso] || []).includes(t));
    if (iso === ukToday()) {
      const now = londonNow();
      const limit = Number(now.hour)*60 + Number(now.minute) + leadMinutes;
      times = times.filter(t => Number(t.slice(0,2))*60 + Number(t.slice(3)) >= limit);
    }
    return [...new Set(times)].sort();
  }
  function refreshDate() {
    date.min = ukToday();
    $('#date-preview').textContent = date.value ? `Selected date: ${showBritishDate(date.value)}` : 'UK date format: DD/MM/YYYY';
    const times = requestTimes(date.value);
    if (!date.value) $('#date-note').textContent = 'Choose a date to see the request times.';
    else if (date.value < ukToday()) $('#date-note').textContent = 'Please choose today or a future date.';
    else if (closedDates.includes(date.value)) $('#date-note').textContent = 'No appointments can be requested on this date.';
    else if (!times.length) $('#date-note').textContent = 'There are no request times remaining on this day. Please choose another date.';
    else $('#date-note').textContent = `${daysOff.includes(date.value)?'Day-off':'Working-day'} request times are available to select. All requests require personal confirmation.`;
    if (selectedTime && !times.includes(selectedTime)) selectedTime = '';
    $('#date-error').hidden = true;
  }
  date.addEventListener('input', refreshDate);
  date.addEventListener('change', refreshDate);
  refreshDate();

  function renderTimes() {
    const times = requestTimes(date.value);
    timeGrid.replaceChildren();
    $('#chosen-date-label').textContent = showBritishDate(date.value);
    if (!times.length) {
      const message=document.createElement('p'); message.textContent='No request times for this date. Go back and choose another.';message.className='field-hint';timeGrid.appendChild(message);
      return;
    }
    times.forEach(time => {
      const btn=document.createElement('button');btn.type='button';btn.textContent=time;btn.className=time === selectedTime ? 'selected' : '';
      btn.setAttribute('aria-pressed',String(time === selectedTime));
      btn.addEventListener('click',() => {
        selectedTime = time;
        [...timeGrid.querySelectorAll('button')].forEach(el => {const isChosen=el===btn; el.classList.toggle('selected',isChosen);el.setAttribute('aria-pressed',String(isChosen));});
        $('#time-error').hidden=true;
      });
      timeGrid.appendChild(btn);
    });
  }
  function validateDate() {
    refreshDate();
    const valid = date.checkValidity() && date.value >= ukToday() && requestTimes(date.value).length > 0;
    $('#date-error').hidden = valid;
    if (!valid) date.focus();
    return valid;
  }
  function validateDetails() {
    const contactFields=['#booking-name','#booking-phone','#booking-email','#booking-policy'].map($);
    const bad=contactFields.find(el => !el.checkValidity());
    $('#details-error').hidden = !bad;
    if (bad) {bad.focus();bad.reportValidity();return false;}
    return true;
  }
  document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click',() => {
    const target=Number(btn.dataset.next);
    if (step === 1 && !validateDate()) return;
    if (step === 2 && (!requestTimes(date.value).includes(selectedTime))) {$('#time-error').hidden=false;return;}
    if (target===2) renderTimes();
    if (target===3) updateSummary();
    setStep(target);
  }));
  document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click',() => setStep(Number(btn.dataset.back))));
  $('#change-date').addEventListener('click', () => setStep(1));
  document.querySelectorAll('[data-service-book]').forEach(btn => btn.addEventListener('click',() => {chooseService(btn.dataset.serviceBook);setStep(1,true);date.focus({preventScroll:true});}));
  function updateSummary() {
    const s=getService();
    const summary=$('#booking-summary');
    summary.replaceChildren();
    const name=document.createElement('strong');name.textContent=`${s.name} — £${s.price}`;
    const when=document.createElement('span');when.textContent=`${showBritishDate(date.value)} at ${selectedTime} (UK time)`;
    summary.append(name,when);
  }
  function setStatus(type,heading,body) {
    status.hidden=false;
    status.className=`booking-status${type==='error'?' error':''}`;
    status.replaceChildren();
    const h=document.createElement('h3');h.textContent=heading;
    const p=document.createElement('p');p.textContent=body;
    status.append(h,p);
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (pending) return;
    if (!validateDate()) {setStep(1);return;}
    if (!selectedTime || !requestTimes(date.value).includes(selectedTime)) {setStep(2);renderTimes();$('#time-error').hidden=false;return;}
    if (!validateDetails()) return;
    const s=getService();
    $('#booking-services').value=`${s.name} — £${s.price}`;
    $('#booking-total').value=`£${s.price}`;
    $('#preferred-date').value=showBritishDate(date.value);
    $('#preferred-time').value=selectedTime;
    $('#booking-subject').value=`EDZ Barber | Booking request: ${s.name} (£${s.price})`;
    const payload=Object.fromEntries(new FormData(form).entries());
    // Never send contact data to Google Ads or Meta; only to the existing Web3Forms endpoint.
    delete payload.service_choice;
    pending=true;
    submit.disabled=true;
    submit.textContent='SENDING REQUEST…';
    status.hidden=true;
    try {
      const response=await fetch(form.action, {method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)});
      const result=await response.json();
      if (!response.ok || result.success !== true) throw new Error('Web3Forms did not accept this request');
      if (typeof window.edzTrackSuccessfulBooking === 'function') window.edzTrackSuccessfulBooking();
      form.hidden=true;
      setStatus('success','Request sent ✓',`Thanks! Your request for ${s.name} on ${showBritishDate(date.value)} at ${selectedTime} was submitted. I'll check my diary and reply by WhatsApp Business or email. Your appointment is NOT confirmed yet — please wait for my reply before travelling.`);
      const again=document.createElement('button');again.type='button';again.textContent='SEND ANOTHER REQUEST';
      again.addEventListener('click',()=>{form.reset();form.hidden=false;selectedTime='';pending=false;submit.disabled=false;submit.innerHTML='SEND BOOKING REQUEST <span aria-hidden="true">↗</span>';status.hidden=true;chooseService('haircut');refreshDate();setStep(0);$('#booking').scrollIntoView({behavior:'smooth'});});
      status.appendChild(again);
      status.scrollIntoView({behavior:'smooth',block:'nearest'});
    } catch (err) {
      setStatus('error','Unable to send your request','Please check your connection and try again. If it continues, email edzbarber.bookings@gmail.com with your service, date and time. No appointment has been confirmed.');
      const retry=document.createElement('button');retry.type='button';retry.textContent='TRY AGAIN';retry.addEventListener('click',()=>{status.hidden=true;});status.appendChild(retry);
    } finally {
      if (!form.hidden) {pending=false;submit.disabled=false;submit.innerHTML='SEND BOOKING REQUEST <span aria-hidden="true">↗</span>';}
    }
  });
  const menu=$('.menu-toggle'),nav=$('.main-nav');
  if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'Open navigation':'Close navigation');nav.classList.toggle('open',!open);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}));}
  const floatingBar=$('.mobile-sticky');
  if (floatingBar && 'IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries => {
      floatingBar.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, {threshold:0.12});
    observer.observe($('#booking'));
  }
  $('#year').textContent=String(new Date().getFullYear());
  setStep(0);
})();
