# Victoria & Dorian Wedding Invitation: Technical Design

Status: Approved for implementation

Last updated: 21 July 2026

## 1. Summary

Build a static, responsive wedding invitation in Astro 7 with React 19 islands and Tailwind CSS 4, deployed to Cloudflare Pages. The Canva site is the visual and content reference, not an implementation to embed or copy directly. Approved photographs and artwork will be downloaded, catalogued, optimized, and served locally.

The experience opens with an interactive envelope. Opening it reveals a vertically scrolling invitation composed of cinematic photo scenes and readable content sections. Motion will provide the envelope choreography and the few scroll-linked transitions that need JavaScript. Astro and CSS will render the rest without hydrating the full page.

Reference material:

- Canva preview: <https://testdump.my.canva.site/kopia-av-the-wedding-of-victoria-dorian-e-invite>
- Envelope reference: <https://github.com/Holymaiden/wedding-app/blob/main/src/components/letter-animation.tsx>
- Motion scroll animation documentation: <https://motion.dev/docs/react-scroll-animations>

## 2. Goals

- Reproduce the visual identity, content, photography, and overall composition of the approved Canva invitation.
- Improve on Canva's mobile behavior with semantic layouts rather than scaled absolute-positioned canvases.
- Add an envelope-opening entrance and restrained movement between visual scenes.
- Preserve normal scrolling, keyboard navigation, readable text, and reduced-motion support.
- Ship a fast static site that works without a server-side runtime.
- Keep content and animation configuration maintainable after launch.

## 3. Non-goals

- Pixel-for-pixel reproduction of Canva's generated HTML and CSS.
- Embedding the Canva runtime or hotlinking Canva assets in production.
- A single-page React application or client-side router.
- An RSVP backend; the existing Google Form remains the RSVP destination.
- WebGL, Three.js, autoplay audio, or forced smooth scrolling in the first release.
- A CMS, user accounts, or guest database.

## 4. Source Design Analysis

### 4.1 Published structure

The Canva publication contains 12 visible sections, sourced from 17 design records. Five alternate or reference records are hidden.

| Order | Section                    | Approximate desktop behavior   |
| ----- | -------------------------- | ------------------------------ |
| 1     | Invitation hero            | Full viewport                  |
| 2     | The Beginning              | Long-form, about 2.3 viewports |
| 3     | Ceremony and Reception     | Full viewport                  |
| 4     | Parking and Directions     | Full viewport                  |
| 5     | Dress Code                 | Full viewport                  |
| 6     | Garden Formal              | Full viewport                  |
| 7     | Special Roles              | Long-form, about 1.9 viewports |
| 8     | RSVP                       | About 1.3 viewports            |
| 9     | Gifts                      | About 1.3 viewports            |
| 10    | Frequently Asked Questions | Long-form, about 1.4 viewports |
| 11    | Closing message            | Full viewport                  |
| 12    | Finding Your Way           | Full viewport                  |

Strict full-page snapping is therefore unsuitable for the entire site. It would clip or trap long content, particularly on mobile. The implementation will use full-height scenes where appropriate and natural document flow everywhere else.

### 4.2 Visual language

- Dark, warm, editorial photography with cream text and champagne-gold accents.
- Large script headings with glow or soft shadow treatments.
- Playfair Display-style italic serif body copy.
- Geometric sans-serif labels and dates.
- Oversized cropped backgrounds plus transparent subject cutouts that create depth.
- Primary colors: warm ivory `#fbf7f1`, gold `#f4c067`, pale champagne `#fffae3`, deep berry `#b30221`, terracotta `#c64d2e`, midnight navy `#1f244c`, and dusty blue `#455b97`.

These values should become Tailwind theme tokens rather than repeated arbitrary values.

### 4.3 Content decisions

