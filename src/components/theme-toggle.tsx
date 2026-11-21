import { useEffect, useState } from "react"
import { Monitor, Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getTheme, setTheme, type Theme } from "@/lib/theme"

const CHOICES: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "Match device", Icon: Monitor },
]

/** Light, dark or the device's setting. Restyle it to fit the app. */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setCurrent] = useState<Theme>(getTheme)

  useEffect(() => {
    const sync = () => setCurrent(getTheme())
    window.addEventListener("themechange", sync)
    return () => window.removeEventListener("themechange", sync)
  }, [])

  return (
    <TooltipProvider delayDuration={300}>
      <div
        role="radiogroup"
        aria-label="Theme"
        className={cn("inline-flex items-center gap-0.5 rounded-full border bg-muted/50 p-0.5", className)}
      >
        {CHOICES.map(({ value, label, Icon }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <button
                type="button"
                role="radio"
                aria-checked={theme === value}
                aria-label={label}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200",
                  "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  theme === value && "bg-background text-foreground shadow-sm"
                )}
              >
                <Icon className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
