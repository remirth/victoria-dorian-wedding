# Envelope Animation Reference

Upstream repository: <https://github.com/Holymaiden/wedding-app>  
Source file: <https://github.com/Holymaiden/wedding-app/blob/main/src/components/letter-animation.tsx>  
Captured: 21 July 2026

## Files

- `letter-animation.tsx`: upstream React/Next.js component.
- `package.upstream.json`: upstream dependency versions at capture time.
- `LICENSE.upstream`: upstream MIT license.

The source is reference-only and is not imported by this Astro application. If substantial portions are reused, retain the required MIT copyright and permission notice.

Before adapting it, review `DESIGN.md` section 6.3. The source depends on Next.js routing and `react-i18next`, uses nondeterministic render-time particles, fixed envelope sizing, timer-coupled completion, emoji decoration, and an unnecessary loading overlay. The production component should use Motion's completion events, accessible button/focus behavior, deterministic decoration, responsive dimensions, and reduced-motion handling.