- Use `#TheBrightestMix`, matching the published closing section.
- Keep the existing accommodations FAQ wording for the first release. Do not add an empty or coming-soon accommodations section.
- Keep `Finding Your Way` as the final section, separate from `Parking and Directions`.
- Use context-dependent venue wording: "Narra Hill, Batangas" in concise display contexts and the full Narra Hill Tagaytay address in venue and directions content.
- The current RSVP form and deadline are final: <https://forms.gle/Gvq1CeDJdfzyDSZ57>, 31 July 2026 at 11:59 PM.
- The owner has confirmed that the Canva photographs, cutouts, map, and decorative elements are approved for reuse on this site. Preserve provenance and prefer supplied originals if they become available.
- All wedding-party names were approved on 21 July 2026. Standardize the family surname as `Maliuanag`, including Joel Maliuanag, and use `Carisse Betina Tabora` with one `t` in Betina. Keep Vector Julius Maliuanag, Oral Binda, Odette Llige, Luis Solarzano, and Gianluk Santos exactly as approved.

## 5. Proposed Experience

### 5.1 Entry sequence

1. The initial HTML displays an invitation cover immediately; visitors are never left with a blank screen while React loads.
2. The envelope React island hydrates with `client:load` and enhances the cover.
3. Selecting the envelope opens the flap, breaks or fades the seal, lifts the card, and transitions into the hero over approximately 1.8 to 2.4 seconds.
4. Focus moves to the invitation heading after the transition. The action is a real `<button>` and works with keyboard input.
5. If reduced motion is requested, the cover crossfades directly to the hero in no more than 200 ms.

The opened state lasts for the current tab in `sessionStorage`, with a visible "View invitation cover" control to replay it. This avoids replaying a long entrance after an accidental refresh while retaining access to the artwork.

The approved visual direction is cream paper, warm-gold detailing, and a deep berry or terracotta seal. It should use invitation typography and custom decorative artwork rather than emoji.

### 5.2 Scrolling and scene transitions

The approved invitation experience is one vertical document with hybrid scrolling. A scene is not necessarily equivalent to one Canva section.

- Short photographic sections use `min-height: 100svh` and optional `scroll-snap-align: start`.
- Long text sections use natural height and no snap requirement.
- If snap is enabled, the container uses `scroll-snap-type: y proximity`, never `mandatory`.
- Background images can crossfade or reveal with a vertical or diagonal `clip-path` as the next scene enters.
- Foreground cutouts may move 2 to 5 percent faster than backgrounds to create shallow parallax.
- Headings rise and resolve from soft blur; body text uses a shorter opacity/translate reveal.
- Decorative movement stops once offscreen and never blocks scrolling.
- Each major motion pattern appears more than once, producing a coherent system instead of unrelated effects on every section.

Suggested motion families:

| Family    | Use                   | Treatment                                   |
| --------- | --------------------- | ------------------------------------------- |
| Paper     | Envelope and RSVP     | Fold, lift, shadow, subtle rotation         |
| Light     | Hero, story, closing  | Warm glow, blur-to-sharp, gentle fade       |
| Wipe      | Photo-to-photo scenes | `clip-path` reveal aligned with composition |
| Depth     | Cutout collages       | Restrained scroll-linked parallax           |
| Editorial | Rosters and FAQ       | Staggered groups with no parallax           |

### 5.3 Mobile behavior

- Content reflows into one column rather than scaling a 1366 px canvas.
- `100svh` is used for cover and short scenes to account for mobile browser chrome.
- Critical text remains in normal flow; no paragraph is placed inside a fixed-height absolute layer.
- Foreground cutouts can be hidden or simplified when they obscure content.
- Decorative parallax is disabled on coarse pointers and reduced-motion devices.
- The RSVP target is a large semantic link with a minimum 44 px touch area.

## 6. Technical Architecture

### 6.1 Rendering model

- Astro renders the layout, metadata, content, pictures, and all section markup at build time.
- React is limited to interactive islands: initially `EnvelopeIntro.tsx`; optionally an FAQ accordion if approved.
- A small client script initializes section reveals and scroll-linked effects after page load.
- The page remains complete and readable if JavaScript fails. The no-JavaScript cover links directly to `#invitation`.
- No Cloudflare Worker or Pages Function is needed for version one.

