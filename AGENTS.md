<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public bilingual metadata and reciprocal language paths in `src/lib/seo.ts`; use leaf-route heads to avoid duplicate canonical links.
- Public FR/EN pages share locale-aware editorial page components; English contact links to the unchanged French form to keep contact logic isolated.
- Model the label group as Organization sub-organizations and the artist as Person; Spotify artist sameAs links belong only to the artist schema to prevent brand ambiguity.
- Static public/sitemap.xml and absolute canonicals use SITE_URL in src/lib/seo.ts (public Lovable URL); regenerate the sitemap from publicPages + releases when routes change, never with preview hosts or generated lastmod.

- Store confirmed releases and verbatim attributed biographies in browser-safe content modules; supplied dates never become schema datePublished and unknown formats/artwork/listening links stay absent.
- Identify catalogue details with UPC path parameters and shared release metadata; stable identifiers preserve exact titles and bilingual language switches.
- Keep owner-confirmed app and city facts in a browser-safe content module; a shared app block must disable download when no validated store URL exists, avoiding invented links across locales.
- Add localized official Google Play badge imagery in the shared ApplicationBlock, reusing its validated store URL so home and application destinations stay consistent.
- Define versioned, uniquely named NFLT favicon links in the root head and brand default icon paths too; published hosting changes only after an authorized publish.
- Keep radio stream configuration in a browser-safe module and playback in a shared locale-aware HTML5 player; absent or insecure URLs disable playback and never trigger audio requests.
- Shop and licensing share locale-aware commerce pages and a strict browser/server inquiry schema; reuse catalogue UPCs and artwork rather than creating parallel product data.
- Resolve individual release prices through one evidenced UPC track-count map and shared ReleasePrice display; missing counts return no price across shop, catalogue and details.
- Commerce inquiries are insert-only in a separate table and submitted through a dedicated server function; preserve existing contact/message logic and do not imply email delivery from storage success.
- Keep intended seller settings in `.lovable/commerce-config.json`, imported only by tests until checkout is approved; this prevents incomplete legal details from entering public pages or browser bundles.
- Keep unapproved legal drafts in `.lovable/legal/`; load the owner-authorized full legal reading copy only through a DEV-gated dynamic import in the preview. Production routes retain notices, noindex and sitemap exclusion; noindex is not access control and preview approval is not publication approval.
- Version raw legal-copy import queries when private Markdown changes; hidden-directory edits may leave Vite's preview module cache stale, so verify rendered text rather than source alone.
- Keep screenshot-verified artwork pointers separate from preserved legacy pointers and record binary dimensions/hash/evidence privately; partial track screenshots and filenames never establish total counts or UPC associations.
