import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import type { Locale } from "@/lib/seo";

// Repository inventory only: exact track/release associations are not inferred from filenames.
const previewFiles = [
  "/assets/previews/30.000Genocides_PREVIEW_30S.mp3",
  "/assets/previews/AMORTTESCHIENS_PREVIEW_30S.mp3",
  "/assets/previews/Arreteoutoutpete_PREVIEW_30S.mp3",
  "/assets/previews/CA_TUE_PAS_DU_TOUT_PREVIEW_30S.mp3",
  "/assets/previews/Calamite_PREVIEW_30S.mp3",
  "/assets/previews/DCVOL2_PREVIEW_30S.mp3",
  "/assets/previews/DebrisFlaqueDechetsCancres_PREVIEW_30S.mp3",
  "/assets/previews/Dilemma_PREVIEW_30S.mp3",
  "/assets/previews/Dunckes2_PREVIEW_30S.mp3",
  "/assets/previews/Dunckes_PREVIEW_30S.mp3",
  "/assets/previews/ExtremementGrave_PREVIEW_30S.mp3",
  "/assets/previews/Flatulence_PREVIEW_30S.mp3",
  "/assets/previews/GR4LIFE_PREVIEW_30S.mp3",
  "/assets/previews/Hustlegrind_PREVIEW_30S.mp3",
  "/assets/previews/JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO3_PREVIEW_30S.mp3",
  "/assets/previews/JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO_PREVIEW_30S.mp3",
  "/assets/previews/Laplusgrosseenc_PREVIEW_30S.mp3",
  "/assets/previews/Laveritetenique_PREVIEW_30S.mp3",
  "/assets/previews/Lesuivi_PREVIEW_30S.mp3",
  "/assets/previews/MASTERPIECE_PREVIEW_30S.mp3",
  "/assets/previews/NEVERFAKELIKETHEM_PREVIEW_30S.mp3",
  "/assets/previews/NFLTHOT_PREVIEW_30S.mp3",
  "/assets/previews/NFLTINMYPARTYBEATNFLTRECORDS_PREVIEW_30S.mp3",
  "/assets/previews/NFLTO_PREVIEW_30S.mp3",
  "/assets/previews/NFLTTHEDOPIESTCOLLECTIONBEATNFLTRECORDS_PREVIEW_30S.mp3",
  "/assets/previews/NFLTTHELUXURYTHEHIGHESTUNEQUIVOCAL_PREVIEW_30S.mp3",
  "/assets/previews/NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS_PREVIEW_30S.mp3",
  "/assets/previews/NFLT_PREVIEW_30S.mp3",
  "/assets/previews/NINTENDO_PREVIEW_30S.mp3",
  "/assets/previews/Nousysommes_PREVIEW_30S.mp3",
  "/assets/previews/ONTELAFOUTUAUQ_PREVIEW_30S.mp3",
  "/assets/previews/PERSONNESEMARREICI_PREVIEW_30S.mp3",
  "/assets/previews/Ridewithme_PREVIEW_30S.mp3",
  "/assets/previews/Sasempirepourtoi_PREVIEW_30S.mp3",
  "/assets/previews/Tufouslamerdededingue_PREVIEW_30S.mp3",
  "/assets/previews/Yapasdecouilleici_PREVIEW_30S.mp3",
  "/assets/previews/medley_PREVIEW_30S.mp3"
] as const;

export function PreviewLibrary({ locale = "fr" }: { locale?: Locale }) {
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT / AUDIO PREVIEWS" title={locale === "fr" ? "Écouter les extraits" : "Listen to previews"} />
      <section className="editorial-section pt-0">
        <p className="body-copy mb-8">{locale === "fr" ? "Extraits audio disponibles à l’écoute. Les associations précises entre chaque fichier, titre et sortie restent à confirmer." : "Available audio previews. Exact file-to-track and release associations are still to be confirmed."}</p>
        <div className="space-y-6">
          {previewFiles.map((src) => {
            const filename = src.split("/").pop() ?? src;
            const title = filename.replace(/_PREVIEW_30S\\.mp3$/i, "").replaceAll("_", " ");
            return <article key={src} className="border-b border-border pb-5"><h2 className="font-display text-lg mb-3 break-words">{title}</h2><audio className="w-full" controls preload="none" src={src}>{locale === "fr" ? "Votre navigateur ne prend pas en charge la lecture audio." : "Your browser does not support audio playback."}</audio></article>;
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
