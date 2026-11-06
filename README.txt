EDZ BARBER — hCaptcha anti-spam update (6 November 2026)

INCLUDED
index.html, booking.js, consent.js, style.css, favicon.svg, privacy.html
These are complete files for your existing site. Replace the corresponding files in your GitHub repository / Vercel deployment. Keep any existing booking/ folder, redirects and assets that are not in this ZIP.

WHAT CHANGED
- Added a compact hCaptcha security check just above "Send booking request".
- Included the official Web3Forms hCaptcha integration script.
- Booking JavaScript refuses to submit until there is an h-captcha-response token.
- Token is sent with the existing Web3Forms JSON request for server-side validation.
- If sending fails, the challenge resets so the visitor can try again.
- Added a spam-prevention paragraph to the privacy notice.
- Existing Google Ads and Meta conversion events still run only AFTER Web3Forms confirms a successful submission, subject to the visitor's advertising consent.
- Honeypot is retained. The uploaded site design, location, social links and prices (£10 haircut / £7 beard trim) are retained unchanged.

CRITICAL: FINISH IN THE WEB3FORMS DASHBOARD
1. Sign in to https://app.web3forms.com/ with edzbarber.bookings@gmail.com.
2. Open your existing EDZ Barber booking form and its Settings / Spam Protection.
3. Select/enable hCaptcha as its required spam/captcha protection and save.
4. Without step 3, the widget alone is NOT sufficient server-side protection against scripted submissions.
The Web3Forms documentation confirms enabling hCaptcha in dashboard is required:
https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha

TEST AFTER DEPLOY
1. Open the site in a new incognito tab; check the compact hCaptcha appears before Send booking request.
2. Fill required fields; do NOT complete captcha; click submit. It MUST refuse to send and show a warning.
3. Complete captcha; send a test booking and check your Gmail receives it.
4. Make a submission with invalid/expired token (using a testing tool) and confirm it is rejected by the Web3Forms server.
5. Check Google Tag Assistant and Meta events as appropriate: only successful submissions should trigger lead events, with advertising consent.
6. Test on a mobile phone. If a third-party challenge fails to load due to blocking extensions, visitors may need to disable the blocker or email the booking address directly.

NOTE
The public access_key in index.html belongs to Web3Forms, and is expected to be used client-side. Server-side CAPTCHA verification in the dashboard is essential to avoid bypass via direct API calls.
