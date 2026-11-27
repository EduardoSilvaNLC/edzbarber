const { priceFor, SERVICES } = require('../lib/promo');
const { getSecret,parseBody,validBookingDateTime,signQuote,customerHash }=require('../lib/quote');
module.exports=async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST') return res.status(405).json({success:false,message:'Method not allowed.'});
  const d=parseBody(req);
  const service=String(d.service||''); const code=String(d.promo_code||'').trim().slice(0,30);
  const date=String(d.date||''); const time=String(d.time||'');
  const name=String(d.name||'').trim().slice(0,100);
  const phone=String(d.phone||'').trim().slice(0,25);
  const email=String(d.email||'').trim().slice(0,254);
  if(!SERVICES[service] || !validBookingDateTime(date,time)) return res.status(400).json({success:false,message:'Please select a valid date and time.'});
  if(!code) return res.status(400).json({success:false,message:'No promo code was supplied.'});
  if(name.length<2 || phone.length<6 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({success:false,message:'Please enter valid contact details.'});
  if(d.request_acknowledged!=='Yes') return res.status(400).json({success:false,message:'Please accept the booking request notice.'});
  const price=priceFor(service,code);
  if(!price || !price.valid || price.discount!==5 || price.total!==15) return res.status(400).json({success:false,message:'Your promo code is inactive or invalid. Please remove it to book at the regular price.'});
  if(!getSecret()) return res.status(503).json({success:false,message:'The promotion is temporarily unavailable. Please try again or book without the code.'});
  const data={v:1,service,date,time,regularPrice:price.regularPrice,total:price.total,discount:price.discount,promoCode:price.promoCode,contactHash:customerHash(name,email,phone),issuedAt:Date.now()};
  const token=signQuote(data);
  if (!token) return res.status(503).json({success:false,message:'Promotion temporarily unavailable.'});
  // Relative URL; browser converts to the public https://edzbarber.co.uk link.
  return res.status(200).json({success:true,total:price.total,regularPrice:price.regularPrice,discount:price.discount,promoCode:price.promoCode,verificationPath:'/api/verify?token='+encodeURIComponent(token)});
};
