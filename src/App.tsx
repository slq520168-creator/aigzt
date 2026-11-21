import {MessageSquare,Boxes,FolderKanban,Settings2,LoaderCircle,Images} from "lucide-react"
import {lazy,Suspense} from "react"
import {BrowserRouter,Route,Routes,useLocation,Navigate} from "react-router"
import {AppHeader,PAGE,type Screen} from "@/components/app-header"
import {useMe} from "@/lib/tiny"
import Home from "@/pages/home"
const Directory=lazy(()=>import("@/pages/directory"))
const Projects=lazy(()=>import("@/pages/projects"))
const Settings=lazy(()=>import("@/pages/settings"))
const Create=lazy(()=>import("@/pages/create"))
const screens:Screen[]=[{path:"/",label:"对话",icon:MessageSquare,element:<Home/>},{path:"/directory",label:"AI 模型",icon:Boxes,element:<Directory/>},{path:"/create",label:"图片和视频",icon:Images,element:<Create/>},{path:"/projects",label:"项目",icon:FolderKanban,element:<Projects/>},{path:"/settings",label:"设置",icon:Settings2,element:<Settings/>}]
function Layout({me}:{me:Tiny.User|null}){
 const location=useLocation()
 if(location.pathname==="/")return <Home/>
 return <div data-app-shell className="flex min-h-svh flex-col"><AppHeader name="aigzt" logo={<img src="/icon.svg" alt="" width="32" height="32" className="size-8"/>} screens={screens} me={me}/><main data-app-main className={PAGE+" w-full flex-1 pb-[calc(var(--nav-h)+1.5rem)] pt-4 sm:pt-6"}><Suspense fallback={<div className="flex items-center gap-2 p-4 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin"/>正在打开…</div>}><Routes><Route path="/directory" element={<Directory/>}/><Route path="/create" element={<Create/>}/><Route path="/projects" element={<Projects/>}/><Route path="/settings" element={<Settings/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense></main></div>
}
export default function App(){const me=useMe();if(me===undefined)return <main className="flex min-h-svh items-center justify-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin"/>正在打开工作台</main>;return <BrowserRouter><Layout me={me}/></BrowserRouter>}
