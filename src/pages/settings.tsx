import {useEffect,useState} from "react"
import {Link} from "react-router"
import {ExternalLink,LockKeyhole,Server,ShieldCheck,Workflow} from "lucide-react"
import {PwaInstall} from "@/components/pwa-install"
import {KEY_PANEL} from "@/lib/providers"
import MyConnections from "@/components/my-connections"
export default function Settings(){
 const [admin,setAdmin]=useState(false)
 useEffect(()=>{let active=true;tiny.call<{isAdmin:boolean}>("free_router",{action:"role"}).then(r=>{if(active)setAdmin(r.isAdmin)}).catch(()=>{});return ()=>{active=false}},[])
 return <div className="mx-auto max-w-3xl space-y-4 pb-8">
  <div><h1 className="text-2xl font-semibold">工作台设置</h1><p className="mt-2 text-sm text-muted-foreground">普通用户不用申请服务商 API Key，免费线路统一由网站管理。</p></div>
  <section className="space-y-2 rounded-2xl border bg-card p-4"><h2 className="flex items-center gap-2 font-semibold"><Workflow className="size-5 text-primary"/>免费额度自动调度</h2><p className="text-sm leading-6 text-muted-foreground">已授权免费线路优先，不可用时切换备用线路。不会把个人免费额度伪装成无限免费资源，也不会自动调用收费模型。</p><Link to="/pool" className="inline-flex h-10 items-center rounded-xl bg-secondary px-4 text-sm">免费额度和真实连接状态</Link></section>
  <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border bg-card p-4"><ShieldCheck className="size-5 text-primary"/><h2 className="mt-2 font-semibold">用户数据隔离</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">每个人的聊天、图片与项目资料独立存储。</p></div><div className="rounded-2xl border bg-card p-4"><Server className="size-5 text-primary"/><h2 className="mt-2 font-semibold">实际额度有限</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">免费模型和网站平台都有速率及月度限制。</p></div></div>
  {admin&&<div className="space-y-2 rounded-2xl border border-primary/35 bg-card p-4"><h2 className="flex items-center gap-2 font-semibold"><LockKeyhole className="size-5"/>站点管理员配置</h2><p className="text-xs text-muted-foreground">只有网站管理员负责上游密钥配置及许可确认，普通用户无需进入。</p><a href={KEY_PANEL} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs">安全维护密钥<ExternalLink className="size-4"/></a></div>}
  <MyConnections inline/>
  <PwaInstall/>
 </div>
}
