import {useEffect,useState} from "react"
import {Link} from "react-router"
import {ArrowLeft,Info,LoaderCircle,RefreshCw,Workflow} from "lucide-react"
import {freePoolStatus,type PoolStatus} from "@/lib/free-pool"
import {issueText} from "@/lib/workspace"
export default function Pool(){
 const [status,setStatus]=useState<PoolStatus|null>(null)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState("")
 async function check(verify=false){
  setBusy(true);setError("")
  try{setStatus(await freePoolStatus(verify))}catch(e){setError(issueText(e))}finally{setBusy(false)}
 }
 useEffect(()=>{void check(false)},[])
 return <div className="mx-auto max-w-3xl space-y-4 pb-8">
  <header><p className="text-xs font-semibold tracking-wider text-primary">AIGZT · FREE POOL</p><h1 className="mt-1 text-2xl font-semibold">免费 AI 额度聚合</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">普通用户直接聊天，网站统一调度已许可的免费额度。没有密钥和免费次数的模型不冒充已接通。</p></header>
  <section className="rounded-2xl border bg-card p-4"><div className="flex items-center justify-between gap-2"><h2 className="font-semibold">实际额度</h2><button type="button" onClick={()=>void check(true)} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs disabled:opacity-50">{busy?<LoaderCircle className="size-4 animate-spin"/>:<RefreshCw className="size-4"/>}检测连接</button></div>
   {error&&<p role="alert" className="mt-3 text-xs text-destructive">检测失败：{error}</p>}
   {status&&<><div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">今日使用</p><p className="mt-1 text-2xl font-semibold tabular-nums">{status.user.used}</p></div><div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">我今天还能调用</p><p className="mt-1 text-2xl font-semibold tabular-nums">{status.user.remaining}</p></div></div><p className="mt-2 text-xs text-muted-foreground">每人每日 {status.user.dailyLimit} 次，每分钟 {status.user.minuteLimit} 次。这是网站调用限额，不是虚构的 Token 总余额。</p></>}
  </section>
  <section className="rounded-2xl border bg-card p-4"><h2 className="mb-2 flex items-center gap-2 font-semibold"><Workflow className="size-5 text-primary"/>免费来源</h2>
   {status?.sources.map(s=><div className="flex items-start justify-between gap-2 border-b py-3 last:border-0" key={s.id}><div className="min-w-0"><p className="text-sm font-medium">{s.name}</p><p className="mt-1 text-xs text-muted-foreground">{s.note||"网站统一配置，用户不需密钥"}</p>{s.remainingRequests!=null&&<p className="mt-1 text-xs">上游报告剩余请求：{s.remainingRequests}</p>}</div><span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs">{s.status}{!s.enabled?" · 未启用":""}</span></div>)}
   <p className="mt-2 text-xs text-muted-foreground">只有经实际接口核验并获准作为免费线路的服务商才参与自动调度。</p>
  </section>
  <div className="flex gap-2 rounded-xl bg-muted p-3 text-xs leading-5 text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0"/>免费额度受服务商规则和限额约束，不能把 FreeLLMAPI 的理论总量直接当作公共网站真实容量。</div>
  <Link to="/?source=free&model=auto" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"><ArrowLeft className="size-4"/>进入免费 AI 对话</Link>
 </div>
}