### 6.2 Animation stack

Use the `motion` package for both APIs:

- `motion/react` for the envelope React island.
- Motion's DOM/scroll APIs for Astro section effects where CSS alone is insufficient.
- CSS transitions, `IntersectionObserver`, and utility classes for simple one-time reveals.

Do not add GSAP or Lenis initially. Motion covers the required component, scroll-triggered, and scroll-linked behavior while avoiding two animation runtimes. Native scrolling is more predictable for accessibility, anchor links, browser search, and mobile performance. Reconsider GSAP only if the approved prototype requires a complex pinned multi-scene timeline that Motion cannot express cleanly.

### 6.3 Envelope reference adaptation

The referenced component is MIT licensed and is suitable as inspiration, but it should not be pasted unchanged.

Required adaptation:

- Remove Next.js `useSearchParams` and `react-i18next` dependencies.
- Remove guest personalization and render one shared invitation greeting.
- Replace emoji hearts, seal, sparkles, pointer, and spinner with artwork matching this invitation.
- Replace fixed dimensions with fluid `clamp()` sizing.
- Use deterministic particle coordinates instead of `Math.random()` during render to avoid hydration instability.
- Cancel transition timers on unmount and guard against repeated activation.
- Call completion from Motion's animation completion event rather than a loosely coupled timeout.
- Remove the loading overlay; the invitation is already present in static HTML.
- Add button semantics, focus states, focus transfer, reduced-motion handling, and screen-reader status text.
- Preserve the upstream MIT copyright and license notice if substantial code is reused.

### 6.4 Proposed project structure

```text
public/
  fonts/
  images/
    invitation/
      hero/
      story/
      venue/
      attire/
      party/
      rsvp/
      closing/
      directions/
src/
  components/
    invitation/
      EnvelopeIntro.tsx
      Hero.astro
      Story.astro
      Venue.astro
      Directions.astro
      DressCode.astro
      GardenFormal.astro
      WeddingParty.astro
      Rsvp.astro
      Gifts.astro
      Faq.astro
      Closing.astro
      Scene.astro
  content/
    invitation.ts
  layouts/
    Layout.astro
  pages/
    index.astro
  scripts/
    scene-motion.ts
  styles/
    global.css
```

`invitation.ts` should hold structured text, lists, dates, links, and image metadata. Components own presentation. This gives spelling and content review one predictable location without introducing a CMS.

## 7. Assets and Fonts

### 7.1 Acquisition workflow

1. Create an asset manifest containing source Canva URL, Canva media identifier, intended section, dimensions, file hash, rights status, and local output path.
2. Prefer originals supplied by the couple or photographer when available.
3. The owner has approved reuse of the captured Canva derivatives; record that approval and the original Canva URL in the manifest.
4. Preserve source files outside the generated output directories.
5. Store approved originals in `src/assets/invitation/` and import them through typed metadata.
6. Use Astro's `<Image>` and `<Picture>` components to generate responsive AVIF/WebP derivatives at build time after each layout's actual display width is known.
7. Visually compare generated focal crops against the Canva desktop and mobile views.
8. Commit source assets, not generated derivatives.

Production must not depend on Canva's hashed URLs. They are currently public but can disappear if the Canva site is republished or removed. Owner approval for this project is recorded, but public availability and absence of a watermark do not independently establish reuse rights.

### 7.2 Image delivery

- Prefer Astro's image pipeline and imported source assets when it can generate static derivatives at build time.
- Use `<Picture>`/`<Image>` with explicit dimensions to prevent layout shift.
- Preload only the envelope and hero-critical image.
- Lazy-load below-the-fold images.
- Set meaningful alt text for informative photographs; mark duplicate cutouts and visual overlays as decorative.
- Keep the initial mobile transfer conservative, targeting no more than about 500 KB before interaction where source quality allows.

