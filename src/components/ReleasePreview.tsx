import { releasePreviews } from "@/lib/previews";

export function ReleasePreview({ upc, locale = "fr" }: { upc: string; locale?: "fr" | "en" }) {
  const src = releasePreviews[upc];
  return (
    <section className="mt-8" aria-labelledby="release-preview-title">
      <h2 id="release-preview-title" className="mb-3 text-lg font-medium">
        {locale === "fr" ? "Extrait audio" : "Audio preview"}
      </h2>
      {src ? (
        <audio
          controls
          preload="none"
          className="w-full"
          aria-label={
            locale === "fr"
              ? "Écouter un extrait de 30 secondes"
              : "Listen to a 30-second preview"
          }
        >
          <source src={src} type="audio/mpeg" />
        </audio>
      ) : (
        <p className="body-copy text-sm">
          {locale === "fr"
            ? "Préécoute en cours de vérification pour cette sortie."
            : "The preview for this release is still being verified."}
        </p>
      )}
    </section>
  );
}
