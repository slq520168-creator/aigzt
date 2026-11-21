import {useEffect,useMemo,useState} from "react"
import {Link} from "react-router"
import {Bot,Check,ChevronDown,ExternalLink,KeyRound,LoaderCircle,Plus,Search,Sparkles,X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {discoverGatewayModels} from "@/lib/gateway"
import {listNativeModels,discoverProviderModels,KEY_PANEL,engineName,PROVIDERS,type ModelEngine,type ModelRecord} from "@/lib/providers"
import {issueText} from "@/lib/workspace"

type PickerProps={currentSource:ModelEngine;currentModel:string;onChoose:(source:ModelEngine,model:string)=>void;onClose:()=>void}
const SOURCES:ModelEngine[]=["native","openrouter","groq","cerebras","gateway"]

export default function ModelPicker({currentSource,currentModel,onChoose,onClose}:PickerProps){
 const [source,setSource]=useState<ModelEngine>(currentSource)
 const [lists,setLists]=useState<Partial<Record<ModelEngine,ModelRecord[]>>>({})
 const [loading,setLoading]=useState<ModelEngine|null>(null)
 const [error,setError]=useState("")
 const [search,setSearch]=useState("")
 const [remaining,setRemaining]=useState<{user_hour:number;app_day:number}|null>(null)
 async function check(id:ModelEngine){
  if(loading)return
  setSource(id);setSearch("");setError("");setLoading(id)
  try{
   let items:ModelRecord[]
   if(id==="native"){const r=await listNativeModels();items=r.models.map(id=>({id}));setRemaining(r.remaining)}
   else if(id==="gateway"){items=(await discoverGatewayModels()).map(m=>({id:m.id}))}
   else items=await discoverProviderModels(id)
   if(!items.length)throw Error("没有可选择的模型")
   setLists(v=>({...v,[id]:items}))
  }catch(e){setLists(v=>({...v,[id]:undefined}));setError(issueText(e))}
  finally{setLoading(null)}
 }
 useEffect(()=>{void check(currentSource)},[])
 const filtered=useMemo(()=>lists[source]?.filter(m=>m.id.toLowerCase().includes(search.toLowerCase())||(m.name??"").toLowerCase().includes(search.toLowerCase()))??[],[lists,source,search])
 function pick(model:string){onChoose(source,model);onClose()}
 return <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
  <button className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" aria-label="关闭模型选择" onClick={onClose}/>
  <section role="dialog" aria-modal="true" aria-label="选择 AI 模型" className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border bg-card p-4 shadow-2xl sm:max-h-[86dvh] sm:rounded-3xl sm:p-5">
   <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
    <div><h2 className="text-base font-semibold sm:text-lg">选择 AI 模型</h2><p className="mt-1 text-xs text-muted-foreground">先验证连接，再选择真实可用模型</p></div>
    <Button size="icon" variant="ghost" aria-label="关闭模型列表" onClick={onClose}><X className="size-5"/></Button>
   </div>
   <div className="workspace-scroll mb-3 flex shrink-0 gap-1.5 overflow-x-auto pb-1">
    {SOURCES.map(id=><Button key={id} size="sm" variant={source===id?"default":"secondary"} disabled={loading!==null} className="h-9 shrink-0 rounded-lg text-xs" onClick={()=>void check(id)}>{engineName(id)}</Button>)}
   </div>
   <div className="flex shrink-0 items-center justify-between gap-3">
    <div className="min-w-0"><p className="text-sm font-semibold">{engineName(source)}</p><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{source==="native"?"账户允许使用的真实模型":source==="openrouter"?"仅显示免费模型":source==="gateway"?"需先部署独立聚合网关":"需要已授权服务商 API Key"}</p></div>
    <Button size="sm" variant="outline" disabled={loading!==null} onClick={()=>void check(source)} className="h-9 shrink-0 text-xs">{loading?<LoaderCircle className="size-4 animate-spin"/>:<Search className="size-4"/>}重新检测</Button>
   </div>
   {error&&<p role="alert" className="my-2 shrink-0 rounded-lg bg-destructive/8 p-2 text-xs leading-5 text-destructive">{error}</p>}
   <div className="relative my-3 shrink-0"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"/><Input className="h-10 pl-9" aria-label="搜索真实模型" placeholder="搜索模型名称…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
   <div className="workspace-scroll min-h-0 flex-1 space-y-1 overflow-y-auto">
    {source==="native"&&lists.native&&<Button variant={currentSource==="native"&&currentModel==="auto"?"secondary":"ghost"} className="h-11 w-full justify-start" onClick={()=>pick("auto")}><Sparkles className="size-4"/>平台自动选择</Button>}
    {source==="gateway"&&lists.gateway&&([["auto","智能调度"],["auto:fast","快速优先"],["auto:smart","深度优先"]] as const).map(([id,label])=><Button key={id} variant={currentSource==="gateway"&&currentModel===id?"secondary":"ghost"} className="h-11 w-full justify-start" onClick={()=>pick(id)}><Sparkles className="size-4"/>{label}</Button>)}
    {filtered.slice(0,120).map(m=><Button key={m.id} variant={currentSource===source&&currentModel===m.id?"secondary":"ghost"} className="h-11 w-full justify-start text-left" onClick={()=>pick(m.id)}><Bot className="size-4 shrink-0"/><span className="min-w-0 truncate">{m.name||m.id}</span>{m.name&&<span className="ml-auto max-w-32 truncate text-[10px] text-muted-foreground">{m.id}</span>}{currentSource===source&&currentModel===m.id&&<Check className="ml-auto size-4 text-primary"/>}</Button>)}
    {!loading&&filtered.length===0&&<p className="py-6 text-center text-xs text-muted-foreground">暂无已验证的模型，请检测连接或添加密钥。</p>}
   </div>
   {filtered.length>120&&<p className="mt-2 text-xs text-muted-foreground">结果较多，请通过关键词搜索</p>}
   {source==="native"&&remaining&&<p className="mt-2 text-xs text-muted-foreground">内置可用请求：本小时 {remaining.user_hour} 次 · 今日 {remaining.app_day} 次</p>}
   <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t pt-3">
    <Link to="/directory" onClick={onClose} className="inline-flex h-9 items-center gap-1.5 text-xs font-semibold text-primary"><Plus className="size-4"/>添加服务商</Link>
    <a href={KEY_PANEL} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"><KeyRound className="size-4"/>安全管理密钥<ExternalLink className="size-3.5"/></a>
   </div>
  </section>
 </div>
}
