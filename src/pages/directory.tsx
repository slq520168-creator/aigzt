import { useMemo,useState } from "react"
import { Link } from "react-router"
import { ArrowRight, CheckCircle2, ChevronRight, ExternalLink, Globe2, Network, RadioTower, Search, ShieldCheck, Sparkles, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { discoverGatewayModels,type GatewayModel } from "@/lib/gateway"
import { issueText } from "@/lib/workspace"

type Service={name:string;type:string;detail:string;url:string}
const providers:Service[]=[
 {name:"OpenRouter",type:"模型聚合",detail:"多模型统一路由",url:"https://openrouter.ai"},
 {name:"Groq",type:"高速推理",detail:"低延迟推理接口",url:"https://console.groq.com"},
 {name:"Google AI Studio",type:"模型平台",detail:"Gemini 模型开发环境",url:"https://aistudio.google.com"},
 {name:"Cerebras",type:"高速推理",detail:"模型推理服务",url:"https://cloud.cerebras.ai"},
 {name:"NVIDIA NIM",type:"模型平台",detail:"AI 模型推理接口",url:"https://build.nvidia.com"},
 {name:"Mistral AI",type:"模型平台",detail:"Mistral 模型 API",url:"https://console.mistral.ai"},
 {name:"GitHub Models",type:"开发模型",detail:"开发者模型试用平台",url:"https://github.com/marketplace/models"},
 {name:"Hugging Face",type:"模型平台",detail:"开源模型与推理资源",url:"https://huggingface.co"},
 {name:"Cohere",type:"模型平台",detail:"文本生成与检索",url:"https://dashboard.cohere.com"},
 {name:"Cloudflare Workers AI",type:"模型平台",detail:"边缘 AI 推理服务",url:"https://developers.cloudflare.com/workers-ai/"},
 {name:"SiliconFlow",type:"中文生态",detail:"硅基流动模型平台",url:"https://siliconflow.cn"},
 {name:"智谱 Z.ai",type:"中文生态",detail:"GLM 系列模型接口",url:"https://z.ai"},
 {name:"Ollama",type:"本地推理",detail:"在自己设备运行模型",url:"https://ollama.com"},
 {name:"AI Horde",type:"社区算力",detail:"社区共享计算资源",url:"https://aihorde.net"},
 {name:"Pollinations",type:"生成服务",detail:"文本与图片生成生态",url:"https://pollinations.ai"},
 {name:"Reka",type:"模型平台",detail:"多模态模型服务",url:"https://reka.ai"},
 {name:"Together AI",type:"模型平台",detail:"模型托管与推理",url:"https://www.together.ai"},
 {name:"Fireworks AI",type:"高速推理",detail:"开源模型推理平台",url:"https://fireworks.ai"},
 {name:"Replicate",type:"模型平台",detail:"运行不同类型的模型",url:"https://replicate.com"},
 {name:"Perplexity API",type:"搜索 AI",detail:"搜索与问答模型接口",url:"https://docs.perplexity.ai"},
]
const sites:Service[]=[
 {name:"ChatGPT",type:"通用助手",detail:"对话与生产力",url:"https://chatgpt.com"},
 {name:"Claude",type:"写作推理",detail:"文本与代码协作",url:"https://claude.ai"},
 {name:"Gemini",type:"多模态",detail:"Google AI 助手",url:"https://gemini.google.com"},
 {name:"DeepSeek",type:"推理编码",detail:"通用对话与编程",url:"https://chat.deepseek.com"},
 {name:"Grok",type:"通用助手",detail:"AI 对话",url:"https://grok.com"},
 {name:"Kimi",type:"长文档",detail:"长文档与研究",url:"https://www.kimi.com"},
 {name:"Qwen",type:"多模态",detail:"千问模型助手",url:"https://chat.qwen.ai"},
 {name:"豆包",type:"中文助手",detail:"对话与创作",url:"https://www.doubao.com"},
 {name:"腾讯元宝",type:"中文助手",detail:"信息处理与问答",url:"https://yuanbao.tencent.com"},
 {name:"NotebookLM",type:"知识研究",detail:"基于资料的研究",url:"https://notebooklm.google.com"},
 {name:"Perplexity",type:"联网研究",detail:"搜索与信息分析",url:"https://www.perplexity.ai"},
 {name:"Microsoft Copilot",type:"办公助手",detail:"办公与生产力",url:"https://copilot.microsoft.com"},
 {name:"Mistral Le Chat",type:"通用助手",detail:"AI 对话",url:"https://chat.mistral.ai"},
 {name:"HuggingChat",type:"开源对话",detail:"开源模型对话",url:"https://huggingface.co/chat"},
 {name:"Poe",type:"多模型入口",detail:"不同模型对话入口",url:"https://poe.com"},
 {name:"通义千问",type:"中文助手",detail:"中文任务与创作",url:"https://tongyi.aliyun.com"},
]
const filters=["全部","模型聚合","高速推理","模型平台","中文生态","本地推理"]
export default function Directory(){
 const [tab,setTab]=useState<"api"|"sites">("api")
 const [filter,setFilter]=useState("全部")
 const [query,setQuery]=useState("")
 const [modelQuery,setModelQuery]=useState("")
 const [models,setModels]=useState<GatewayModel[]|null>(null)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState("")
 const base=tab==="api"?providers:sites
 const listed=useMemo(()=>base.filter(p=>(filter==="全部"||p.type===filter)&&p.name.toLowerCase().includes(query.trim().toLowerCase())),[base,filter,query])
 const found=useMemo(()=>models?.filter(m=>m.id.toLowerCase().includes(modelQuery.toLowerCase()))??[],[models,modelQuery])
 async function test(){
  setError("");setBusy(true)
  try{setModels(await discoverGatewayModels())}catch(e){setModels(null);setError(issueText(e))}
  finally{setBusy(false)}
 }
 return <div className="space-y-5">
  <div className="flex flex-wrap items-start justify-between gap-3">
   <div><p className="mb-1 text-[11px] font-bold tracking-[.16em] text-primary">AIGZT / MODEL HUB</p><h1 className="text-[25px] font-bold tracking-tight sm:text-[30px]">AI 模型资源库</h1><p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">发现、验证、管理模型与服务商。连接成功后，统一工作台才会开放自动路由。</p></div>
   <a className="inline-flex h-9 items-center gap-2 rounded-xl border bg-card px-3 text-xs font-medium hover:text-primary" href="https://github.com/tashfeenahmed/freellmapi" target="_blank" rel="noopener noreferrer"><Network className="size-4"/>FreeLLMAPI<ExternalLink className="size-3.5"/></a>
  </div>
  <section className="workspace-surface relative overflow-hidden rounded-[20px] p-4 sm:p-6">
   <div className="absolute -right-14 -top-20 size-56 rounded-full bg-primary/7 blur-3xl"/>
   <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
    <div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary"><RadioTower className="size-3.5"/>统一模型路由</div>
     <h2 className="text-xl font-bold sm:text-2xl">一个入口，管理更多 AI</h2>
     <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">FreeLLMAPI 能连接多个服务商并管理路由。公开目录不等于个人已获得额度；真正可用的模型从你的网关实时发现。</p>
    </div>
    <div className="grid grid-cols-2 gap-2 sm:flex"><div className="rounded-xl border border-border/70 bg-background/60 px-3 py-3 sm:min-w-[132px]"><p className="text-[11px] text-muted-foreground">原生引擎</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary"><CheckCircle2 className="size-4"/>已接入</p></div><div className="rounded-xl border border-border/70 bg-background/60 px-3 py-3 sm:min-w-[132px]"><p className="text-[11px] text-muted-foreground">外部网关</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">{models?"已验证":"待连接"}</p></div></div>
   </div>
   <div className="relative mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4"><Button size="sm" className="rounded-xl" onClick={()=>void test()} disabled={busy}>{busy?"正在检测…":"检测我的 FreeLLMAPI"}<ArrowRight className="size-4"/></Button><Link to="/settings" className="inline-flex h-9 items-center gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-primary">查看接入说明<ChevronRight className="size-3.5"/></Link></div>
   {error&&<p role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"><XCircle className="size-4 shrink-0"/><span className="break-words">尚未连接：{error}</span></p>}
  </section>
  {models&&<section className="workspace-surface space-y-3 rounded-2xl p-4">
   <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold">我的已发现模型 · {models.length}</h2><span className="text-[11px] text-primary">网关真实返回</span></div>
   <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input className="h-10 rounded-xl bg-background/40 pl-9" placeholder="按模型 ID 搜索…" aria-label="搜索可用模型" value={modelQuery} onChange={e=>setModelQuery(e.target.value)}/></div>
   <div className="workspace-scroll max-h-80 divide-y divide-border/50 overflow-y-auto">{found.slice(0,100).map(m=><div className="flex items-center justify-between gap-2 py-2.5 text-xs" key={m.id}><span className="break-all">{m.id}</span><span className="shrink-0 text-primary">已发现</span></div>)}</div>
   {found.length>100&&<p className="text-[11px] text-muted-foreground">当前显示前 100 条匹配结果，请缩小关键词继续搜索。</p>}
  </section>}
  <section className="space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">探索 AI 生态</h2><p className="mt-0.5 text-xs text-muted-foreground">全部均为官方访问入口，未授权之前不参与工作台 API 调用。</p></div><div className="flex shrink-0 items-center gap-1 rounded-xl border bg-card p-1">
    <Button size="sm" variant={tab==="api"?"secondary":"ghost"} className="h-8 rounded-lg text-xs" onClick={()=>{setTab("api");setFilter("全部");setQuery("")}}><Network className="size-3.5"/>API 服务</Button>
    <Button size="sm" variant={tab==="sites"?"secondary":"ghost"} className="h-8 rounded-lg text-xs" onClick={()=>{setTab("sites");setFilter("全部");setQuery("")}}><Globe2 className="size-3.5"/>AI 网站</Button>
   </div></div>
   <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative w-full sm:max-w-80"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} className="h-10 rounded-xl bg-card pl-9" placeholder="搜索服务商或 AI 名称…" aria-label="搜索 AI 服务"/></div><div className="workspace-scroll flex min-w-0 gap-1 overflow-x-auto">{(tab==="api"?filters:["全部"]).map(f=><Button key={f} size="sm" variant={filter===f?"secondary":"ghost"} onClick={()=>setFilter(f)} className="h-9 shrink-0 rounded-xl text-xs">{f}</Button>)}</div></div>
   <p className="text-[11px] text-muted-foreground">共 {listed.length} 个参考入口 · 只展示有真实官方链接的服务</p>
   <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">{listed.map(p=><a key={p.name} className="workspace-surface workspace-button group flex min-h-[137px] flex-col justify-between gap-3 rounded-2xl p-3.5 hover:border-primary/45 hover:bg-primary/5 sm:p-4" target="_blank" rel="noopener noreferrer" href={p.url}>
    <span className="flex items-start justify-between gap-2"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-bold text-foreground">{p.name.slice(0,1).toUpperCase()}</span><ExternalLink className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary"/></span>
    <span><span className="block break-words text-[13px] font-semibold">{p.name}</span><span className="mt-1 block text-[10px] text-muted-foreground">{p.detail}</span></span>
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><span className="size-1.5 rounded-full bg-muted-foreground/70"/>待授权 · {p.type}</span>
   </a>)}</div>
   {listed.length===0&&<p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">没有符合条件的服务商</p>}
  </section>
  <footer className="flex items-start gap-2 rounded-xl border border-border/70 bg-card/60 p-3 text-[11px] leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary"/><span>不虚构余额、不自动注册外部账户、不上传密钥到公开仓库。FreeLLMAPI 官方完整目录和规则请以项目文档为准。</span></footer>
 </div>
}