### 7.3 Font plan

- Serif: Playfair Display variable, preserving the original Canva serif for body copy and editorial details.
- Sans-serif: Urbanist variable as the approved open-source alternative to Garet.
- Script: Pinyon Script 400 as the approved open-source alternative to Snell Roundhand.
- Self-host WOFF2 files through Fontsource packages; all selected families use the SIL Open Font License 1.1.
- Use `font-display: swap` and fallback metrics to limit layout shift.

## 8. Content Model

The content module should export typed data rather than embed all copy inside components.

```ts
interface InvitationImage {
  src: ImageMetadata;
  alt: string;
  focalPoint?: `${number}% ${number}%`;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface WeddingPartyGroup {
  role: string;
  names: string[];
}
```

The wedding date should be represented once as an ISO timestamp with an explicit Philippine time-zone offset where calculations are needed. Display strings can remain editorially controlled. The approved RSVP URL is <https://forms.gle/Gvq1CeDJdfzyDSZ57>, and the final displayed deadline is 31 July 2026 at 11:59 PM.

Guest-name personalization is not required. Do not parse or render a `?to=` parameter.

## 9. Accessibility and Motion Safety

- Meet WCAG 2.2 AA for text contrast, focus visibility, semantics, and input targets.
- Use one `<h1>`, logical `<h2>` section headings, lists for wedding-party names, and a real anchor for RSVP.
- Make the envelope operable by keyboard and expose one clear action name.
- Never require animation completion to access content.
- Honor `prefers-reduced-motion` in both CSS and Motion. Disable parallax, particles, looping decoration, and large clip-path wipes when reduction is requested.
- Pause or omit continuous animation when the page is hidden or its section is offscreen.
- Do not hijack the mouse wheel or touch scrolling.
- Verify zoom at 200 percent and text reflow at a 320 CSS-pixel viewport.
- Use `lang="en-PH"` rather than the Canva export's incorrect `sv-SE`.

## 10. Performance Budget

Targets on a representative mid-range mobile device and production Cloudflare URL:

| Metric                 | Target                                       |
| ---------------------- | -------------------------------------------- |
| Lighthouse Performance | 90 or higher                                 |
| LCP                    | 2.5 seconds or less at the 75th percentile   |
| CLS                    | 0.1 or less                                  |
| INP                    | 200 ms or less                               |
| Initial JavaScript     | 100 KB gzip or less, excluding browser cache |
| Initial image transfer | Approximately 500 KB or less where feasible  |

Implementation rules:

- Animate `transform`, `opacity`, and carefully bounded `clip-path`; avoid layout properties.
- Limit simultaneous blurred layers, large drop shadows, and promoted compositor layers.
- Do not preload below-the-fold photographs.
- Hydrate only islands that require state.
- Test animation on mobile hardware, not only a desktop browser.

## 11. Metadata, Privacy, and Deployment

- Replace the starter title and favicons.
- Add canonical URL, description, Open Graph/Twitter metadata, and an approved social image.
- Add `noindex, nofollow` robots directives and an equivalent `robots.txt` policy because this personal invitation should not appear in search results. This is a privacy preference, not access control; anyone with the URL can still view the static site.
- Add structured `Event` data only after all date, location, and attendance details are final.
- Do not expose private guest data in static files or query-string analytics.
- Do not add analytics, tracking scripts, or cookies.
- Build with `pnpm build` and deploy `dist/` using the existing Cloudflare Pages configuration.
- Continue using `https://victoria-dorian-wedding.pages.dev` as the canonical site until a custom domain is supplied.
- Add cache headers for immutable hashed assets and sensible security headers through Cloudflare Pages configuration if needed.
- Preserve a fully static output; no secrets are required for the RSVP link.

## 12. Verification Strategy

### 12.1 Automated checks

- `pnpm lint`
- `pnpm format:check`
- `pnpm astro check`
- `pnpm build`
- Unit/component tests for envelope state changes and reduced-motion behavior if a test runner is introduced.
- Browser tests for envelope keyboard activation, replay/skip, anchor navigation, and RSVP destination.

