const { verifyQuote } = require('../lib/quote');
const escapeHtml = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports=async function handler(req,res) {
  res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, private');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
  res.setHeader('Content-Type','text/html; charset=utf-8');
  const q=req.query || {};
  const token=typeof q.token==='string'?q.token:'';
  const data=verifyQuote(token);
  if(!data) return res.status(400).send(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Quote not verified | EDZ Barber</title><style>body{font:16px system-ui;background:#fffdfa;color:#322017;max-width:680px;margin:12vh auto;padding:25px}main{border:1px solid #e7ddd5;background:#f6f1ec;border-radius:16px;padding:28px}</style><main><h1>Quote could not be verified</h1><p>The link is invalid or has expired. Please check the booking details manually before confirming a discount.</p><p>EDZ Barber · Cambridge</p></main></html>`);
  const date=data.date.split('-').reverse().join('/');
  const issued=new Date(data.issuedAt).toLocaleString('en-GB',{timeZone:'Europe/London',hour12:false});
  res.status(200).send(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verified quote | EDZ Barber</title><style>body{font:16px/1.5 system-ui;background:#fffdfa;color:#322017;max-width:680px;margin:9vh auto;padding:25px}main{border:1px solid #e7ddd5;background:#f6f1ec;border-radius:16px;padding:28px}h1{margin-top:0}strong{color:#744329}dt{font-weight:700;margin-top:12px}dd{margin:0}small{color:#6e6158}</style><main><h1>EDZ Barber — Verified discount</h1><p>This price and appointment request were signed by the EDZ Barber server.</p><dl><dt>Service</dt><dd>Men’s Haircut</dd><dt>Date and time requested</dt><dd>${escapeHtml(date)} at ${escapeHtml(data.time)}</dd><dt>Original price</dt><dd>£20</dd><dt>Promotional code</dt><dd>EDZ5</dd><dt>Discount</dt><dd>£5</dd><dt>Final price</dt><dd><strong>£15</strong></dd><dt>Quote created (UK time)</dt><dd>${escapeHtml(issued)}</dd></dl><p><small>Verification confirms the quoted service, date, time and price — not the customer’s identity or that the booking has been accepted. Confirm every appointment manually.</small></p></main></html>`);
};
