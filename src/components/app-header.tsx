import type { ComponentType, ReactNode } from "react"
import { LogOut } from "lucide-react"
import { NavLink } from "react-router"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/** A screen: a file in src/pages, listed in App.tsx. `hidden` keeps a detail page out of the navigation. */
export type Screen = {
  path: string
  label: string
  icon: ComponentType<{ className?: string }>
  element: ReactNode
  hidden?: boolean
}

/** The page's width and side padding, shared by the header's row and the content so their edges line up. */
export const PAGE = "mx-auto w-full max-w-7xl px-4 sm:px-6"

/**
 * Header and navigation: one line on a laptop, icons on a tablet, a bottom bar on a phone; at its
 * end, Sign in, then the account menu. `signIn={false}` for a site nobody signs in to.
 * Restyle it to fit the app; keep the structure.
 */
export function AppHeader({
  name,
  logo,
  screens,
  me,
  signIn = true,
}: {
  name: string
  /** `<img src="/icon.svg" alt="" className="size-7" />` */
  logo?: ReactNode
  screens: Screen[]
  me: Tiny.User | null
  signIn?: boolean
}) {
  const nav = screens.filter((screen) => !screen.hidden)
  const many = nav.length > 1

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className={cn(PAGE, "flex h-14 items-center gap-4")}>
          <NavLink to="/" className="flex shrink-0 items-center gap-2 text-base font-medium">
            {logo}
            <span>{name}</span>
          </NavLink>

          {many && (
            <TooltipProvider delayDuration={300}>
              <nav aria-label="Screens" className="hidden min-w-0 items-center gap-1 sm:flex">
                {nav.map(({ path, label, icon: Icon }) => (
                  <Tooltip key={path}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={path}
                        end={path === "/"}
                        aria-label={label}
                        className={cn(
                          "flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors duration-200",
                          "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          "aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="hidden lg:inline">{label}</span>
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={6} className="lg:hidden">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </nav>
            </TooltipProvider>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <ThemeToggle className="shrink-0" />
            {me ? (
              <AccountMenu me={me} />
            ) : (
              signIn && (
                <Button size="sm" className="shrink-0" onClick={() => tiny.login()}>
                  Sign in
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      {/* `data-bottom-nav` sets --nav-h (index.css): the page pads its bottom by it. */}
      {many && (
        <nav
          aria-label="Screens"
          data-bottom-nav
          className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background pb-[env(safe-area-inset-bottom)] sm:hidden"
        >
          {nav.slice(0, 5).map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className="group flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-xs text-muted-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground"
            >
              <span className="flex h-7 w-14 items-center justify-center rounded-full transition-colors duration-200 group-aria-[current=page]:bg-muted">
                <Icon className="size-5" />
              </span>
              <span className="max-w-full truncate px-1">{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  )
}

/** Who is signed in, and Sign out. */
function AccountMenu({ me }: { me: Tiny.User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account"
        className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium uppercase outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring max-sm:size-11"
      >
        {me.email.charAt(0)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="mb-1 truncate border-b pb-2 text-muted-foreground">{me.email}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => void tiny.logout()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