### 12.2 Visual and manual checks

- Compare every section against approved Canva references at 1440, 1024, 768, 390, and 320 CSS px widths.
- Test current Chrome, Safari, Firefox, and mobile Safari.
- Check slow 4G loading, disabled JavaScript, keyboard-only use, reduced motion, 200 percent zoom, and high-contrast/forced-color behavior.
- Run Lighthouse on the deployed Cloudflare Pages URL.
- Check all names, dates, venue details, FAQ answers, map labels, and outbound links with the owners.

## 13. Implementation Plan and Model Allocation

### 13.1 Model tiers

- **Tier H: GPT-5.6/high reasoning.** Use for ambiguous visual decomposition, architecture, complex animation state, cross-browser debugging, performance diagnosis, and final integrated review.
- **Tier M: capable coding model.** Use for bounded component implementation, responsive Tailwind work from an approved reference, content modeling, tests, and routine fixes.
- **Tier L: fast/weaker model or scripted task.** Use for deterministic downloads, file inventories, mechanical conversion, metadata entry, formatting, and running known commands.

Model tier is based on ambiguity and reasoning risk, not token volume. Asset processing may consume substantial computer time while requiring little model intelligence.

### 13.2 Task matrix

| ID  | Task                                                    | Depends on | Model        | Computer | Deliverable / acceptance                                         |
| --- | ------------------------------------------------------- | ---------- | ------------ | -------- | ---------------------------------------------------------------- |
| A1  | Extract Canva media manifest and map assets to sections | None       | H            | Medium   | Reviewed manifest with no unidentified visible asset             |
| A2  | Record approval and collect originals when available    | A1         | Human + L    | Low      | Provenance recorded for every deployed asset                     |
| A3  | Download approved source assets with hashes             | A2         | L/script     | Medium   | Reproducible local source set                                    |
| A4  | Configure Astro responsive images and inspect output    | A3, F2     | M            | **High** | Generated derivatives meet visual and transfer-size targets      |
| F1  | Define color, type, spacing, and effect tokens          | None       | M            | Low      | Tailwind/CSS tokens match approved visual system                 |
| F2  | Build semantic content model and static Astro sections  | A1         | M            | Medium   | Complete readable page without JavaScript                        |
| F3  | Recreate responsive editorial compositions              | A4, F1, F2 | H            | Medium   | Visual approval at target breakpoints                            |
| M1  | Prototype envelope geometry and states                  | A4, F1     | H            | Medium   | Approved open/skip/replay prototype                              |
| M2  | Integrate accessible envelope React island              | M1, F2     | M            | Low      | Keyboard, focus, session, and no-JS behavior pass                |
| M3  | Prototype one photo scene transition                    | F3         | H            | Medium   | Approved wipe/parallax pattern on desktop and mobile             |
| M4  | Apply approved motion families to remaining scenes      | M3         | M            | Medium   | Consistent motion with no scroll trapping                        |
| M5  | Implement reduced-motion and offscreen controls         | M2, M4     | M            | Low      | Motion safety checks pass                                        |
| Q1  | Cross-browser responsive visual QA                      | F3, M5     | M            | **High** | Screenshot matrix reviewed; defects logged/fixed                 |
| Q2  | Performance profiling and animation tuning              | M5, A4     | H            | **High** | Budgets and Core Web Vitals targets met or exceptions documented |
| Q3  | Accessibility, privacy, and content audit               | M5         | H            | Medium   | WCAG, no-index, and content requirements signed off              |
| R1  | Metadata, final domain, headers, and production build   | Q1, Q2, Q3 | M            | Low      | Production-ready `dist/` and valid metadata                      |
| R2  | Deploy and smoke-test Cloudflare Pages                  | R1         | L + M review | Medium   | Public URL passes navigation, assets, and RSVP checks            |

### 13.3 Parallelization

