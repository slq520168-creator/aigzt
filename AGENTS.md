# This app runs on Tiniest Cloud

React, TypeScript, Vite, Tailwind CSS and shadcn/ui, deployed to Tiniest Cloud as a static build.

- Sign-in, data, files and AI come from the global `tiny` (the `<script src="/sdk.js">` tag in
  index.html; types in src/tiny.d.ts; React hooks in src/lib/tiny.tsx). Do not use localStorage,
  write a login flow, or add a server of your own. The Tiniest Cloud guide has the whole SDK.
- Server logic — anything the person using the app must not be able to change, like a price or a
  booking — is a backend function: `public/_functions/<name>.ts` exporting
  `default async (input, tiny: Tiny.Server) => value`, called from the page with
  `await tiny.call("<name>", input)`. The build copies it into `dist/_functions/`; it runs on
  Tiniest Cloud and is never served.
- `npm run dev` shows a notice: `tiny` only exists on Tiniest Cloud. To see the app, run
  `npm run build` and deploy this folder with `dist` inside (no node_modules or .env files).
- Run `npm run build` before every deploy, a small change included, and deploy only once it
  passes: it type-checks all of `src`, and a build that fails here fails on Tiniest Cloud.
- Where files go, so every project reads the same way in Tiniest Cloud's Code tab:
  - `src/pages/` — one file per screen (`home.tsx`, `orders.tsx`), routed in App.tsx with React
    Router. Keep Vite's default `base`. A first deploy with screens elsewhere is refused.
  - `src/components/` — pieces the screens share; `src/components/ui/` for shadcn components.
    Anything drawn more than once is a component here with typed props (a product card, a row,
    a stat tile, a page heading), never markup copied between screens.
  - `src/hooks/` — the app's own `useSomething` hooks. The SDK's hooks stay in src/lib/tiny.tsx.
  - `src/lib/` — plain code: helpers, formatting, types (`types.ts`), calculations.
  - `public/` — files served as they are (images, icons), plus `_functions/`, `tiny.rules.json`
    and `tiny.brand.json`.
  - `public/icon.svg` — the app's logo, drawn once: square, on its own background colour. The
    header shows it (`AppHeader logo={<img src="/icon.svg" alt="" className="size-8" />}`) and
    Tiniest Cloud makes it the icon (tab, phone, sign-in page). Never a second logo in code.
  - A file past about 300 lines is doing too much: move its parts into components and hooks.
- Components: build every screen from them. Here already: `Button`, `Input`, `Card`, `Tooltip`,
  `DropdownMenu` (src/components/ui); `AppHeader`, `SearchField`, `FilterChips`, `ThemeToggle` (src/components).
  No bare `<button>`, `<input>` or `<select>` in a screen.
- Anything else (badge, tabs, dialog, select, table, sheet, toast) comes from shadcn/ui, never
  hand-written: `npx shadcn@latest add <name>`, or the file as shadcn publishes it, in
  src/components/ui. shadcn first, the app's style on top.
- Styling: Tailwind classes on components, colours from theme tokens (`bg-background`).
  src/index.css holds the palette and fonts, no `.card` or `.hero` rules. No `[&_button]:`
  selectors or pixel values (`p-[11px_17px]`): each styled piece is its own component.
- Header: keep `AppHeader` and its `PAGE` container, which the content shares, so the logo and
  the last action line up with the page. Give it the app's name and logo; restyle, don't rewrite.
- Sign in and out: every app has its own sign-in page. `AppHeader` ends with Sign in, then the
  account menu (who, and Sign out). Keep it wherever people sign in; never a sign-in screen of
  your own. Only a site nobody signs in to passes `signIn={false}`.
- Theme: switch only with `setTheme` (src/lib/theme.ts), which crossfades the page. Never
  toggle the `dark` class yourself.
- Design: before the first screen, read the tiny-design skill — `.agents/skills/tiny-design/`
  (the same files are in `.claude/skills/` for Claude Code): SKILL.md, then app.md. Where that
  folder is missing, `tiny_guide` with topic `app` returns the same. Write what you decide in
  DESIGN.md.
- Look: its own palette in src/index.css (`:root` and `.dark`), never the default grey. Lay each
  screen out for what it holds (a sidebar, cards, a table, a list beside its detail); a narrow
  centred column suits only one focused task. Keep light and dark both looking right.
- Their own components or brand (a folder, a style guide, another app) is the design: copy their
  components, colours, fonts and logo into this project, never link to their computer.
