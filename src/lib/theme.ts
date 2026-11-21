/**
 * Light, dark or the device's, remembered in a cookie (a preference, not data, so not
 * localStorage). index.html reads it before anything draws, so a dark page never flashes.
 */
export type Theme = "light" | "dark" | "system"

const device = window.matchMedia("(prefers-color-scheme: dark)")

export function getTheme(): Theme {
  const match = document.cookie.match(/(?:^|; )theme=(light|dark)/)
  return match ? (match[1] as Theme) : "system"
}

function apply(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && device.matches)
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
}

/**
 * Switch the theme with a crossfade of the whole page (timed in index.css). Where the browser
 * has no view transitions, or the person asked for less motion, the theme just changes.
 */
export function setTheme(theme: Theme) {
  document.cookie =
    theme === "system"
      ? "theme=; path=/; max-age=0; samesite=lax"
      : `theme=${theme}; path=/; max-age=31536000; samesite=lax`
  const doc = document as Document & { startViewTransition?: (update: () => void) => unknown }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (still || typeof doc.startViewTransition !== "function") apply(theme)
  else doc.startViewTransition(() => apply(theme))
  window.dispatchEvent(new Event("themechange"))
}

/** Apply the saved choice now, and follow the device while the choice is "system". */
export function startTheme() {
  apply(getTheme())
  device.addEventListener("change", () => {
    if (getTheme() === "system") apply("system")
  })
}