The asset track (A1-A4) and foundation tasks F1-F2 can begin in parallel. M1 can start once envelope artwork and tokens exist. F3 needs optimized representative assets, while content-only section implementation does not. Q1, Q2, and Q3 can run in parallel after feature completion, but each finding must be resolved before R1.

High-computer tasks are A4, Q1, and Q2:

- A4 performs repeated Astro builds, image encoding, and quality comparison.
- Q1 renders a browser and captures many viewport/browser combinations.
- Q2 requires production builds, browser traces, and repeated measurements.

These should run on agents with browser/tool access and generous execution time. They do not all require the strongest reasoning model; reserve GPT-5.6 for interpreting visual/performance results and deciding tradeoffs.

## 14. Risks and Mitigations

| Risk                                     | Impact                                | Mitigation                                                         |
| ---------------------------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| Canva URL or media disappears            | Missing source reference              | Download approved assets early and store locally                   |
| Asset approval lacks durable provenance  | Future reuse uncertainty              | Record owner approval, source URLs, and replacement originals      |
| Full-screen behavior clips long content  | Unusable mobile experience            | Hybrid scenes, natural flow, proximity-only snap                   |
| Excess motion causes discomfort          | Accessibility failure                 | Reduced-motion mode and restrained motion budget                   |
| Large photography slows LCP              | Poor mobile experience                | Responsive formats, focal crops, preload only critical art         |
| Whole-page hydration grows JavaScript    | Slow interaction                      | Astro-first rendering and narrow React islands                     |
| Script font changes alter composition    | Visual mismatch/layout shift          | Resolve licenses early and approve fallbacks before polish         |
| Canva copy contains errors               | Incorrect invitation details          | Central content model plus owner content sign-off                  |
| Animation timing diverges across devices | Broken reveal or inaccessible content | Completion callbacks, no hard dependency on timers, real-device QA |

## 15. Acceptance Criteria

The first production release is complete when:

- All approved Canva content and assets are represented with confirmed rights.
- The envelope works with pointer, keyboard, reduced motion, refresh, skip, and replay paths.
- The invitation is complete and readable without JavaScript.
- Short scenes feel cinematic without trapping scroll; long sections remain naturally readable.
- Desktop and mobile layouts have owner visual approval.
- RSVP opens the approved form and all invitation details are signed off.
- Search engines are instructed not to index or follow the invitation, and no analytics or cookies are present.
- Lint, formatting, Astro type checks, and production build pass.
- Accessibility, cross-browser, and production performance checks meet the documented targets or have explicitly accepted exceptions.
- The static site is deployed and smoke-tested on the final Cloudflare Pages domain.

## 16. Decision Record

Approved on 21 July 2026:

| Decision              | Approved direction                                                               |
| --------------------- | -------------------------------------------------------------------------------- |
| Scrolling             | Hybrid: cinematic full-height scenes plus natural long-form sections             |
| Closing hashtag       | `#TheBrightestMix`                                                               |
| Accommodations        | Keep the existing FAQ wording; add no placeholder section                        |
| Directions            | Keep `Finding Your Way` at the end                                               |
| Venue text            | Short wording in display contexts; full address in detailed contexts             |
| Canva media           | Approved for reuse on this site                                                  |
| Fonts                 | Pinyon Script, Playfair Display, and Urbanist; self-hosted under OFL 1.1         |
| Envelope              | Match invitation palette; remember opened state per browser tab and allow replay |
| Guest personalization | None                                                                             |
| RSVP                  | Current Google Form and 31 July 2026 at 11:59 PM deadline are final              |
| Search privacy        | `noindex, nofollow`                                                              |
| Analytics             | None                                                                             |
| Domain                | Use the existing Cloudflare Pages domain for now                                 |
| Wedding-party names   | Approved; standardize `Maliuanag` and use `Carisse Betina Tabora`                |

Remaining owner input:

1. Approve the final social-sharing image when the visual implementation is ready.
2. Supply a custom domain later if desired.
