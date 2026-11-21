EDZ BARBER — COOKIE CONSENT & HOURS FIX (21 November 2026)
==========================================================
Changes:
1) Cookie banner shows for visitors who have not responded to the updated v3 consent.
   Accept and reject options appear on the banner. Either option saves a choice.
   A visitor can change it later via footer “Cookie settings” or mobile menu.
   Google Ads and Meta Pixel do not load until optional consent is accepted.
   If the user revokes consent, the page reloads to remove loaded trackers.
2) Every day Monday–Sunday: 09:00, 10:00, 11:00, 12:00, 13:00,
   14:00, 15:00, 16:00, 17:00, 18:00 and 19:00.
   The appointment at 19:00 finishes around 20:00.
   Past and too-soon times on the same date are hidden (60-minute lead).
   These are request times, not confirmed availability.
3) Page now displays “Monday–Sunday · 09:00–19:00” beside the booking.
4) HTML references scripts/styles with a versioned URL to help avoid stale files
   when you upload to Vercel.
5) Same EDZ Barber branding, mobile layout adjustments, photos, pricing and
   existing Web3Forms access key remain.

DEPLOYMENT
Extract this ZIP directly to the ROOT of the site project (index.html at root);
then deploy the new build to Vercel. Replace ALL files, not just index.html.
After deployment, test booking for a future date (Monday and Sunday) and
check the time selector includes 09:00 through 19:00.
Test cookie banner using an incognito/private tab for the first-time visitor;
after rejecting or accepting, it is normal that it does not pop up again
until the visitor opens Cookie settings.
Submit a test booking and confirm the email actually arrives from Web3Forms.

EDZ BARBER — LIGHT CREAM & SOFT BROWN WEBSITE
================================================
Version: 21 November 2026 — updated booking times

WHAT YOU GET
- index.html — website homepage
- style.css — design for mobile + desktop
- booking.js — form validation, date/time, Web3Forms, confirmation message
- schedule.js — working times, off-days and blocked slots
- consent.js — inherited Google Ads + Meta Pixel consent controls
- privacy.html — privacy notice
- assets/ — your original logo recoloured brown, and THREE actual haircut photos
- favicon.svg, robots.txt, sitemap.xml

HOW TO DEPLOY TO VERCEL
1. Back up your current site files first.
2. Extract the ZIP. Upload these files into the root of your static website project.
3. Deploy with your existing Vercel workflow (site should be served from index.html).
4. Open edzbarber.co.uk on your phone, check layout, and test with an actual
   booking request using your own details. Confirm that the email arrives.
5. Check Google Ads / Meta events after agreeing to optional tracking.

YOUR WEB3FORMS INTEGRATION
- The access key is the same one used in your previous EDZ Barber site.
- Requests are POSTed directly to https://api.web3forms.com/submit.
- A successful response means the request was sent, NOT that the booking is confirmed.
- Your customer sees: your booking request was sent; wait for a personal reply.
- You still confirm each booking personally by WhatsApp Business or email.
- No automatic payment, automatic customer confirmation email, or live
  diary availability is claimed here.
- The access key is meant to be in public client-side HTML as Web3Forms documents.

BOOKING TIMES — EVERY DAY 09:00–19:00
Open schedule.js to manage the request schedule. Every day (Mon–Sun) offers
09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00 and 19:00.
Each booking request is for a one-hour appointment; 19:00 is the LAST START TIME
and a haircut at 19:00 would finish at approximately 20:00.
The site hides today's past/too-soon times (minimum 60 minutes ahead) and allows
requests up to 90 days in advance.
Use closedDates for any dates you cannot work; use blockedTimes for taken slots.
These are request times, NOT live availability. You must confirm each request
manually through WhatsApp or email, especially if you are at your other job.

EDITING THE SITE
- Prices: index.html service options and visible service cards;
  ALSO update the prices in booking.js services if you change them.
- Colours: first lines of style.css (e.g. --paper, --sand, --cocoa).
- Branding: assets/edz-logo-brown.webp.
- Contact: currently edzbarber.bookings@gmail.com and @edzbarber.
- Privacy: review privacy.html and tailor to your actual practices.

EVENT TRACKING & PRIVACY
- consent.js retains the previous Meta Pixel and Google Ads configuration.
- Meta Lead and Google Ads conversion fire only after a successful Web3Forms
  response, and only after the visitor accepts optional tracking.
- Contact details are NOT included in ad-conversion events.
- No tracking tags are loaded before optional consent.

LIMITATIONS
- The site is static; available slots are NOT synchronized with any diary.
- A local/simulated form test is NOT proof of live email delivery.
- The Web3Forms service must be active and the access key must remain valid.
- Use HTTPS (Vercel provides it) for production.
