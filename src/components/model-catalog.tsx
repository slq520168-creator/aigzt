import {useEffect,useMemo,useRef,useState} from "react"
import {Link} from "react-router"
import {ArrowRight,Check,KeyRound,LoaderCircle,RefreshCw,Search,Star,X} from "lucide-react"
import {Input} from "@/components/ui/input"
import {useEntries} from "@/lib/tiny"
import MyConnections from "@/components/my-connections"
import {hasPersonalKey,watchPersonalKeys} from "@/lib/user-keys"
import type {ExternalProvider} from "@/lib/providers"
import {discoverGatewayModels} from "@/lib/gateway"
import {KEY_PANEL,PROVIDERS,discoverProviderModels,engineName,listNativeModels,type ModelEngine,type ModelRecord} from "@/lib/providers"
import {issueText} from "@/lib/workspace"

type Favorite={source:ModelEngine;id:string;name:string;addedAt:string}
type Props={view:"sheet"|"page";currentSource?:ModelEngine;currentModel?:string;initialTab?:"favorites"|"browse";onChoose:(s:ModelEngine,m:string)=>void;onClose?:()=>void}
const SOURCES:ModelEngine[]=["free","native","openai","grok","gemini","qwen","openrouter","groq","cerebras","gateway"]
const favKey=(source:ModelEngine,id:string)=>"model-fav:"+source+":"+encodeURIComponent(id)

