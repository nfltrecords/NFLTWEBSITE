import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { releases } from "@/lib/catalogue";
import { releasePriceCents } from "@/lib/commerce";
import { shopEnv } from "@/lib/shop-db.server";
export const createManualPayPalOrder = createServerFn({method:"POST"}).inputValidator((input:unknown)=>z.object({upc:z.string().regex(/^\d{12,14}$/),email:z.string().trim().email().max(255)}).strict().parse(input)).handler(async({data})=>{
 const release=releases.find(item=>item.upc===data.upc); const cents=releasePriceCents(data.upc);
 if(!release||cents===null)return {ok:false as const};
 const id=crypto.randomUUID();
 await shopEnv.DB.prepare("INSERT INTO shop_orders (id, release_upc, buyer_email, amount_cents, currency, status) VALUES (?, ?, ?, ?, 'EUR', 'pending')").bind(id,data.upc,data.email,cents).run();
 const amount=(cents/100).toFixed(2);
 const params=new URLSearchParams({cmd:"_xclick",business:"Encoresarbakane@gmail.com",item_name:`NFLT RECORDS — ${release.title}`,item_number:data.upc,amount,currency_code:"EUR",custom:id,invoice:id,notify_url:"https://nflt-records.com/api/paypal/ipn",return:`https://nflt-records.com/commande/confirmation?order=${id}`,cancel_return:`https://nflt-records.com/commande/paiement?order=${id}&cancel=1`,no_shipping:"1",charset:"utf-8"});
 return {ok:true as const,paymentUrl:`https://www.paypal.com/cgi-bin/webscr?${params.toString()}`};
});
