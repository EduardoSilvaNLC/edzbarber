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
