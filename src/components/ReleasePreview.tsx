import { releasePreviews } from "@/lib/previews";

export function ReleasePreview({ upc, locale = "fr" }: { upc: string; locale?: "fr" | "en" }) {
  const sources = releasePreviews[upc] ?? [];
  return (
    <section className="mt-8" aria-labelledby="release-preview-title">
      <h2 id="release-preview-title" className="mb-3 text-lg font-medium">
        {locale === "fr" ? "Extraits audio" : "Audio previews"}
      </h2>
      {sources.length > 0 ? (
        <div className="space-y-3">
          {sources.map((src, index) => (
            <div key={src}>
              <p className="mb-2 text-sm text-muted-foreground">
                {locale === "fr" ? `Extrait ${index + 1}` : `Preview ${index + 1}`}
              </p>
              <audio
                controls
                preload="none"
                className="w-full"
                aria-label={
                  locale === "fr"
                    ? `Écouter l'extrait ${index + 1}`
                    : `Listen to preview ${index + 1}`
                }
              >
                <source src={src} type="audio/mpeg" />
              </audio>
            </div>
          ))}
        </div>
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
