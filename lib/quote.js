const crypto = require('crypto');
const { priceFor, SERVICES } = require('./promo');
const CLOCK_ZONE = 'Europe/London';

function getSecret() {
  const value = process.env.EDZ_PROMO_SIGNING_SECRET || '';
  // Require an independent high-entropy signing key. No public-key or hardcoded fallback.
  return value.length >= 32 ? value : null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
}
function ukParts() {
  return Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: CLOCK_ZONE, year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hourCycle:'h23'
  }).formatToParts(new Date()).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
}
function validBookingDateTime(date,time) {
  if (typeof date !== 'string' || typeof time !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^(09|1[0-9]):00$/.test(time)) return false;
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.valueOf()) || d.toISOString().slice(0,10) !== date) return false;
  const now=ukParts(); const today=`${now.year}-${now.month}-${now.day}`;
  const max=new Date(`${today}T12:00:00Z`); max.setUTCDate(max.getUTCDate()+90);
  if (date<today || date>max.toISOString().slice(0,10)) return false;
  if (date===today && Number(time.slice(0,2))*60 < Number(now.hour)*60+Number(now.minute)+60) return false;
  return true;
}
function signQuote(data) {
  const secret=getSecret();
  if (!secret) return null;
  const encoded=Buffer.from(JSON.stringify(data),'utf8').toString('base64url');
  const sig=crypto.createHmac('sha256',secret).update(encoded).digest('base64url');
  return encoded+'.'+sig;
}
function verifyQuote(token) {
  const secret=getSecret();
  if (!secret || typeof token!=='string' || token.length>2000 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) return null;
  const [encoded,provided]=token.split('.');
  const expected=crypto.createHmac('sha256',secret).update(encoded).digest();
  const received=Buffer.from(provided,'base64url');
  if (received.length!==expected.length || !crypto.timingSafeEqual(expected,received)) return null;
  try {
    const data=JSON.parse(Buffer.from(encoded,'base64url').toString('utf8'));
    const issued=Number(data.issuedAt);
    // Retain verifiability for six months; it does not mean booking is confirmed.
    if (!Number.isFinite(issued) || issued>Date.now()+60000 || issued<Date.now()-180*86400000) return null;
    if (data.v!==1 || !SERVICES[data.service] || data.promoCode!=='EDZ5' ||
        data.regularPrice!==20 || data.total!==15 || data.discount!==5 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !/^(09|1[0-9]):00$/.test(data.time)) return null;
    return data;
  } catch { return null; }
}
function customerHash(name,email,phone) {
  return crypto.createHash('sha256').update([
    String(name).trim().toLowerCase().replace(/\s+/g,' '),
    String(email).trim().toLowerCase(),
    String(phone).trim().replace(/\s+/g,'')
  ].join('|')).digest('hex');
}
module.exports={getSecret,parseBody,validBookingDateTime,signQuote,verifyQuote,customerHash};
