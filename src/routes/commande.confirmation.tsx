import { createFileRoute } from "@tanstack/react-router";
import { useEffect,useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
export const Route=createFileRoute("/commande/confirmation")({validateSearch:(s:Record<string,unknown>)=>({order:typeof s.order==="string"?s.order:""}),component:Page});
function Page(){
 const {order}=Route.useSearch();
 const [status,setStatus]=useState("Vérification du paiement PayPal…");
 const [downloadUrl,setDownloadUrl]=useState("");
 const [paid,setPaid]=useState(false);
 useEffect(()=>{
  let active=true,t:ReturnType<typeof setTimeout>,n=0;
  const check=async()=>{
   try{
    const r=await fetch("/api/order-status?order="+encodeURIComponent(order),{cache:"no-store"});
    const d=await r.json();
    if(!active)return;
    if(d.paid){
     setPaid(true);
     if(typeof d.downloadUrl==="string"&&d.downloadUrl){setDownloadUrl(d.downloadUrl);setStatus("Paiement confirmé. Votre téléchargement est disponible.");}
     else setStatus("Paiement confirmé. Contactez NFLT RECORDS avec votre référence de commande pour obtenir votre fichier.");
     return;
    }
    setStatus("En attente de la confirmation PayPal…");
   }catch{setStatus("Vérification en cours…");}
   if(active&&n++<100)t=setTimeout(check,3000);
  };
  if(order)void check();else setStatus("Référence de commande manquante.");
  return()=>{active=false;clearTimeout(t);};
 },[order]);
 return <SiteLayout><section className="editorial-section min-h-[55vh]">
  <p className="eyebrow">NFLT RECORDS / COMMANDE</p><h1>Confirmation de commande</h1>
  <p className="body-copy mt-4">{status}</p>
  {downloadUrl&&<a className="editorial-action inline-flex mt-6 items-center justify-center rounded-md px-6 py-3" href={downloadUrl}>Télécharger mon master</a>}
  {paid&&!downloadUrl&&<p className="body-copy mt-4">Référence : {order}</p>}
 </section></SiteLayout>;
}