export default function ModelCatalog({view,currentSource="free",currentModel="auto",initialTab="favorites",onChoose,onClose}:Props){
 const [tab,setTab]=useState<"favorites"|"browse">(initialTab)
 const [source,setSource]=useState<ModelEngine>(currentSource)
 const [loaded,setLoaded]=useState<Partial<Record<ModelEngine,ModelRecord[]>>>({})
 const [busy,setBusy]=useState<ModelEngine|null>(null)
 const busyLock=useRef(false)
 const [pending,setPending]=useState("")
 const [query,setQuery]=useState("")
 const [error,setError]=useState("")
 const [personalOpen,setPersonalOpen]=useState(false)
 const [,setKeyChanged]=useState(0)
 useEffect(()=>watchPersonalKeys(()=>setKeyChanged(v=>v+1)),[])
 const [remaining,setRemaining]=useState<{user_hour:number;app_day:number}|null>(null)
 const {entries,error:favError}=useEntries<Favorite>("model-fav:",{order:"-$updated_at",limit:150})
 const favorites=useMemo(()=>entries?.map(v=>v.value)??[],[entries])
 const saved=new Set(favorites.map(m=>favKey(m.source,m.id)))
 async function verify(id:ModelEngine){
  if(busyLock.current)return
  busyLock.current=true;setBusy(id);setSource(id);setQuery("");setError("")
  try{
   let records:ModelRecord[]
   if(id==="free"){
    records=[{id:"auto",name:"免费智能调度（不需要个人密钥）"}]
   }else if(id==="native"){
    const limits=await listNativeModels()
    records=limits.models.map(id=>({id}))
    setRemaining(limits.remaining)
   }else if(id==="gateway")records=(await discoverGatewayModels()).map(v=>({id:v.id}))
   else{
    if(id!=="groq"&&!hasPersonalKey(id)){setPersonalOpen(true);throw Error("该服务商需要你的个人 API Key。网站免费池不要求你提供密钥。")}
    records=await discoverProviderModels(id)
   }
   if(!records.length)throw Error("此连接暂时没有可用模型")
   setLoaded(x=>({...x,[id]:records}))
  }catch(e){setLoaded(x=>({...x,[id]:undefined}));setError(issueText(e))}
  finally{setBusy(null);busyLock.current=false}
 }
 useEffect(()=>{void verify(currentSource)},[])
 useEffect(()=>{
  if(view!=="sheet")return
  const onEscape=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose?.()}
  document.addEventListener("keydown",onEscape)
  return ()=>document.removeEventListener("keydown",onEscape)
 },[view,onClose])
 function selectSource(id:ModelEngine){
  setTab("browse")
  if(id!=="free"&&id!=="native"&&id!=="gateway"&&id!=="groq"&&!hasPersonalKey(id)){
   setSource(id);setPersonalOpen(true);setError("请先连接自己的 "+engineName(id)+" 账号或 API Key");return
  }
  if(loaded[id]){setSource(id);setError("");setQuery("")}
  else void verify(id)
 }
 const available:Favorite[]=source==="free"?
  [{source:"free",id:"auto",name:"免费智能调度",addedAt:""}]:source==="native"?
  [{source:"native",id:"auto",name:"自动选择",addedAt:""},...(loaded.native??[]).map(m=>({source:"native" as const,id:m.id,name:m.name||m.id,addedAt:""}))]:
  (loaded[source]??[]).map(m=>({source,id:m.id,name:m.name||m.id,addedAt:""}))
 const models=tab==="favorites"?favorites:loaded[source]?available:[]
 const filtered=useMemo(()=>models.filter(m=>(m.name+" "+m.id+" "+engineName(m.source)).toLowerCase().includes(query.trim().toLowerCase())),[models,query])
 async function toggle(model:Favorite){
  if(pending)return
  const key=favKey(model.source,model.id)
  setPending(key)
  try{
   if(saved.has(key))await tiny.db.delete(key)
   else{
    if(favorites.length>=120)throw Error("常用模型最多收藏 120 个")
    await tiny.db.set(key,{source:model.source,id:model.id,name:model.name,addedAt:new Date().toISOString()})
   }
  }catch(e){setError("保存失败："+issueText(e))}
  finally{setPending("")}
 }
 const body=<div className="model-catalog flex h-full min-h-0 flex-col">
  <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
   <div><h2 className="text-[16px] font-semibold">{view==="sheet"?"选择模型":"模型管理"}</h2><p className="mt-0.5 text-[11px] text-muted-foreground">真实模型 · 添加常用 · 一键切换</p></div>
   {view==="sheet"?<button type="button" className="grid size-9 place-items-center rounded-xl hover:bg-muted" onClick={onClose} aria-label="关闭"><X className="size-5"/></button>:<Link to="/" className="rounded-xl px-3 py-2 text-xs hover:bg-muted">返回聊天</Link>}
  </div>
  <div className="flex shrink-0 flex-wrap gap-1 border-b px-4 py-2">
   <button type="button" className="model-tab model-tab-active" onClick={()=>{setTab("browse");void verify("free")}}>免费自动路由</button>
   <button type="button" onClick={()=>{setTab("favorites");setQuery("");setError("")}} className={"model-tab "+(tab==="favorites"?"model-tab-active":"")}><Star className="size-4"/>常用 {favorites.length}</button>
   <button type="button" onClick={()=>{setTab("browse");setQuery("");setError("")}} className={"model-tab "+(tab==="browse"?"model-tab-active":"")}><Search className="size-4"/>浏览与添加</button>
   <button type="button" onClick={()=>setPersonalOpen(true)} className="model-tab"><KeyRound className="size-4"/>我的密钥 / 授权</button>
  </div>
  {tab==="favorites"&&<div className="flex shrink-0 flex-wrap gap-1.5 border-b px-4 py-2">{(["openai","grok","gemini","qwen"] as const).map(id=><button type="button" key={id} onClick={()=>selectSource(id)} className="inline-flex h-8 items-center rounded-xl border border-border/60 px-3 text-xs hover:bg-muted">{engineName(id)}</button>)}<Link to="/create" className="inline-flex h-8 items-center rounded-xl border border-border/60 px-3 text-xs hover:bg-muted">画图 · 视频</Link></div>}
  {tab==="browse"&&<div className="model-source-list flex shrink-0 gap-1 overflow-x-auto border-b px-4 py-2">
   {SOURCES.map(id=><button key={id} type="button" className={"model-source-tab "+(source===id?"model-source-selected":"")} onClick={()=>selectSource(id)}>{engineName(id)}{loaded[id]&&<Check className="size-3.5 text-primary"/>}</button>)}
  </div>}
  <div className="relative mx-4 mt-3 shrink-0"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"/><Input className="h-10 rounded-xl bg-muted/45 pl-9 text-sm" aria-label="搜索模型" placeholder="搜索模型名称…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
  {tab==="browse"&&<div className="flex shrink-0 items-center justify-between gap-2 px-4 py-2 text-[11px] text-muted-foreground">
   <span>{busy?"检测连接中…":loaded[source]?"本次已发现 "+loaded[source]!.length+" 个模型":"未验证连接"}{source==="openrouter"?" · 仅免费":""}</span>
   <button type="button" className="inline-flex h-8 items-center gap-1 text-primary" onClick={()=>void verify(source)} disabled={busy!==null}>{busy?<LoaderCircle className="size-3.5 animate-spin"/>:<RefreshCw className="size-3.5"/>}检测</button>
  </div>}
  {error&&<p role="alert" className="mx-4 my-2 rounded-xl bg-destructive/8 p-2 text-xs leading-5 text-destructive">{error}</p>}
  {favError&&<p role="alert" className="mx-4 my-2 text-xs text-destructive">同步常用模型失败：{issueText(favError)}</p>}
  <div role="list" aria-label={tab==="favorites"?"常用模型":"真实模型列表"} className="model-list min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
   {filtered.slice(0,250).map(model=>{
    const key=favKey(model.source,model.id),isSaved=saved.has(key)
    return <div key={key} role="listitem" className="model-list-row flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5">
     <button type="button" className="flex min-h-10 min-w-0 flex-1 items-center gap-2 text-left" onClick={()=>{if(model.source!=="free"&&model.source!=="native"&&model.source!=="gateway"&&model.source!=="groq"&&!hasPersonalKey(model.source)){setSource(model.source);setPersonalOpen(true);return}onChoose(model.source,model.id);onClose?.()}}>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">{engineName(model.source).slice(0,1)}</span>
      <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium">{model.name}</span><span className="block truncate text-[11px] text-muted-foreground">{engineName(model.source)}{model.name!==model.id?" · "+model.id:""}</span></span>
      {currentSource===model.source&&currentModel===model.id&&<Check className="size-4 shrink-0 text-primary"/>}
     </button>
     <button type="button" className={"flex h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-[11px] "+(isSaved?"text-primary":"text-muted-foreground hover:bg-muted")} disabled={Boolean(pending)} onClick={()=>void toggle(model)} aria-label={(isSaved?"取消常用 ":"添加常用 ")+model.name}><Star className={"size-4 "+(isSaved?"fill-current":"")}/><span>{isSaved?"已添加":"添加"}</span></button>
    </div>
   })}
   {filtered.length>250&&<p className="p-3 text-xs text-muted-foreground">结果较多，请搜索具体模型名。</p>}
   {!busy&&filtered.length===0&&<p className="px-4 py-8 text-center text-[12px] leading-6 text-muted-foreground">{tab==="favorites"?"还没有常用模型。点击「浏览与添加」，在实际模型旁点击「添加」。":loaded[source]?"没有匹配的模型。":"该服务尚未通过连接验证，不能作为已添加模型。"}</p>}
  </div>
  <div className="shrink-0 border-t px-4 py-3 text-[11px] text-muted-foreground">
   {tab==="browse"&&source==="native"&&remaining&&<p className="mb-2">内置剩余：本小时 {remaining.user_hour} 次 · 今日 {remaining.app_day} 次</p>}
   <div className="flex flex-wrap items-center justify-between gap-2"><span>网站统一配置上游密钥；普通用户不需要申请。</span><Link to="/pool" onClick={onClose} className="inline-flex items-center gap-1 font-medium text-primary">免费额度</Link></div>
   
   {tab==="browse"&&source==="gateway"&&<p className="mt-2">FreeLLMAPI 需要独立 HTTPS 网关。</p>}
  </div>
 </div>
 const connector=personalOpen&&<MyConnections initial={source==="free"||source==="native"||source==="gateway"?"openrouter":source} onClose={()=>setPersonalOpen(false)} onReady={id=>{setSource(id);setPersonalOpen(false);setTab("browse");void verify(id)}}/>
 if(view==="page")return <><div className="mx-auto w-full max-w-[760px] py-3 sm:py-6"><section className="h-[min(720px,calc(100dvh-130px))] min-h-[540px] overflow-hidden rounded-2xl border border-border/70 bg-card">{body}</section></div>{connector}</>
 return <div className="fixed inset-0 z-[100]"><button className="absolute inset-0 bg-foreground/12" aria-label="关闭模型菜单" onClick={onClose}/>
  <section role="dialog" aria-modal="true" aria-label="选择与添加模型" className="model-picker-sheet absolute left-2 right-2 top-[60px] flex h-[min(680px,calc(100dvh-76px))] min-h-[370px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl md:left-[270px] md:right-auto md:w-[min(490px,calc(100vw-290px))]">{body}</section>{connector}
 </div>
}
