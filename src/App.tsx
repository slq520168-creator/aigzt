import { MessageSquare, Boxes, FolderKanban, Settings2, LoaderCircle } from "lucide-react"
import { BrowserRouter, Route, Routes } from "react-router"
import { AppHeader, PAGE, type Screen } from "@/components/app-header"
import { useMe } from "@/lib/tiny"
import Home from "@/pages/home"
import Directory from "@/pages/directory"
import Projects from "@/pages/projects"
import Settings from "@/pages/settings"

const screens: Screen[] = [
  {path:"/",label:"工作台",icon:MessageSquare,element:<Home/>},
  {path:"/directory",label:"AI 模型",icon:Boxes,element:<Directory/>},
  {path:"/projects",label:"项目",icon:FolderKanban,element:<Projects/>},
  {path:"/settings",label:"设置",icon:Settings2,element:<Settings/>},
]
export default function App() {
  const me = useMe()
  if(me===undefined)return <main className="flex min-h-svh items-center justify-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin"/>正在打开工作台</main>
  return <BrowserRouter><div data-app-shell className="flex min-h-svh flex-col"><AppHeader name="aigzt" logo={<img src="/icon.svg" alt="" width="32" height="32" className="size-8"/>} screens={screens} me={me}/><main data-app-main className={PAGE+" w-full flex-1 pb-[calc(var(--nav-h)+1.5rem)] pt-4 sm:pt-6"}><Routes>{screens.map(s=><Route key={s.path} path={s.path} element={s.element}/>)}</Routes></main></div></BrowserRouter>
}
