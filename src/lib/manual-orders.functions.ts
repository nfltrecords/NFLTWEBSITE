import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { releases } from "@/lib/catalogue";
import { releasePriceCents } from "@/lib/commerce";
import { getShopAsset, shopEnv } from "@/lib/shop-db.server";

export const createManualPayPalOrder = createServerFn({method:"POST"}).inputValidator((input:unknown)=>z.object({upc:z.string().regex(/^\d{12,14}$/),email:z.string().trim().email().max(255)}).strict().parse(input)).handler(async({data})=>{
 const release=releases.find(item=>item.upc===data.upc); const cents=releasePriceCents(data.upc);
 if(!release||cents===null)return {ok:false as const};
 // Never send a customer to PayPal unless the master is already present in Cloudflare.
 const asset=await getShopAsset(data.upc);
 if(!asset || !asset.asset_key || !Number.isSafeInteger(asset.chunk_count) || asset.chunk_count<1 || !Number.isSafeInteger(asset.file_size) || asset.file_size<1)return {ok:false as const,reason:"audio_unavailable" as const};
 for(let i=0;i<asset.chunk_count;i++) if(!(await shopEnv.AUDIO_KV.head(`${asset.asset_key}:${i}`))) return {ok:false as const,reason:"audio_unavailable" as const};
 const id=crypto.randomUUID();
 await shopEnv.DB.prepare("INSERT INTO shop_orders (id, release_upc, buyer_email, amount_cents, currency, status) VALUES (?, ?, ?, ?, 'EUR', 'pending')").bind(id,data.upc,data.email,cents).run();
 const amount=(cents/100).toFixed(2);
 const params=new URLSearchParams({cmd:"_xclick",business:"Encoresarbakane@gmail.com",item_name:`NFLT RECORDS — ${release.title}`,item_number:data.upc,amount,currency_code:"EUR",custom:id,invoice:id,notify_url:"https://nflt-records.com/api/paypal/ipn",return:`https://nflt-records.com/commande/confirmation?order=${id}`,cancel_return:`https://nflt-records.com/commande/paiement?order=${id}&cancel=1`,no_shipping:"1",charset:"utf-8"});
 return {ok:true as const,paymentUrl:`https://www.paypal.com/cgi-bin/webscr?${params.toString()}`};
});
