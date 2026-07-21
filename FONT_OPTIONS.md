# Typography System

Status: Selected  
Reviewed: 21 July 2026

The selected system preserves the original Canva roles while replacing restricted Garet and Snell Roundhand files with close open-source alternatives. All three fonts use the SIL Open Font License 1.1 and are self-hosted through Fontsource packages.

## Selected: Pinyon Script + Playfair Display + Urbanist

| Role   | Font                     | Replaces / preserves      | Usage                                           |
| ------ | ------------------------ | ------------------------- | ----------------------------------------------- |
| Script | Pinyon Script 400        | Snell Roundhand           | Couple names and large section headings         |
| Serif  | Playfair Display 400–600 | Original Playfair Display | Body copy, venue details, and serif subheadings |
| Sans   | Urbanist 500–600         | Garet                     | Hero support text, dates, labels, and controls  |

Implementation:

- `@fontsource/pinyon-script`
- `@fontsource-variable/playfair-display`
- `@fontsource-variable/urbanist`
- Tailwind tokens: `font-script`, `font-serif`, and `font-sans`
- Pinyon Script is limited to large display text because of its delicate strokes.
- Playfair Display normal and italic variable files support the original editorial body treatment.
- Urbanist normal variable supports the required geometric labels without unnecessary italic assets.

## Considered Alternatives

## Option A: MonteCarlo + Newsreader + Outfit

**Recommended.** Romantic and editorial without looking like a generic wedding template.

| Role   | Font                    | Usage                                        |
| ------ | ----------------------- | -------------------------------------------- |
| Script | MonteCarlo 400          | Couple names and large section headings only |
| Serif  | Newsreader 400, 500–600 | Body copy, venue details, serif subheadings  |
| Sans   | Outfit 500–600          | Dates, labels, buttons, and compact metadata |

Strengths:

- MonteCarlo has restrained copperplate movement similar to Snell Roundhand.
- Newsreader preserves Playfair's editorial character while reading better in longer passages.
- Outfit closely matches Garet's clean geometric role.
- Newsreader and Outfit offer variable fonts; MonteCarlo is one static weight.

Tradeoffs:

- MonteCarlo must remain large because its fine strokes lose clarity at small sizes.
- Outfit feels contemporary, so it should be limited to supporting information.

Sources:

- MonteCarlo: <https://github.com/google/fonts/tree/main/ofl/montecarlo>
- Newsreader: <https://github.com/google/fonts/tree/main/ofl/newsreader>
- Outfit: <https://github.com/google/fonts/tree/main/ofl/outfit>

## Option B: Mea Culpa + Petrona + Manrope

The most distinctive and expressive option.

| Role   | Font                 | Usage                                  |
| ------ | -------------------- | -------------------------------------- |
| Script | Mea Culpa 400        | Hero names or one short statement only |
| Serif  | Petrona 400, 500–600 | Body copy and editorial headings       |
| Sans   | Manrope 500–600      | Labels, controls, RSVP, and metadata   |

Strengths:

- Mea Culpa creates a luxury-stationery feel with pronounced swashes.
- Petrona has sharper, more individual editorial details than Playfair Display.
- Manrope provides a disciplined geometric counterpoint.

Tradeoffs:

- Mea Culpa's capitals require testing with "Victoria & Dorian" and generous spacing.
- Petrona can feel busy in long centered paragraphs.
- Manrope is slightly more technical than the Canva sans-serif.

Sources:

- Mea Culpa: <https://github.com/google/fonts/tree/main/ofl/meaculpa>
- Petrona: <https://github.com/google/fonts/tree/main/ofl/petrona>
- Manrope: <https://github.com/google/fonts/tree/main/ofl/manrope>

## Option C: Corinthia + Bodoni Moda + Urbanist

The most fashion-editorial option.

| Role   | Font                     | Usage                                 |
| ------ | ------------------------ | ------------------------------------- |
| Script | Corinthia 700            | Names and primary script headings     |
| Serif  | Bodoni Moda 400, 500–600 | Large body text, dates, and headings  |
| Sans   | Urbanist 500–600         | Labels, controls, and compact details |

Strengths:

- Corinthia resembles formal engraved invitation lettering.
- Bodoni Moda creates the strongest couture/editorial mood.
- Urbanist adds warmth without competing with the display faces.

Tradeoffs:

- This pairing has the most delicate stroke contrast and is least forgiving on mobile.
- Bodoni Moda should not be used for small cream text over photography.
- Corinthia 700 is safer on screen than its very fine 400 weight.

Sources:

- Corinthia: <https://github.com/google/fonts/tree/main/ofl/corinthia>
- Bodoni Moda: <https://github.com/google/fonts/tree/main/ofl/bodonimoda>
- Urbanist: <https://github.com/google/fonts/tree/main/ofl/urbanist>

## Delivery Notes

1. Fontsource packages retain package-level OFL metadata and emit local WOFF2 files through Vite.
2. Preload the script face only if performance testing shows it benefits the initial envelope or hero viewport.
3. Apply fallback metric adjustments if visual QA finds meaningful layout shift.
4. Verify heading collisions at 320 px and body readability over every photographic background.
