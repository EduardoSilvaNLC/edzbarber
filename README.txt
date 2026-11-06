EDZ BARBER — Google Ads Booking Conversion (6 November 2026)

CONTENTS
index.html, style.css, booking.js, consent.js, privacy.html, favicon.svg, booking/index.html

GOOGLE ADS SETUP
- Google Ads tag ID: AW-18502199382
- Booking lead conversion: AW-18502199382/_NF6CO7CpLMdENbQxPZE
- The conversion is fired in booking.js ONLY after Web3Forms returns HTTP success with success: true.
- Conversion does not fire for a click, a failed form, a page view or a rejected/unknown tracking consent.
- The conversion does not send customer contact information or service data to Google Ads.

OPTIONAL TRACKING CONSENT
- Google Ads (basic consent mode) is NOT loaded until a visitor accepts optional tracking.
- The banner has equal 'Reject optional' and 'Accept optional' buttons.
- A 'COOKIE SETTINGS' button in the footer and a 'Cookie settings' control in Privacy let users change preferences.
- If a visitor rejects optional tracking, their appointment request can still be sent by Web3Forms but will not be tracked by Google Ads.
- Google Tag Assistant may need you to accept optional tracking on the site before tag detection.

PUBLISHING
1. Extract this ZIP and upload all files/folders into the root of your GitHub site repository.
2. Let Vercel deploy, then open www.edzbarber.co.uk in a private browser window.
3. Accept optional tracking for the Google Ads conversion tracking test.
4. Send a test booking request and ensure an email arrives at edzbarber.bookings@gmail.com.
5. Use Google Tag Assistant to check that the conversion fires exactly once on a successful form submission, not on a click or failed submission.
6. In Google Ads, use 'EDZ - Booking Request' as the principal conversion for the new Search campaign.
7. Do not activate your ad campaign until the conversion is verified and the billing alert is resolved.

IMPORTANT
- This zip does not publish to GitHub/Vercel automatically.
- No live form email or Google Ads conversion was sent during this packaging process.
- Cookie handling is a minimal opt-in implementation; review your business's privacy obligations and consent solution as needed.
