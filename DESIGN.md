# AIGZT Free aggregation website V22
Public-facing product: visitor uses one AI site; source-provider keys are owner-managed, never user-supplied. Default chat engine FREE: a backend function first tries OpenRouter explicitly free-only openrouter/free, then Tiniest Cloud platform AI fallback (finite, metered against app allocation). No paid route.
Groq and Cerebras are detectable connection candidates but disabled for public free auto-routing until public use terms and account plan have been verified.
Per-user Tiniest Cloud private mode remains: chat and project data do not become public. Server creates per-user quota reservations (12/day, 2/min), protected by public/tiny.rules.json. This is not a global cross-user cap; upstream providers enforce org-wide 429.
Pool page shows real connected source status on explicit verification and the user's site request count, never theoretical 10.1B token inventory.
Backend public/_functions/free_router.js is a true Tiniest Cloud function; draft backends may not run until publication. Current app access remains restricted and new version is DRAFT; do not claim production validation.

## V23 User-owned authorization
User BYOK is truly independent of the owner's seven Tiniest connections. Each key is kept in module memory for this page session; optional encrypted private persistence via per-key PBKDF2(240000)-AES-GCM and user's own >=12 char passphrase; no plaintext saved in tiny.db/URLs/chat. Direct browser fetch HTTPS/CORS to fixed provider allowlist, errors without claiming a call succeeded. Chat, model discovery and media all use this key path, never the app-owner key. OpenRouter genuine OAuth PKCE authorization endpoint, short-lived verifier only in sessionStorage, verified state and code exchange callback; returned API key is in memory. ChatGPT account login cannot substitute for OpenAI API authorization, likewise Grok etc. The website's default free pool remains a distinct server function and does not need user keys. CORS limits for some services must be reported instead of pretending connectivity. User login and app publication remain unchanged.

## V25 个人图像视频
Grok / GPT 图片、Grok 视频通过 Cloudflare 无存储 BYOK 中转；用户显式同意可能收费才请求媒体端点。模型从本人授权 API 实时读取；视频通过任务编号手动查询。无后台轮询、不存个人密钥在媒体任务记录中。站点免费池仍默认用于聊天，个人付费媒体不会自动触发。

## Function name diagnosis
A valid minimal healthcheck function is detected in V26, but `free_router` is absent from the Tiniest Cloud function list. Source no longer includes a filename with an underscore; rename to `public/_functions/freerouter.js`, and change all tiny.call references accordingly. This is ready for next platform build; not runtime-verified due the platform's 30 builds/day limit.
