EDZ BARBER — BLACK + LIME WEBSITE (20 NOVEMBER 2026)
==================================================

READY-TO-DEPLOY STATIC WEBSITE
==============================
Includes: index.html, privacy.html, style.css, booking.js, schedule.js,
consent.js, assets/ (your real haircut photos and lime-dot logo), favicon.svg,
robots.txt and sitemap.xml.

HOW TO PUBLISH WITH VERCEL
=========================
1. Download and unzip this ZIP file.
2. Make a backup of the current files of your edzbarber.co.uk website.
3. Upload the CONTENTS of this folder to the ROOT of your existing
   GitHub repository linked to Vercel, replacing old site files.
   index.html should be at the repository root, not inside an extra folder.
4. Commit changes to your branch that Vercel deploys.
5. Open https://www.edzbarber.co.uk/ and test a booking with your own
   details and a future time. Confirm the email arrives and the content
   includes service, total, UK-formatted date, time, and contact details.
6. Check that the successful booking counts as a Lead in Ads only if consent
   was accepted. Verify the cookie banner works when declined as well.

WEB3FORMS — ALREADY CONFIGURED
==============================
This site preserves the access key and endpoint from your previous site.
Endpoint: https://api.web3forms.com/submit
The form is sent only after the visitor has selected service, date, time,
and provided name, phone, email, and confirmed the policy.
A successful Web3Forms API response shows "Request sent" — NOT an
instant confirmed appointment. You still reply by WhatsApp/email.
No new Web3Forms key is required if your old one is still working.

IMPORTANT: Run a live test after deployment. This package has only been
verified using a mocked API response in a local browser test: it has NOT
sent a real message to your inbox.

SCHEDULE: EDIT schedule.js
==========================
You currently have a regular job ending around 15:00, so default request
hours on normal dates are 16:00, 17:00, 18:00, 19:00 (UK time).
To add a day off, add its date (YYYY-MM-DD) to daysOff; this then offers
09:00 through 19:00. For example:
 daysOff: ['2026-11-26', '2026-11-29'],
To close a day, add the date to closedDates.
To hide a booked hour, add it in blockedTimes, e.g.:
 blockedTimes: {'2026-11-26': ['09:00','10:00']},
You must keep these settings current. This is NOT live availability or an
automatically synchronized calendar; requests are always confirmed by you.

SERVICES
========
Men's haircut £15, beard trim £7, haircut+beard £22.
To change prices, update both the displayed prices in index.html and the
services object near the top of booking.js.

TRACKING / CONSENT
==================
Previous Google Ads and Meta Pixel configuration kept in consent.js.
Google Ads: AW-18502199382. Existing Meta Pixel retained.
The browser won't load these optional tags before tracking consent.
Lead events happen only after the API returns success; no personal data
is passed as an event payload.

OTHER CONTENT
=============
The logo and three haircut photos you supplied are included locally.
The page contains no invented testimonials or ratings. The location art
is a decorative graphic, not a live Google map.

CONTACT
=======
edzbarber.bookings@gmail.com
https://www.edzbarber.co.uk/
