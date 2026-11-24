import { getShopAsset,getShopOrder,shopEnv } from "@/lib/shop-db.server";
import { releases } from "@/lib/catalogue";
export async function servePaidOrderDownload(request:Request):Promise<Response>{
 const id=new URL(request.url).searchParams.get("order")??"";
 if(!/^[0-9a-f-]{36}$/i.test(id))return new Response("Commande invalide",{status:404});
 const order=await getShopOrder(id); if(!order||order.status!=="paid")return new Response("Paiement non confirmé",{status:403});
 const asset=await getShopAsset(order.release_upc); if(!asset)return new Response("Fichier indisponible",{status:503});
 const title=releases.find(r=>r.upc===order.release_upc)?.title??"NFLT-audio";
 const safeTitle=title.normalize("NFKD").replace(/[^A-Za-z0-9._-]+/g,"-");
 if(asset.asset_key.startsWith("r2:")){
  const object=await shopEnv.AUDIO_R2.get(asset.asset_key.slice(3));
  if(!object)return new Response("Fichier indisponible",{status:503});
  const extension=asset.file_name.toLowerCase().endsWith(".m4a")?".m4a":".wav";
  const type=extension===".m4a"?"audio/mp4":"audio/wav";
  return new Response(object.body,{headers:{"Content-Type":type,"Content-Disposition":`attachment; filename="${safeTitle}${extension}"`,"Content-Length":String(object.size),"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }
 let i=0,total=0;
 const stream=new ReadableStream<Uint8Array>({async pull(c){if(i>=asset.chunk_count){c.close();return;} const data=await shopEnv.AUDIO_KV.get(`${asset.asset_key}:${i}`,"arrayBuffer");if(!data){c.error(new Error("Missing audio chunk"));return;}const chunk=new Uint8Array(data);total+=chunk.byteLength;i++;c.enqueue(chunk);if(i===asset.chunk_count&&total!==asset.file_size)c.error(new Error("Invalid audio length"));}});
 const name=safeTitle+".wav";
 return new Response(stream,{headers:{"Content-Type":"audio/wav","Content-Disposition":`attachment; filename="${name}"`,"Content-Length":String(asset.file_size),"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}
