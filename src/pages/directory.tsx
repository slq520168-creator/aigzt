import {useEffect,useMemo,useState} from "react"
import {Link} from "react-router"
import {ArrowRight,CheckCircle2,ChevronRight,ExternalLink,KeyRound,LoaderCircle,Network,Plus,Search,ShieldCheck,UnlockKeyhole} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {useMe} from "@/lib/tiny"
import {discoverGatewayModels} from "@/lib/gateway"
import {PROVIDERS,KEY_PANEL,listNativeModels,discoverProviderModels,type ExternalProvider,type ModelRecord} from "@/lib/providers"
import {issueText} from "@/lib/workspace"

type Key="native"|"gateway"|ExternalProvider
type ListResult={items:ModelRecord[];verifiedAt:number}
const sourceLabels:Record<Key,string>={native:"内置 AI",gateway:"FreeLLMAPI",openrouter:"OpenRouter",groq:"Groq",cerebras:"Cerebras"}
const route=(source:Key,model:string)=>"/?source="+encodeURIComponent(source)+"&model="+encodeURIComponent(model)

export default function Directory(){
 const me=useMe()
 const [catalog,setCatalog]=useState<Partial<Record<Key,ListResult>>>({})
 const [checking,setChecking]=useState<Key|null>(null)
 const [errors,setErrors]=useState<Partial<Record<Key,string>>>({})
 const [open,setOpen]=useState<Key>("native")
 const [search,setSearch]=useState("")
 const [quota,setQuota]=useState<{user_hour:number;app_day:number}|null>(null)
 async function verify(source:Key){
  if(checking)return
  setChecking(source);setOpen(source);setErrors(v=>({...v,[source]:""}))
  try {
   let result:ModelRecord[]
   if(source==="native"){
    const native=await listNativeModels()
    result=native.models.map(id=>({id}))
    setQuota(native.remaining)
   }else if(source==="gateway"){
    result=(await discoverGatewayModels()).map(m=>({id:m.id}))
   }else{
    result=await discoverProviderModels(source)
   }
   if(!result.length)throw Error("当前账户没有可用模型")
   setCatalog(v=>({...v,[source]:{items:result,verifiedAt:Date.now()}}))
  }catch(e){setCatalog(v=>({...v,[source]:undefined}));setErrors(v=>({...v,[source]:issueText(e)}))}
  finally{setChecking(null)}
 }
 useEffect(()=>{if(me){void verify("native")}},[me?.id])
 const filtered=useMemo(()=>catalog[open]?.items.filter(m=>m.id.toLowerCase().includes(search.toLowerCase())||(m.name||"").toLowerCase().includes(search.toLowerCase()))??[],[catalog,open,search])
 function selectSource(source:Key){setOpen(source);setSearch("")}
 return <div className="space-y-4 pb-4">
  <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[11px] font-semibold tracking-[.16em] text-primary">AIGZT / MODEL MANAGER</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">添加与切换模型</h1><p className="mt-1 text-sm leading-6 text-muted-foreground">选择服务商 → 设置安全密钥 → 检测模型 → 直接开始聊天。</p></div><Link to="/" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"><ArrowRight className="size-4"/>进入聊天</Link></header>
  <section className="workspace-surface rounded-2xl p-3 sm:p-5">
   <div className="grid gap-2 sm:grid-cols-2">
    <button onClick={()=>selectSource("native")} className={"flex items-center justify-between gap-3 rounded-xl border p-3 text-left "+(open==="native"?"border-primary/45 bg-primary/8":"border-border bg-card hover:bg-muted/40")}><span><span className="block text-sm font-semibold">平台内置 AI</span><span className="mt-0.5 block text-xs text-muted-foreground">无需外部密钥，真实模型由账户权限决定</span></span><CheckCircle2 className="size-5 shrink-0 text-primary"/></button>
    {PROVIDERS.map(p=><button key={p.id} onClick={()=>selectSource(p.id)} className={"flex items-center justify-between gap-3 rounded-xl border p-3 text-left "+(open===p.id?"border-primary/45 bg-primary/8":"border-border bg-card hover:bg-muted/40")}><span><span className="block text-sm font-semibold">{p.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{p.detail}</span></span>{catalog[p.id]?<CheckCircle2 className="size-5 shrink-0 text-primary"/>:<KeyRound className="size-5 shrink-0 text-muted-foreground"/>}</button>)}
    <button onClick={()=>selectSource("gateway")} className={"flex items-center justify-between gap-3 rounded-xl border p-3 text-left "+(open==="gateway"?"border-primary/45 bg-primary/8":"border-border bg-card hover:bg-muted/40")}><span><span className="block text-sm font-semibold">FreeLLMAPI</span><span className="mt-0.5 block text-xs text-muted-foreground">接入独立部署的多服务商路由网关</span></span><Network className="size-5 shrink-0 text-muted-foreground"/></button>
   </div>
  </section>

  <section className="workspace-surface rounded-2xl p-4 sm:p-6">
   <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-lg font-semibold">{sourceLabels[open]}</h2><p className="mt-1 text-xs text-muted-foreground">{catalog[open]?"本次已验证模型目录 · "+catalog[open]!.items.length+" 项":"尚未验证连接。密钥由平台安全存储，网页不保存密钥。"}</p></div><Button disabled={!me||checking!==null} onClick={()=>void verify(open)} className="rounded-xl">{checking===open?<LoaderCircle className="size-4 animate-spin"/>:<Search className="size-4"/>}{checking===open?"正在检测…":catalog[open]?"重新检测":"检测并获取模型"}</Button></div>
   {open==="native"&&quota&&<p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs text-secondary-foreground">内置 AI 剩余请求：本小时 {quota.user_hour} 次，应用今日 {quota.app_day} 次（不代表外部免费 Token）</p>}
   {open!=="native"&&<div className="mt-4 flex flex-wrap gap-2">
    <a href={KEY_PANEL} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold hover:text-primary"><UnlockKeyhole className="size-4"/>安全设置 API Key<ExternalLink className="size-3.5"/></a>
    {open!=="gateway"&&<a href={PROVIDERS.find(p=>p.id===open)?.signup} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs hover:text-primary">获取 {sourceLabels[open]} 密钥<ExternalLink className="size-3.5"/></a>}
    {open==="gateway"&&<a href="https://github.com/tashfeenahmed/freellmapi" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs hover:text-primary">FreeLLMAPI 部署说明<ExternalLink className="size-3.5"/></a>}
   </div>}
   {open==="openrouter"&&<p className="mt-3 text-xs leading-5 text-muted-foreground">只列出免费模型，所有发送请求再次验证免费模型 ID，禁止静默切到收费模型。</p>}
   {open==="groq"||open==="cerebras"?<p className="mt-3 text-xs leading-5 text-muted-foreground">服务商可能存在免费开发者配额和收费方案。使用量与计费以你的服务商账户为准，不启用自动付费切换。</p>:null}
   {open==="gateway"&&<p className="mt-3 text-xs text-muted-foreground">此功能需要你实际部署独立网关并配置 HTTPS 地址；安全密钥不能直接输入聊天框。</p>}
   {errors[open]&&<p className="mt-3 rounded-xl bg-destructive/8 p-3 text-xs leading-5 text-destructive" role="alert">检测未通过：{errors[open]}</p>}
   {catalog[open]&&<div className="mt-4 space-y-3"><div className="relative"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"/><Input className="h-11 rounded-xl bg-background/40 pl-9" placeholder="输入模型名称筛选…" value={search} onChange={e=>setSearch(e.target.value)} aria-label="搜索已发现的模型"/></div>
    <p className="text-xs text-muted-foreground">匹配 {filtered.length} 个模型 · 每项可直接打开聊天</p>
    <div className="workspace-scroll max-h-[470px] divide-y divide-border/50 overflow-y-auto">
     {filtered.slice(0,150).map(model=><div key={model.id} className="flex min-w-0 items-center gap-2 py-2.5"><div className="min-w-0 flex-1"><p className="break-all text-xs font-semibold sm:text-sm">{model.name||model.id}</p>{model.name&&<p className="break-all text-[11px] text-muted-foreground">{model.id}</p>}</div><Link to={route(open,model.id)} className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-secondary px-3 text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground">使用<ChevronRight className="size-3.5"/></Link></div>)}
    </div>
    {filtered.length>150&&<p className="text-xs text-muted-foreground">结果较多，请缩小搜索关键词。</p>}
   </div>}
  </section>
  <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary"/>所有外部模型请求通过独立安全连接发出，网页和 GitHub 不持有密钥；只会向你明确选择的模型发送当前对话上下文。</p>
 </div>
}
