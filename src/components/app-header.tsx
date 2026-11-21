import type { ComponentType, ReactNode } from "react"
import { useState } from "react"
import { NavLink } from "react-router"
import { LogOut, Moon, Sun, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTheme, setTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

export type Screen = {
  path: string
  label: string
  icon: ComponentType<{ className?: string }>
  element: ReactNode
  hidden?: boolean
}
export const PAGE = "mx-auto w-full max-w-[1560px] px-4 sm:px-6 2xl:px-8"

function CompactTheme() {
  const [mode, setMode] = useState(getTheme)
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  return <Button size="icon" variant="ghost" aria-label={dark ? "切换浅色主题" : "切换深色主题"} className="rounded-xl" onClick={() => {const next = dark ? "light" : "dark"; setTheme(next);setMode(next)}}>
    {dark ? <Sun className="size-[18px]"/> : <Moon className="size-[18px]"/>}
  </Button>
}

export function AppHeader({ name, logo, screens, me }: {
  name: string
  logo?: ReactNode
  screens: Screen[]
  me: Tiny.User | null
}) {
  const nav = screens.filter(s => !s.hidden)
  const [accountOpen,setAccountOpen]=useState(false)
  return <>
    <header data-app-header className="sticky top-0 z-40 border-b border-border/65 bg-card/96 backdrop-blur-lg shadow-[0_2px_14px_-12px_rgba(19,78,79,0.22)]">
      <div className={cn(PAGE,"flex h-[62px] items-center gap-3 sm:h-[70px]")}>
        <NavLink to="/" className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label="返回 AIGZT 工作台">
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-primary/10 ring-1 ring-primary/10">{logo || <Menu className="size-5 text-primary"/>}</span>
          <span className="min-w-0 leading-tight">
            <span className="block text-[18px] font-black tracking-[.025em]">aigzt<span className="text-primary">.</span></span>
            <span className="block text-[9px] font-semibold tracking-[.19em] text-muted-foreground">AI WORKSPACE</span>
          </span>
        </NavLink>
        <nav aria-label="主导航" className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map(({path,label,icon:Icon})=><NavLink key={path} to={path} end={path==="/"}
            className={({isActive})=>cn("flex h-10 items-center gap-2 rounded-xl px-4 text-[13px] font-medium transition-colors",isActive?"bg-primary/12 text-primary":"text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <Icon className="size-[16px]"/>{label}
          </NavLink>)}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/7 px-3 py-1.5 text-[11px] font-medium text-primary sm:flex">
            <span className="size-1.5 rounded-full bg-primary"/>平台 AI 可用
          </span>
          <CompactTheme/>
          {me?<div className="relative">
            <Button size="icon" variant="secondary" aria-label="账户菜单" aria-expanded={accountOpen} onClick={()=>setAccountOpen(v=>!v)} className="size-9 rounded-full border border-border/70 font-bold uppercase">
              {me.email.slice(0,1)}
            </Button>
            {accountOpen&&<><button aria-label="关闭账户菜单" className="fixed inset-0 z-40 cursor-default" onClick={()=>setAccountOpen(false)}/><div className="absolute right-0 top-12 z-50 w-64 rounded-xl border bg-card p-2 shadow-xl">
              <p className="truncate border-b px-3 py-2 text-xs text-muted-foreground">{me.email}</p>
              <Button variant="ghost" className="mt-1 w-full justify-start" onClick={()=>{setAccountOpen(false);void tiny.logout()}}><LogOut className="size-4"/>退出登录</Button>
            </div></>}
          </div>:<Button size="sm" onClick={()=>tiny.login()}>登录工作台</Button>}
        </div>
      </div>
    </header>
    <nav data-bottom-nav aria-label="手机底部导航" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/80 bg-card/97 px-2 pt-1.5 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_-22px_rgba(9,65,62,0.23)] backdrop-blur-xl lg:hidden">
      {nav.slice(0,5).map(({path,label,icon:Icon})=><NavLink key={path} to={path} end={path==="/"}
        className={({isActive})=>cn("flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 pb-2 pt-1.5 text-[10px] font-medium transition-colors",isActive?"text-primary":"text-muted-foreground")}>
        {({isActive})=><><span className={cn("grid h-7 w-12 place-items-center rounded-xl",isActive?"bg-primary/13":"")}><Icon className="size-[19px]"/></span><span className="truncate">{label}</span></>}
      </NavLink>)}
    </nav>
  </>
}
