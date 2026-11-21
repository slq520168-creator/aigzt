import { useEffect,useState } from "react"
import { CheckCircle2, Download, Share2, Smartphone, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
type InstallPrompt=Event & {prompt():Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>}
const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)
const isInstalled=()=>window.matchMedia("(display-mode: standalone)").matches||Boolean((navigator as Navigator&{standalone?:boolean}).standalone)
export function PwaInstall(){
 const [installed,setInstalled]=useState(isInstalled)
 const [available,setAvailable]=useState<InstallPrompt|null>(null)
 const [online,setOnline]=useState(navigator.onLine)
 const [notice,setNotice]=useState("")
 useEffect(()=>{
  const offer=(e:Event)=>{e.preventDefault();setAvailable(e as InstallPrompt)}
  const installed=()=>{setInstalled(true);setAvailable(null)}
  const update=()=>setOnline(navigator.onLine)
  window.addEventListener("beforeinstallprompt",offer);window.addEventListener("appinstalled",installed);window.addEventListener("online",update);window.addEventListener("offline",update)
  return ()=>{window.removeEventListener("beforeinstallprompt",offer);window.removeEventListener("appinstalled",installed);window.removeEventListener("online",update);window.removeEventListener("offline",update)}
 },[])
 async function install(){if(!available)return;try{await available.prompt();const res=await available.userChoice;setNotice(res.outcome==="accepted"?"已接受安装，请查看设备桌面":"已取消安装，可稍后再试");setAvailable(null)}catch{setNotice("请通过浏览器菜单安装应用")}}
 return <section id="install" className="workspace-surface scroll-mt-24 rounded-2xl p-4 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Smartphone className="size-5"/></span><div><h2 className="font-semibold">安装到手机 / 电脑</h2><p className="mt-1 text-xs text-muted-foreground">PWA · 主屏幕图标 · 独立窗口</p></div></div><span className="rounded-full bg-secondary px-3 py-1 text-xs">{installed?"已安装":online?"可安装":"设备离线"}</span></div>
 {installed?<p className="mt-4 flex items-center gap-2 text-sm text-primary"><CheckCircle2 className="size-4"/>正在从已安装的工作台打开</p>:<div className="mt-4 space-y-3">{available?<Button onClick={()=>void install()}><Download className="size-4"/>安装 AIGZT</Button>:ios?<div className="flex gap-3 rounded-xl bg-muted/55 p-3 text-sm"><Share2 className="mt-0.5 size-5 shrink-0 text-primary"/><p>在 iPhone Safari 打开工作台，点击底部<strong>分享</strong>，选择<strong>添加到主屏幕</strong>。</p></div>:<p className="rounded-xl bg-muted/55 p-3 text-sm">在浏览器菜单中选择“安装应用”或“添加到主屏幕”。</p>}<p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><WifiOff className="mt-0.5 size-4 shrink-0"/>应用入口可安装；AI、云端会话和模型连接仍需要网络。离线不会显示虚构回复。</p></div>}
 {notice&&<p role="status" className="mt-3 text-xs text-primary">{notice}</p>}</section>
}