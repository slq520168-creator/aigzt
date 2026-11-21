# AIGZT Free aggregation website V22
Public-facing product: visitor uses one AI site; source-provider keys are owner-managed, never user-supplied. Default chat engine FREE: a backend function first tries OpenRouter explicitly free-only openrouter/free, then Tiniest Cloud platform AI fallback (finite, metered against app allocation). No paid route.
Groq and Cerebras are detectable connection candidates but disabled for public free auto-routing until public use terms and account plan have been verified.
Per-user Tiniest Cloud private mode remains: chat and project data do not become public. Server creates per-user quota reservations (12/day, 2/min), protected by public/tiny.rules.json. This is not a global cross-user cap; upstream providers enforce org-wide 429.
Pool page shows real connected source status on explicit verification and the user's site request count, never theoretical 10.1B token inventory.
Backend public/_functions/free_router.js is a true Tiniest Cloud function; draft backends may not run until publication. Current app access remains restricted and new version is DRAFT; do not claim production validation.
