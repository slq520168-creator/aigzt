/** Appearance uses a cookie and never stores app data in the browser. */
export type Theme = "light" | "dark" | "system"
const device = window.matchMedia("(prefers-color-scheme: dark)")
export function getTheme(): Theme {
 const match = document.cookie.match(/(?:^|; )theme=(light|dark)/)
 return match ? (match[1] as Theme) : "light"
}
function apply(theme: Theme) {
 const dark = theme === "dark" || (theme === "system" && device.matches)
 document.documentElement.classList.toggle("dark",dark)
 document.documentElement.style.colorScheme=dark?"dark":"light"
 document.querySelector('meta[name="theme-color"]')?.setAttribute("content",dark?"#21302e":"#f8fafc")
}
export function setTheme(theme: Theme) {
 document.cookie=theme==="system"?"theme=; path=/; max-age=0; samesite=lax":"theme="+theme+"; path=/; max-age=31536000; samesite=lax"
 const doc=document as Document & {startViewTransition?: (update:()=>void)=>unknown}
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof doc.startViewTransition!=="function")apply(theme)
 else doc.startViewTransition(()=>apply(theme))
 window.dispatchEvent(new Event("themechange"))
}
export function startTheme(){apply(getTheme());device.addEventListener("change",()=>{if(getTheme()==="system")apply("system")})}
