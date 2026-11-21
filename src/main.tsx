import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { NotOnTiniestCloud } from "@/lib/tiny"
import { startTheme } from "@/lib/theme"

// Light, dark or the device's setting, as the person chose (src/lib/theme.ts); the colours
// themselves live in index.css.
startTheme()

// `tiny` exists only where Tiniest Cloud serves the app. Anywhere else — `npm run dev` included —
// say so, rather than let every screen fail on its first call.
const onPlatform = typeof window.tiny !== "undefined"
if (onPlatform && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js")

createRoot(document.getElementById("root")!).render(
  <StrictMode>{onPlatform ? <App /> : <NotOnTiniestCloud />}</StrictMode>
)
