// EDZ Barber promo settings — server only. Change here to enable/disable.
// EDZ5: £20 haircut becomes £15. Active until manually disabled; no expiry by default.
const OFFER = Object.freeze({ code: 'EDZ5', active: true, discount: 5, expiresOn: null, service: 'haircut' });
const SERVICES = Object.freeze({
  haircut: { name: "Men's Haircut", price: 20 },
  beard: { name: 'Beard Trim', price: 7 },
  both: { name: 'Haircut + Beard', price: 27 }
});
function priceFor(service, suppliedCode = '') {
  const item = SERVICES[service];
  if (!item) return null;
  const code = typeof suppliedCode === 'string' ? suppliedCode.trim().toUpperCase() : '';
  const valid = Boolean(code && code === OFFER.code && OFFER.active && service === OFFER.service && (!OFFER.expiresOn || new Date().toISOString().slice(0,10) <= OFFER.expiresOn));
  return { serviceName: item.name, regularPrice: item.price, total: item.price - (valid ? OFFER.discount : 0), discount: valid ? OFFER.discount : 0, promoCode: valid ? code : '', valid: code ? valid : true };
}
module.exports = { OFFER, SERVICES, priceFor };
