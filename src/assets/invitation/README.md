# Production Invitation Assets

These are owner-approved source assets promoted from `reference/canva/media/` on 21 July 2026. Semantic filenames are used by `src/content/invitation-assets.ts`; the original Canva identifiers and provenance remain in `reference/canva/manifest.json`.

## Image Pipeline

- Keep source images in this directory at their captured resolution.
- Render raster images through Astro's `<Image>` or `<Picture>` components.
- Use `layout="full-width"` for full-bleed scenes and `layout="constrained"` for content images.
- Prefer `<Picture formats={["avif", "webp"]}>` for photographic and transparent raster assets.
- Let Astro generate width variants after the component's actual layout width is known.
- Set `position` from `invitation-assets.ts` as the initial focal point and refine it during responsive visual QA.
- Do not render `hero/names-date.png` as the primary heading. It is retained for visual comparison; names and dates must remain semantic text.
- Import `dress-code/gradient.svg` directly as an Astro SVG component if it remains necessary after recreating the effect in CSS.

Do not place generated AVIF/WebP derivatives in source control. Astro emits optimized, hashed files during `astro build`.
