import { useEffect, useRef, useState } from "react"
import { Send, Plus, Trash2, Bot, LoaderCircle, FolderKanban, ShieldCheck, RotateCcw, ArrowRight } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEntries, useMe } from "@/lib/tiny"
import { type WorkspaceChat, type WorkspaceMessage, type WorkspaceProject, issueText } from "@/lib/workspace"
import { discoverGatewayModels, gatewayComplete } from "@/lib/gateway"
export default function Home(){
 const me=useMe(),{entries,error}=useEntries<WorkspaceChat>("chat:",{order:"-$updated_at",limit:50})
 const {entries:projects}=useEntries<WorkspaceProject>("project:",{order:"-$updated_at",limit:50})
 const [selected,setSelected]=useState<string|null>(null),[projectForNew,setProjectForNew]=useState<string|null>(null)
 const [draft,setDraft]=useState(""),[busy,setBusy]=useState(false),[notice,setNotice]=useState(""),[deleteConfirm,setDeleteConfirm]=useState(false)
 const [engine,setEngine]=useState<"native"|"gateway">("native"),[gatewayReady,setGatewayReady]=useState(false)
 const [checkingGateway,setCheckingGateway]=useState(false),[gatewayModelCount,setGatewayModelCount]=useState(0)
 const [strategy,setStrategy]=useState("auto")
 const end=useRef<HTMLDivElement>(null)
 const current=entries?.find(e=>e.key===selected)
 const projectId=current?.value.projectId??projectForNew
 const project=projects?.find(e=>e.key===projectId)
 useEffect(()=>{end.current?.scrollIntoView({behavior:"instant"})},[current?.value?.messages?.length,busy])
 function newChat(){setSelected(null);setNotice("");setDeleteConfirm(false)}
 async function pickProject(id:string|null) {setNotice("");setProjectForNew(id);if(current){try{await tiny.db.set(current.key,{...current.value,projectId:id??undefined,updatedAt:new Date().toISOString()})}catch(e){setNotice("关联项目失败："+issueText(e))}}}
 async function checkGateway(){if(checkingGateway)return;setCheckingGateway(true);setNotice("");try{const models=await discoverGatewayModels();setGatewayModelCount(models.length);setGatewayReady(true)}catch(e){setGatewayReady(false);setEngine("native");setGatewayModelCount(0);setNotice("FreeLLMAPI 未连接："+issueText(e))}finally{setCheckingGateway(false)}}
 async function answer(key:string, messages:WorkspaceMessage[], title:string, projectRef?:string) {
  const linked=projects?.find(p=>p.key===projectRef)
  const instruction="你是 AI 聚合工作台的中文助手。准确处理当前会话，结合已关联项目背景保持连续性。不得声称已调用没有接入的第三方 AI 提供商。"+(linked?.value.context?"\n项目长期上下文：\n"+linked.value.context.slice(0,12000):"")
  const history=messages.slice(-18).map(m=>m.role+": "+m.content.slice(0,10000)).join("\n\n")
  let content:string, routedModel:string
  if(engine==="gateway"){
    if(!gatewayReady)throw new Error("请先检测并连接 FreeLLMAPI 网关")
    const routed=await gatewayComplete(messages,instruction,strategy)
    content=routed.content;routedModel=routed.route
  }else{
    const result=await tiny.ai.generate(history,{system:instruction})
    content=typeof result==="string"?result:JSON.stringify(result)
    routedModel="平台内置 AI"
  }
  const next:WorkspaceMessage[]=[...messages,{role:"assistant",content,model:routedModel}]
  if(JSON.stringify(next).length>220000)throw new Error("本会话内容接近云端单条存储限制，请新开会话继续，项目记忆仍会保留。")
  await tiny.db.set(key,{title,messages:next,updatedAt:new Date().toISOString(),projectId:projectRef})
 }
 async function send(){const prompt=draft.trim();if(!prompt||busy||!me)return;setBusy(true);setNotice("")
 const key=selected||"chat:"+crypto.randomUUID(),old=current?.value
 const messages:WorkspaceMessage[]=[...(old?.messages||[]),{role:"user",content:prompt}]
 const title=old?.title||prompt.slice(0,32),linked=old?.projectId??projectForNew??undefined
 setSelected(key)
 try{if(JSON.stringify(messages).length>220000)throw new Error("当前会话已接近容量上限，请新建对话并继续使用项目记忆。");await tiny.db.set(key,{title,messages,updatedAt:new Date().toISOString(),projectId:linked});setDraft("");await answer(key,messages,title,linked)}
 catch(e){setNotice("本次请求未完成："+issueText(e))}finally{setBusy(false)}}
 async function retry(){if(!current||busy||!me||current.value.messages.at(-1)?.role!=="user")return;setBusy(true);setNotice("");try{await answer(current.key,current.value.messages,current.value.title,current.value.projectId)}catch(e){setNotice("重试失败："+issueText(e))}finally{setBusy(false)}}
 async function remove(){if(!selected||!deleteConfirm)return;try{await tiny.db.delete(selected);setSelected(null);setDeleteConfirm(false)}catch(e){setNotice("删除失败："+issueText(e))}}
 const retryAvailable=current?.value.messages.at(-1)?.role==="user"&&!busy
 return <div className="space-y-4">
 <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500"/><span className="text-xs font-medium tracking-wide text-muted-foreground">统一工作台 · 原生 AI 已就绪 · 独立网关按需接入</span></div><h1 className="mt-1 text-2xl font-semibold tracking-tight">开始工作，保持上下文</h1><p className="mt-1 text-sm text-muted-foreground">一个聊天入口管理项目记忆。FreeLLMAPI 多模型网关尚待连接，不会伪装成可用额度。</p></div><Link to="/directory" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted">查看模型中心<ArrowRight className="size-4"/></Link></div>
 <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-card px-4 py-3"><p className="text-xs text-muted-foreground">目前可对话</p><p className="mt-1 text-lg font-semibold">平台内置 AI</p><p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">已接入</p></div><div className="rounded-xl border bg-card px-4 py-3"><p className="text-xs text-muted-foreground">外部免费模型网关</p><p className="mt-1 text-lg font-semibold">{gatewayReady?"已验证":"待验证"}</p><p className="mt-1 text-xs text-muted-foreground">{gatewayReady?`发现 ${gatewayModelCount} 个模型`:"需配置 HTTPS 网关和统一密钥"}</p></div><div className="rounded-xl border bg-card px-4 py-3"><p className="text-xs text-muted-foreground">共享项目记忆</p><p className="mt-1 text-lg font-semibold">{projects?.length??"—"} 个项目</p><p className="mt-1 text-xs text-muted-foreground">同一账户跨设备复用</p></div></div>
 <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
 <aside className="space-y-3"><div className="flex items-center justify-between gap-2"><h2 className="font-semibold">历史会话</h2><Button size="sm" variant="outline" onClick={newChat}><Plus className="size-4"/>新对话</Button></div>
 {!me?<p className="text-sm text-muted-foreground">登录后可保存并同步会话。</p>:error?<p role="alert" className="text-sm text-destructive">读取失败：{issueText(error)}</p>:entries===undefined?<p className="text-sm text-muted-foreground">读取会话中…</p>:entries.length===0?<p className="text-sm text-muted-foreground">还没有会话。</p>:<div className="flex gap-1 overflow-x-auto pb-1 lg:max-h-[50vh] lg:flex-col lg:overflow-y-auto">{entries.map(e=><Button key={e.key} variant={selected===e.key?"secondary":"ghost"} className="max-w-56 shrink-0 justify-start overflow-hidden lg:max-w-full" onClick={()=>{setSelected(e.key);setDeleteConfirm(false);setNotice("")}}><span className="truncate">{e.value.title}</span></Button>)}</div>}</aside>
 <section className="flex min-h-[60vh] flex-col overflow-hidden rounded-2xl border bg-card">
  <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3"><div className="min-w-0"><h2 className="truncate font-semibold">{current?.value.title||"新的 AI 对话"}</h2><p className="mt-0.5 text-xs text-muted-foreground">当前引擎：{engine==="gateway"?"FreeLLMAPI · "+strategy:"平台内置 AI"} · 保留真实会话</p></div>{current&&(deleteConfirm?<div className="flex items-center gap-2 text-xs"><span>确定删除？</span><Button size="sm" variant="outline" onClick={()=>setDeleteConfirm(false)}>取消</Button><Button size="sm" variant="destructive" onClick={()=>void remove()}>删除</Button></div>:<Button variant="ghost" size="icon" aria-label="删除会话" onClick={()=>setDeleteConfirm(true)}><Trash2 className="size-4"/></Button>)}</div>
  <div className="flex flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-2"><span className="text-xs text-muted-foreground">AI 引擎：</span><Button size="sm" variant={engine==="native"?"secondary":"outline"} onClick={()=>setEngine("native")}>内置 AI</Button><Button size="sm" variant={engine==="gateway"?"secondary":"outline"} disabled={!gatewayReady} onClick={()=>setEngine("gateway")}>FreeLLMAPI</Button><Button size="sm" variant="ghost" disabled={checkingGateway} onClick={()=>void checkGateway()}>{checkingGateway?"检测中…":gatewayReady?"重新检测网关":"检测网关"}</Button>{engine==="gateway"&&<div className="flex gap-1">{[["auto","智能"],["auto:fast","快速"],["auto:smart","深度"]].map(([value,label])=><Button size="sm" key={value} variant={strategy===value?"secondary":"ghost"} onClick={()=>setStrategy(value)}>{label}</Button>)}</div>}</div>
  <div className="flex flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-2"><FolderKanban className="size-4 text-muted-foreground"/><span className="text-xs text-muted-foreground">项目上下文：</span><Button size="sm" variant={!projectId?"secondary":"outline"} onClick={()=>void pickProject(null)}>无</Button>{projects?.slice(0,5).map(p=><Button key={p.key} size="sm" variant={projectId===p.key?"secondary":"outline"} onClick={()=>void pickProject(p.key)}>{p.value.name}</Button>)}<Link to="/projects" className="ml-auto text-xs text-primary hover:underline">管理记忆</Link></div>
  <div className="min-h-60 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">{!current?.value.messages?.length&&!busy?<div className="mx-auto mt-8 max-w-sm text-center"><Bot className="mx-auto mb-4 size-10 text-primary"/><h3 className="text-xl font-semibold">在这里开始</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">将项目背景固定在「项目记忆」，后续聊天都可关联它。外部免费模型接入后也将使用同一份项目上下文。</p></div>:current?.value.messages.map((m,i)=><div key={i} className={m.role==="user"?"ml-auto max-w-[91%] rounded-2xl bg-primary p-3 text-primary-foreground":"mr-auto max-w-[96%] rounded-2xl bg-muted p-3"}><p className="whitespace-pre-wrap break-words text-sm leading-6">{m.content}</p>{m.role==="assistant"&&m.model&&<p className="mt-2 text-[11px] text-muted-foreground">回答模型：{m.model}</p>}</div>)}{busy&&<p className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin"/>正在生成回复…</p>}<div ref={end}/></div>
  <div className="border-t p-3 sm:p-4">{notice&&<p role="alert" className="mb-2 text-sm text-destructive">{notice}</p>}{retryAvailable&&<Button size="sm" variant="outline" className="mb-2" onClick={()=>void retry()}><RotateCcw className="size-4"/>重试当前回复</Button>}<form onSubmit={e=>{e.preventDefault();void send()}} className="flex gap-2"><Input aria-label="输入消息" value={draft} onChange={e=>setDraft(e.target.value)} placeholder={me?"输入内容，继续对话…":"请先登录"} disabled={!me||busy}/><Button type="submit" disabled={!me||busy||!draft.trim()}><Send className="size-4"/>发送</Button></form><p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground"><ShieldCheck className="size-3"/>账户云端保存 · 自动路由只走你已配置的网关，不会暗中切换收费模型</p></div>
 </section></div></div>
}
