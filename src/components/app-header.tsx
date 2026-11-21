import type {ComponentType,ReactNode} from "react"
import {useState} from "react"
import {Link,NavLink,useLocation} from "react-router"
import {ArrowLeft,LogOut,Moon,Sun} from "lucide-react"
import {getTheme,setTheme} from "@/lib/theme"

export type Screen={path:string;label:string;icon:ComponentType<{className?:string}>;element:ReactNode;hidden?:boolean}
export const PAGE="mx-auto w-full max-w-[1050px] px-4 sm:px-6"
export function AppHeader({screens,me}:{name:string;logo?:ReactNode;screens:Screen[];me:Tiny.User|null}){
 const location=useLocation()
 const [theme,setLocalTheme]=useState(getTheme)
 const [account,setAccount]=useState(false)
 const title=screens.find(x=>x.path===location.pathname)?.label??"工作台"
 return <header data-app-header className="sticky top-0 z-40 border-b border-border/60 bg-background">
  <div className="mx-auto flex h-[56px] max-w-[1050px] items-center gap-2 px-3 sm:px-6">
   <Link to="/" aria-label="返回对话" className="grid size-10 shrink-0 place-items-center rounded-xl hover:bg-muted"><ArrowLeft className="size-5"/></Link>
   <span className="truncate text-base font-semibold">{title}</span>
   <nav aria-label="功能导航" className="ml-4 hidden items-center gap-1 sm:flex">{screens.filter(x=>x.path!=="/").map(s=><NavLink key={s.path} to={s.path} className={({isActive})=>"rounded-lg px-3 py-2 text-xs "+(isActive?"bg-muted text-foreground":"text-muted-foreground hover:bg-muted")}>{s.label}</NavLink>)}</nav>
   <div className="ml-auto flex items-center gap-1">
    <button type="button" aria-label="切换深浅色" className="grid size-9 place-items-center rounded-xl hover:bg-muted" onClick={()=>{const v=theme==="dark"?"light":"dark";setTheme(v);setLocalTheme(v)}}>{theme==="dark"?<Sun className="size-[18px]"/>:<Moon className="size-[18px]"/>}</button>
    {me?<div className="relative"><button type="button" aria-label="账户菜单" className="grid size-9 place-items-center rounded-full bg-muted text-xs font-bold" onClick={()=>setAccount(x=>!x)}>{me.email.slice(0,1).toUpperCase()}</button>{account&&<div className="absolute right-0 top-11 z-50 w-56 rounded-xl border bg-card p-2 shadow-lg"><p className="truncate px-2 py-2 text-xs text-muted-foreground">{me.email}</p><button type="button" className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs hover:bg-muted" onClick={()=>void tiny.logout()}><LogOut className="size-4"/>退出登录</button></div>}</div>:<button type="button" onClick={()=>tiny.login()} className="rounded-lg px-3 py-2 text-xs hover:bg-muted">登录</button>}
   </div>
  </div>
 </header>
}
