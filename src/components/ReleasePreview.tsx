import { releasePreviews } from "@/lib/previews";

type ReleasePreviewProps = {
  upc: string;
  locale?: "fr" | "en";
  compact?: boolean;
  hideTitle?: boolean;
};

export function ReleasePreview({
  upc,
  locale = "fr",
  compact = false,
  hideTitle = false,
}: ReleasePreviewProps) {
  const sources = releasePreviews[upc] ?? [];
  return (
    <section
      className={compact ? "shop-preview-list" : "mt-8"}
      aria-label={locale === "fr" ? "Extraits audio" : "Audio previews"}
    >
      {!hideTitle ? (
        <h2 className={compact ? "mb-2 text-sm font-medium" : "mb-3 text-lg font-medium"}>
          {locale === "fr" ? "Extraits audio" : "Audio previews"}
        </h2>
      ) : null}
      {sources.length > 0 ? (
        <div className={compact ? "space-y-2" : "space-y-3"}>
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
