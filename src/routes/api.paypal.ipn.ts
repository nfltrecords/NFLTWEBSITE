import { createFileRoute } from "@tanstack/react-router";
import { getShopOrder,markShopOrderPaid } from "@/lib/shop-db.server";
async function processIpn(request:Request){
 const raw=await request.text();if(!raw||raw.length>64000)return new Response("Invalid payload",{status:400});
 const verify=await fetch("https://ipnpb.paypal.com/cgi-bin/webscr",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"cmd=_notify-validate&"+raw});
 if(!verify.ok)return new Response("PayPal unavailable",{status:503});if((await verify.text()).trim()!=="VERIFIED")return new Response("Invalid IPN",{status:400});
 const d=new URLSearchParams(raw),id=[d.get("custom"),d.get("invoice")].find(v=>!!v&&/^[0-9a-f-]{36}$/i.test(v))??"",txn=(d.get("txn_id")??"").trim(),receiver=(d.get("receiver_email")??d.get("business")??"").trim().toLowerCase(),amount=Number(d.get("mc_gross"));
 if(!id||!txn||receiver!=="encoresarbakane@gmail.com"||d.get("payment_status")!=="Completed"||d.get("mc_currency")!=="EUR"||!Number.isFinite(amount))return new Response("Payment rejected",{status:400});
 const order=await getShopOrder(id);if(!order)return new Response("Order not found",{status:503});if(Math.round(amount*100)!==order.amount_cents||order.currency!=="EUR")return new Response("Amount mismatch",{status:400});
 if(order.status==="paid"){if(order.paypal_transaction_id!==txn)return new Response("Transaction conflict",{status:409});}
 else if(order.status==="pending"){const changed=await markShopOrderPaid(id,txn);if(!changed){const latest=await getShopOrder(id);if(!latest||latest.status!=="paid"||latest.paypal_transaction_id!==txn)return new Response("Retry",{status:503});}}
 else return new Response("Order closed",{status:409});
 return new Response("OK",{headers:{"Cache-Control":"no-store"}});
}
export const Route=createFileRoute("/api/paypal/ipn")({server:{handlers:{POST:async({request})=>{try{return await processIpn(request);}catch(e){console.error("IPN failed",e);return new Response("Retry",{status:503});}}}}});
