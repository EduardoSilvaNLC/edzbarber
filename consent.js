(() => {
  'use strict';
  const STORE_KEY = 'edz_google_ads_consent_v1';
  const TAG_ID = 'AW-18502199382';
  const BOOKING_CONVERSION = 'AW-18502199382/_NF6CO7CpLMdENbQxPZE';
  const banner = document.getElementById('cookie-banner');
  const accept = document.getElementById('accept-tracking');
  const reject = document.getElementById('reject-tracking');
  const manage = document.querySelectorAll('[data-open-cookie-preferences]');
  let tagLoaded = false;

  const getSaved = () => {
    try { return localStorage.getItem(STORE_KEY); }
    catch (_) { return null; }
  };
  const saveChoice = (value) => {
    try { localStorage.setItem(STORE_KEY, value); }
    catch (_) { /* Still respect choice during this page visit. */ }
  };
  let choice = getSaved();

  function consentUpdate(granted) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied'
    });
  }

  function loadTag() {
    if (tagLoaded) return;
    tagLoaded = true;
    // Configure the Google Ads tag only after the visitor opted in.
    if (typeof window.gtag === 'function') window.gtag('config', TAG_ID);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(TAG_ID);
    document.head.appendChild(script);
  }

  function deleteLocalGoogleCookies() {
    const names = document.cookie.split(';').map(c => c.split('=')[0].trim());
    const hosts = ['', '; domain=' + location.hostname, '; domain=.edzbarber.co.uk'];
    for (const name of names) {
      if (!/^(_gcl_|_ga($|_)|_gid$|_gat($|_)|_gac_)/.test(name)) continue;
      for (const host of hosts) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + host;
      }
    }
  }

  function showBanner() { if (banner) banner.hidden = false; }
  function hideBanner() { if (banner) banner.hidden = true; }

  if (choice === 'accepted') {
    consentUpdate(true);
    loadTag();
  } else if (choice !== 'rejected') {
    showBanner();
  }

  if (accept) accept.addEventListener('click', () => {
    choice = 'accepted';
    saveChoice(choice);
    consentUpdate(true);
    loadTag();
    hideBanner();
  });

  if (reject) reject.addEventListener('click', () => {
    const wasAccepted = choice === 'accepted';
    choice = 'rejected';
    saveChoice(choice);
    consentUpdate(false);
    hideBanner();
    if (wasAccepted) {
      // A reload removes the loaded tag from the document after consent withdrawal.
      deleteLocalGoogleCookies();
      location.reload();
    }
  });
  for (const button of manage) button.addEventListener('click', showBanner);

  window.edzTrackSuccessfulBooking = () => {
    // No Google Ads event when consent was not granted, and no customer details sent.
    if (choice !== 'accepted' || typeof window.gtag !== 'function') return;
    window.gtag('event', 'conversion', {
      send_to: BOOKING_CONVERSION
      // Value is managed in Google Ads as a nominal lead value, not a paid sale.
    });
  };
})();
