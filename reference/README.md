# Design Reference Snapshot

Snapshot date: 21 July 2026

This directory preserves external material used to analyze and recreate the invitation. It is intentionally outside `public/` and `src/`; Astro must not deploy these files directly.

## Contents

- `canva/`: published Canva HTML, linked CSS, and media used by the 12 visible sections.
- `envelope/`: the referenced open-source envelope component, its package metadata, and its upstream MIT license.
- `checksums.sha256`: integrity hashes for the snapshot.

See the README in each source directory for provenance and usage restrictions. Use `DESIGN.md` for the proposed production architecture.

## Important

This snapshot is implementation reference material, not a production asset library. The owner confirmed on 21 July 2026 that the captured Canva photographs, cutouts, map, and decorative elements are approved for this site. Record provenance when promoting them into `src/` or `public/`. Font binaries were not approved or captured; use separately licensed fonts.

To verify the snapshot from this directory:

```sh
sha256sum --check checksums.sha256
```
