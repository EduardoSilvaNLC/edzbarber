EDZ BARBER – Meta Pixel + Google Ads booking conversion (6 Nov 2026)

Deploy all files together to the root of the website repository. Keep any existing booking/ folder and other assets already deployed.

WHAT CHANGED
- Meta Pixel 1076609655424186 is loaded by consent.js ONLY after optional advertising consent.
- The cookie banner and privacy page disclose BOTH Google Ads and Meta Pixel.
- Consent is re-requested because previous Google-only consent cannot authorize Meta.
- Meta PageView is a standard event sent after consent.
- Meta Lead is sent only after a successful Web3Forms booking request, via the existing booking.js callback.
- Existing Google Ads conversion ID and booking success logic are unchanged.
- Layout and £17 standard pricing were left untouched. The £10 offer for Nov 7 needs its own clear landing-page promotion/terms before running ads.

TEST
1. Deploy. Test in a fresh private browser. Before consent, neither Google nor Meta Pixel should send tracking.
2. Reject optional -> no ad tracking, booking must still work.
3. In another fresh private browser window, accept optional -> check PageView in Meta Events Manager Test Events.
4. Send ONE successful test booking -> confirm exactly one Meta Lead and Google Ads booking conversion.
5. Ensure failed submissions do not send a Lead. If Ads Manager cannot select this new dataset, check asset access/ownership.

NOTE: The Meta Pixel may still need domain/asset verification, and the campaign requires a budget/schedule fix. We did not publish any live changes.

UPDATE — 09:00–18:00 appointment requests
Time field is now a dropdown with 30-minute steps from 09:00 to 18:00 (inclusive). Requests remain manually confirmed, not automatically booked. Replace all files at your site root; leave other deployed assets in place. The final 18:00 option is a requested start time; remove it if 18:00 is strictly closing time.

UPDATE — 9 November 2026
Men-only haircuts are £10; beard trims remain £7 (combined total £17). Both mobile number and email are mandatory; confirmations are sent manually via WhatsApp Business message or email. No automatic WhatsApp sending was added. Visual design, booking hours, cookies and tracking scripts remain unchanged.


UPDATE — Booking policy and required agreement (9 November 2026)
- Added a visible booking policy immediately above the submission button.
- Customers must tick “I have read and agree to the booking policy” before the browser allows submission.
- The checkbox value (booking_policy_accepted=Yes) is included in the Web3Forms email.
- Rules apply equally to all customers and refer only to punctuality, confirmation and conduct.
- Prices, booking hours, design palette, cookie preferences, Google Ads/Meta tracking, and manual confirmation are unchanged.
- Upload all files together, replacing matching filenames at your website root.
- Test a request with the checkbox unticked (must be blocked), then tick and submit a single test request; confirm the email arrives. A browser-side checkbox cannot prevent deliberately forged submissions without server-side verification.
