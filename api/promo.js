const { priceFor, SERVICES } = require('../lib/promo');
const { getSecret, parseBody } = require('../lib/quote');
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method!=='POST') return res.status(405).json({valid:false,message:'Method not allowed.'});
  const data=parseBody(req);
  const service=String(data.service || '');
  const code=String(data.code || '').trim().slice(0,30);
  if (!SERVICES[service] || !code) return res.status(200).json({valid:false,message:'Choose a service and enter a code.'});
  const p=priceFor(service,code);
  if (!p || !p.valid || !p.discount) return res.status(200).json({valid:false,message:service==='haircut'?'Invalid or inactive promo code.':'This code applies to Men’s Haircut only.'});
  if (!getSecret()) return res.status(503).json({valid:false,message:'Promotion temporarily unavailable. You can still book at the regular price.'});
  return res.status(200).json({valid:true,code:p.promoCode,discount:p.discount,regularPrice:p.regularPrice,total:p.total,serviceName:p.serviceName});
};
