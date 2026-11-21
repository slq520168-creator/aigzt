import { MessageSquare, Boxes, FolderKanban, Settings2 } from "lucide-react"
import { BrowserRouter, Route, Routes } from "react-router"
import { AppHeader, PAGE, type Screen } from "@/components/app-header"
import { useMe } from "@/lib/tiny"
import { cn } from "@/lib/utils"
import Home from "@/pages/home"
import Directory from "@/pages/directory"
import Projects from "@/pages/projects"
import Settings from "@/pages/settings"
const screens: Screen[] = [
 {path:"/",label:"AI 对话",icon:MessageSquare,element:<Home/>},
 {path:"/directory",label:"模型中心",icon:Boxes,element:<Directory/>},
 {path:"/projects",label:"项目记忆",icon:FolderKanban,element:<Projects/>},
 {path:"/settings",label:"设置",icon:Settings2,element:<Settings/>}
]
export default function App(){const me=useMe();if(me===undefined)return <main className="grid min-h-svh place-items-center text-sm text-muted-foreground">正在验证账户…</main>;return <BrowserRouter><div className="flex min-h-svh flex-col"><AppHeader name="AI 聚合工作台" logo={<img src="/icon.svg" alt="" className="size-8"/>} screens={screens} me={me}/><main className={cn(PAGE,"flex-1 pt-5 pb-[calc(var(--nav-h)+1.5rem)]")}><Routes>{screens.map(s=><Route key={s.path} path={s.path} element={s.element}/>)}</Routes></main></div></BrowserRouter>}
