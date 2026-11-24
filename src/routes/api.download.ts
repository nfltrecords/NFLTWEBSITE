import { createFileRoute } from "@tanstack/react-router";
import { servePaidOrderDownload } from "@/lib/delivery.server";
export const Route=createFileRoute("/api/download")({server:{handlers:{GET:async({request})=>{try{return await servePaidOrderDownload(request);}catch{return new Response("Téléchargement indisponible",{status:503});}}}}});
