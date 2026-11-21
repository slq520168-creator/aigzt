import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router"
import { ArrowUp, BookOpen, Bot, BrainCircuit, Check, ChevronRight, Clock3, Code2, Compass, Copy, FolderKanban, History, Layers3, LoaderCircle, MessageSquareText, MoreHorizontal, PenLine, Plus, RotateCcw, Search, ShieldCheck, Sparkles, Trash2, WandSparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useEntries,useMe } from "@/lib/tiny"
import { discoverGatewayModels,gatewayComplete } from "@/lib/gateway"
import { type WorkspaceChat,type WorkspaceMessage,type WorkspaceProject,issueText } from "@/lib/workspace"

type Mode = "general"|"creative"|"code"|"analysis"|"translate"
const tools: {id:Mode;label:string;detail:string;prompt:string;icon:typeof Sparkles}[] = [
 {id:"general",label:"自由对话",detail:"头脑风暴与问答",prompt:"帮我梳理一下这个想法，并给出可执行的步骤。",icon:MessageSquareText},
 {id:"creative",label:"创意写作",detail:"文案 · 脚本 · 灵感",prompt:"请帮我构思一份高质量的创作方案，包含定位、结构和示例。",icon:PenLine},
 {id:"code",label:"编程开发",detail:"代码 · 架构 · 排错",prompt:"请针对下面的开发需求，提供完整实现和测试方案：",icon:Code2},
 {id:"analysis",label:"深度分析",detail:"研究 · 比较 · 规划",prompt:"请分析以下问题的根因、方案、风险和验证方法：",icon:BrainCircuit},
 {id:"translate",label:"精准翻译",detail:"中外文多语言",prompt:"请准确翻译下面的内容，保留原格式和语气：",icon:BookOpen},
]
const taskRules:Record<Mode,string> = {
 general:"回答准确、清晰、具体，给出可执行结论。",
 creative:"你是创作助手。产出能直接使用的创意文案，尊重目标受众和风格。",
 code:"你是工程助手。给出可维护的代码、异常处理、测试与回滚计划；不假装代码已运行。",
 analysis:"分析根因、证据、替代方案和验证步骤；没有实时信息时明确说明，禁止虚构联网结果。",
 translate:"你是专业译者。准确保留事实、术语、语气、段落格式，不增加原文没有的信息。",
}
type SessionPending={key:string;messages:WorkspaceMessage[]}

export default function Home() {
 const me=useMe()
 const {entries,error:chatsError}=useEntries<WorkspaceChat>("chat:",{order:"-$updated_at",limit:50})
 const {entries:projects}=useEntries<WorkspaceProject>("project:",{order:"-$updated_at",limit:50})
 const [selected,setSelected]=useState<string|null>(null)
 const [projectForNew,setProjectForNew]=useState<string|null>(null)
 const [modeForNew,setModeForNew]=useState<Mode>("general")
 const [draft,setDraft]=useState("")
 const [busy,setBusy]=useState(false)
 const [notice,setNotice]=useState("")
 const [showHistory,setShowHistory]=useState(false)
 const [deleteConfirm,setDeleteConfirm]=useState(false)
 const [engine,setEngine]=useState<"native"|"gateway">("native")
 const [gatewayReady,setGatewayReady]=useState(false)
 const [gatewayModels,setGatewayModels]=useState(0)
 const [checking,setChecking]=useState(false)
 const [strategy,setStrategy]=useState("auto")
 const [search,setSearch]=useState("")
 const [pending,setPending]=useState<SessionPending|null>(null)
 const chatScroll=useRef<HTMLDivElement>(null)
 const editor=useRef<HTMLTextAreaElement>(null)
 const current=entries?.find(e=>e.key===selected)
 const projectId=selected ? current?.value.projectId??null : projectForNew
 const selectedProject=projects?.find(e=>e.key===projectId)
 const activeMode=(current?.value.mode as Mode|undefined)??modeForNew
 const visibleMessages=pending&&pending.key===selected&&(current?.value.messages?.length??0)<pending.messages.length ? pending.messages : current?.value.messages??[]
 const chats=useMemo(()=>entries?.filter(e=>e.value.title.toLowerCase().includes(search.toLowerCase()))??[],[entries,search])
 const quickTools=tools.filter(t=>t.id!=="translate")

 useEffect(()=>{
   if(visibleMessages.length || busy){const el=chatScroll.current;if(el)el.scrollTop=el.scrollHeight}
 },[visibleMessages.length,busy,selected])
 useEffect(()=>{
  if(current&&pending&&pending.key===selected&&current.value.messages.length>=pending.messages.length)setPending(null)
 },[current,pending,selected])
 useEffect(()=>{
  if(!showHistory)return
  function onEscape(e:KeyboardEvent){if(e.key==="Escape")setShowHistory(false)}
  document.addEventListener("keydown",onEscape)
  return ()=>document.removeEventListener("keydown",onEscape)
 },[showHistory])

 function startNew(){setSelected(null);setProjectForNew(null);setModeForNew("general");setDraft("");setPending(null);setNotice("");setShowHistory(false);setDeleteConfirm(false)}
 function openChat(key:string){setSelected(key);setShowHistory(false);setPending(null);setNotice("");setDeleteConfirm(false)}
 function useSuggestion(t:typeof tools[number]){setModeForNew(t.id);setDraft(t.prompt);editor.current?.focus()}
 async function changeMode(m:Mode) {
  setModeForNew(m)
  if(current){try{await tiny.db.set(current.key,{...current.value,mode:m,updatedAt:new Date().toISOString()})}catch(e){setNotice("切换任务模式失败："+issueText(e))}}
 }
 async function chooseProject(id:string|null){
  setNotice("")
  if(current){
   try{await tiny.db.set(current.key,{...current.value,projectId:id??undefined,updatedAt:new Date().toISOString()})}catch(e){setNotice("关联项目失败："+issueText(e))}
  }else setProjectForNew(id)
 }
 async function checkGateway(){
  if(checking)return
  setChecking(true);setNotice("")
  try{const models=await discoverGatewayModels();setGatewayModels(models.length);setGatewayReady(true)}
  catch(e){setGatewayReady(false);setGatewayModels(0);setEngine("native");setNotice("外部模型尚未接入："+issueText(e))}
  finally{setChecking(false)}
 }
 async function ask(messages:WorkspaceMessage[],mode:Mode,project?:string){
  const context=projects?.find(p=>p.key===project)?.value.context
  const system="你是 AIGZT AI 统一工作台的中文助手。"+taskRules[mode]+"不得声称使用了未连接的模型或外部服务。"+(context?"\n当前项目共享上下文：\n"+context.slice(0,12000):"")
  if(engine==="gateway"){
   if(!gatewayReady)throw new Error("请先验证 FreeLLMAPI 网关")
   const res=await gatewayComplete(messages,system,strategy)
   return {role:"assistant" as const,content:res.content,model:res.route}
  }
  const history=messages.slice(-18).map(m=>m.role+": "+m.content.slice(0,10000)).join("\n\n")
  const res=await tiny.ai.generate(history,{system})
  return {role:"assistant" as const,content:typeof res==="string"?res:JSON.stringify(res),model:"平台内置 AI"}
 }
 async function send(){
  const input=draft.trim()
  if(!input||busy||!me)return
  setBusy(true);setNotice("")
  const key=selected||"chat:"+crypto.randomUUID()
  const old=current?.value
  const messages:WorkspaceMessage[]=[...(old?.messages||[]),{role:"user",content:input}]
  const title=old?.title||input.slice(0,32)
  const mode=(old?.mode as Mode|undefined)??modeForNew
  const linked=old?.projectId??projectForNew??undefined
  setSelected(key)
  setPending({key,messages})
  try {
   if(JSON.stringify(messages).length>210000)throw new Error("对话内容接近存储上限，请新开对话并继续使用项目记忆")
   await tiny.db.set(key,{title,messages,updatedAt:new Date().toISOString(),projectId:linked,mode})
   setDraft("")
   const response=await ask(messages,mode,linked)
   const next=[...messages,response]
   if(JSON.stringify(next).length>210000)throw new Error("回复超出单会话容量，请新开对话继续")
   await tiny.db.set(key,{title,messages:next,updatedAt:new Date().toISOString(),projectId:linked,mode})
  }catch(e){setNotice("本次请求未完成："+issueText(e))}
  finally{setBusy(false)}
 }
 async function retry(){
  if(!current||busy||!me||current.value.messages.at(-1)?.role!=="user")return
  setBusy(true);setNotice("")
  try{
   const response=await ask(current.value.messages,((current.value.mode as Mode|undefined)??"general"),current.value.projectId)
   await tiny.db.set(current.key,{...current.value,messages:[...current.value.messages,response],updatedAt:new Date().toISOString()})
  }catch(e){setNotice("重试失败："+issueText(e))}
  finally{setBusy(false)}
 }
 async function remove(){
  if(!selected||!deleteConfirm)return
  try{await tiny.db.delete(selected);startNew()}catch(e){setNotice("删除失败："+issueText(e))}
 }
 async function copyMessage(content:string){
  try{await navigator.clipboard.writeText(content);setNotice("内容已复制")}catch(e){setNotice("复制失败："+issueText(e))}
 }
 const histories=<>
  <div className="mb-4 flex items-center justify-between gap-2">
   <div><h2 className="font-semibold">最近会话</h2><p className="mt-0.5 text-[11px] text-muted-foreground">云端自动同步</p></div>
   <Button size="icon" variant="secondary" aria-label="新对话" onClick={startNew}><Plus className="size-4"/></Button>
  </div>
  <div className="relative mb-3"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} className="h-10 rounded-xl bg-background/40 pl-9" placeholder="搜索会话…" aria-label="搜索会话"/></div>
  {chatsError?<p role="alert" className="text-xs text-destructive">读取失败：{issueText(chatsError)}</p>:entries===undefined?<p className="text-xs text-muted-foreground">正在同步会话…</p>:chats.length===0?<p className="py-4 text-xs text-muted-foreground">暂无匹配的会话</p>:<div className="workspace-scroll space-y-1 overflow-y-auto lg:max-h-[53vh]">
   {chats.map(e=><Button key={e.key} variant="ghost" onClick={()=>openChat(e.key)}
    className={"h-auto min-h-11 w-full justify-start gap-3 rounded-xl px-3 py-3 text-left "+(selected===e.key?"bg-primary/13 text-primary":"text-muted-foreground")}>
    <MessageSquareText className="size-4 shrink-0"/><span className="min-w-0 flex-1 truncate text-[13px] font-medium">{e.value.title}</span>
   </Button>)}
  </div>}
 </>

 return <div className="space-y-4 sm:space-y-5">
  <div className="flex items-center justify-between gap-3">
   <div className="min-w-0">
    <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-primary"><span className="size-1.5 rounded-full bg-primary"/>AIGZT / AI WORKSPACE</div>
    <h1 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[30px]">一个空间，连接你的 AI</h1>
    <p className="mt-1 text-[12px] text-muted-foreground sm:text-sm">对话、写作、开发与项目资料集中管理</p>
   </div>
   <Button variant="outline" onClick={()=>setShowHistory(true)} className="h-10 shrink-0 rounded-xl lg:hidden"><History className="size-4"/>会话</Button>
  </div>

  <div className="grid gap-3 sm:grid-cols-3">
   <div className="workspace-surface flex min-w-0 items-center gap-3 rounded-2xl p-3 sm:p-4">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary"><Bot className="size-5"/></span>
    <div className="min-w-0"><p className="text-[11px] text-muted-foreground">当前对话引擎</p><p className="truncate text-sm font-semibold">{engine==="native"?"平台内置 AI":"FreeLLMAPI"}</p><p className="mt-0.5 text-[10px] text-primary">{engine==="native"?"已接入 · 可直接对话":"网关已通过检测"}</p></div>
   </div>
   <div className="workspace-surface hidden min-w-0 items-center gap-3 rounded-2xl p-3 sm:flex sm:p-4">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-foreground"><Layers3 className="size-5"/></span>
    <div><p className="text-[11px] text-muted-foreground">外部模型网关</p><p className="text-sm font-semibold">{gatewayReady?gatewayModels+" 个已发现":"尚未验证"}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{gatewayReady?"可选择智能调度":"需配置独立网关"}</p></div>
   </div>
   <div className="workspace-surface hidden min-w-0 items-center gap-3 rounded-2xl p-3 sm:flex sm:p-4">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-foreground"><FolderKanban className="size-5"/></span>
    <div><p className="text-[11px] text-muted-foreground">项目工作空间</p><p className="text-sm font-semibold">{projects?.length??"—"} 个已保存项目</p><p className="mt-0.5 text-[10px] text-muted-foreground">同一份上下文跨设备</p></div>
   </div>
  </div>

  <div className="grid items-start gap-4 lg:grid-cols-[225px_minmax(0,1fr)] xl:grid-cols-[225px_minmax(0,1fr)_240px]">
   <aside className="workspace-surface sticky top-[90px] hidden min-h-[570px] rounded-2xl p-3 lg:block">
    {histories}
    <div className="mt-5 border-t border-border/70 px-2 pt-4">
      <Link className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary" to="/projects"><FolderKanban className="size-4"/>项目空间<ChevronRight className="ml-auto size-4"/></Link>
    </div>
   </aside>

   <section className="workspace-surface flex min-w-0 flex-col overflow-hidden rounded-[22px]">
    <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3.5 sm:px-5">
     <div className="min-w-0"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary"/><span className="truncate text-[13px] font-semibold sm:text-sm">{current?.value.title||"新建对话"}</span></div><p className="ml-4 mt-0.5 text-[10px] text-muted-foreground">选择任务模式，开始使用你的 AI 工具箱</p></div>
     <div className="flex items-center gap-1">
      {selected&&(deleteConfirm?<><span className="text-[11px] text-destructive">删除会话？</span><Button size="sm" variant="outline" onClick={()=>setDeleteConfirm(false)}>取消</Button><Button size="sm" variant="destructive" onClick={()=>void remove()}>删除</Button></>:<Button size="icon" variant="ghost" aria-label="删除会话" onClick={()=>setDeleteConfirm(true)}><Trash2 className="size-4"/></Button>)}
      <Button size="icon" variant="secondary" aria-label="新建对话" onClick={startNew} className="rounded-lg"><Plus className="size-4"/></Button>
     </div>
    </div>
    <div className="workspace-scroll flex items-center gap-2 overflow-x-auto border-b border-border/60 px-3 py-3 sm:px-5">
     <span className="shrink-0 text-[11px] text-muted-foreground">引擎</span>
     <Button size="sm" variant={engine==="native"?"default":"secondary"} onClick={()=>setEngine("native")} className="h-8 shrink-0 rounded-lg text-xs"><Check className="size-3"/>内置 AI</Button>
     <Button size="sm" variant={engine==="gateway"?"default":"secondary"} disabled={!gatewayReady} onClick={()=>setEngine("gateway")} className="h-8 shrink-0 rounded-lg text-xs"><Sparkles className="size-3"/>FreeLLMAPI</Button>
     <Button size="sm" variant="ghost" disabled={checking} onClick={()=>void checkGateway()} className="h-8 shrink-0 text-xs">{checking?"连接检测中…":gatewayReady?"重新检测":"连接网关"}<ChevronRight className="size-3"/></Button>
    </div>
    <div className="workspace-scroll flex items-center gap-2 overflow-x-auto border-b border-border/60 px-3 py-2.5 sm:px-5">
     <span className="shrink-0 text-[11px] text-muted-foreground">任务</span>
     {tools.map(t=><Button key={t.id} size="sm" variant={activeMode===t.id?"secondary":"ghost"} className={"h-8 shrink-0 rounded-lg px-3 text-[11px] "+(activeMode===t.id?"text-foreground":"text-muted-foreground")} onClick={()=>void changeMode(t.id)}>{t.label}</Button>)}
    </div>

    <div ref={chatScroll} className="workspace-scroll min-h-[360px] flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:min-h-[480px] sm:px-6">
     {visibleMessages.length===0&&!busy?<div className="space-y-5 py-1 sm:py-5">
      <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/13 text-primary"><WandSparkles className="size-6"/></span><div><h2 className="text-lg font-semibold sm:text-xl">今天想完成什么？</h2><p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">选择任务即可开始。会话和项目资料自动保留，手机与电脑可接续使用。</p></div></div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">{quickTools.map(t=>{const Icon=t.icon;return <Button key={t.id} variant="outline" onClick={()=>useSuggestion(t)} className="workspace-button h-auto min-h-[102px] flex-col items-start justify-between rounded-2xl border-border/75 bg-card p-3.5 text-left hover:border-primary/40 hover:bg-primary/7 sm:min-h-[115px] sm:p-4">
       <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4.5"/></span>
       <span className="block w-full"><span className="block text-[13px] font-semibold sm:text-sm">{t.label}</span><span className="mt-0.5 block text-[10px] font-normal text-muted-foreground sm:text-xs">{t.detail}</span></span>
      </Button>})}</div>
      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/50 px-3 py-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary"/>不伪造第三方额度或模型调用</span><Link to="/directory" className="flex items-center gap-1 font-medium text-primary">模型中心<ChevronRight className="size-3.5"/></Link></div>
     </div>:visibleMessages.map((m,i)=><div key={i} className={"flex "+(m.role==="user"?"justify-end":"justify-start")}>
      <div className={"max-w-[96%] rounded-2xl px-3.5 py-3 text-[13px] leading-6 sm:max-w-[90%] sm:px-4 sm:text-sm "+(m.role==="user"?"rounded-tr-sm bg-primary text-primary-foreground":"rounded-tl-sm bg-muted/70 text-foreground")}>
       <div className="whitespace-pre-wrap break-words">{m.content}</div>
       {m.role==="assistant"&&<div className="mt-2 flex items-center gap-2 border-t border-border/60 pt-2 text-[10px] text-muted-foreground"><span className="truncate">{m.model??"AI 助手"}</span><Button size="icon" variant="ghost" aria-label="复制回复" className="ml-auto size-7" onClick={()=>void copyMessage(m.content)}><Copy className="size-3.5"/></Button></div>}
      </div>
     </div>)}
     {busy&&<div className="flex items-center gap-2 rounded-xl px-2 py-3 text-xs text-muted-foreground"><LoaderCircle className="size-4 animate-spin text-primary"/>正在生成回复…</div>}
    </div>
    <div className="space-y-2 border-t border-border/70 bg-card p-3 sm:p-4">
     <div className="workspace-scroll flex items-center gap-2 overflow-x-auto pb-1"><span className="shrink-0 text-[11px] text-muted-foreground"><FolderKanban className="mr-1 inline size-3.5"/>项目</span><Button size="sm" variant={!projectId?"secondary":"ghost"} className="h-7 shrink-0 rounded-lg text-[11px]" onClick={()=>void chooseProject(null)}>未关联</Button>{projects?.slice(0,5).map(p=><Button key={p.key} size="sm" variant={projectId===p.key?"secondary":"ghost"} className="h-7 max-w-36 shrink-0 rounded-lg text-[11px]" onClick={()=>void chooseProject(p.key)}><span className="truncate">{p.value.name}</span></Button>)}<Link to="/projects" className="ml-auto shrink-0 text-[11px] font-medium text-primary">管理项目</Link></div>
     {engine==="gateway"&&<div className="flex items-center gap-1 overflow-x-auto py-1">{[["auto","智能调度"],["auto:fast","快速优先"],["auto:smart","深度优先"]].map(([v,label])=><Button key={v} size="sm" variant={strategy===v?"secondary":"ghost"} className="h-7 shrink-0 text-[11px]" onClick={()=>setStrategy(v)}>{label}</Button>)}</div>}
     {notice&&<div role="alert" className="flex flex-wrap items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-[11px] text-foreground"><span className="flex-1">{notice}</span><Button size="icon" variant="ghost" aria-label="关闭消息" onClick={()=>setNotice("")} className="size-6"><X className="size-3"/></Button></div>}
     {current?.value.messages.at(-1)?.role==="user"&&!busy&&<Button variant="outline" size="sm" className="h-8 text-xs" onClick={()=>void retry()}><RotateCcw className="size-3.5"/>重试回复</Button>}
     <form onSubmit={e=>{e.preventDefault();void send()}} className="flex items-end gap-2 rounded-2xl border border-border bg-background/45 p-2 focus-within:border-primary/50">
      <Textarea ref={editor} aria-label="输入聊天内容" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void send()}}} placeholder={me?"给 AI 发送消息，Shift + Enter 换行…":"请先登录工作台"} disabled={!me||busy} className="workspace-editor min-h-11 flex-1 resize-none border-0 bg-transparent p-2 text-[14px] shadow-none focus-visible:border-0 focus-visible:ring-0"/>
      <Button size="icon" type="submit" aria-label="发送消息" disabled={!me||busy||!draft.trim()} className="size-10 shrink-0 rounded-xl"><ArrowUp className="size-5"/></Button>
     </form>
     <p className="flex items-center justify-between gap-2 px-1 text-[10px] text-muted-foreground"><span>{engine==="native"?"平台内置 AI":"FreeLLMAPI · "+strategy}{selectedProject?" · "+selectedProject.value.name:""}</span><span>自动保存会话</span></p>
    </div>
   </section>

   <aside className="sticky top-[90px] hidden space-y-4 xl:block">
    <section className="workspace-surface space-y-4 rounded-2xl p-4">
      <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">模型路由</h2><Compass className="size-4 text-primary"/></div>
      <div className="rounded-xl bg-primary/10 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-primary"/>平台内置 AI</div><p className="mt-1.5 text-[11px] text-muted-foreground">已集成 · 无需额外密钥</p></div>
      <div className="rounded-xl bg-muted/60 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-muted-foreground"/>FreeLLMAPI</div><p className="mt-1.5 text-[11px] text-muted-foreground">{gatewayReady?gatewayModels+" 个模型已发现":"待配置真实网关"}</p></div>
      <Button onClick={()=>void checkGateway()} disabled={checking} variant="outline" className="w-full rounded-xl text-xs">{checking?"检测中…":"检测外部网关"}<ChevronRight className="size-3.5"/></Button>
    </section>
    <section className="workspace-surface space-y-3 rounded-2xl p-4">
      <h2 className="text-sm font-semibold">当前项目</h2>
      <p className="text-xs font-medium">{selectedProject?.value.name??"未关联项目"}</p>
      <p className="line-clamp-5 whitespace-pre-wrap break-words text-[11px] leading-5 text-muted-foreground">{selectedProject?.value.context??"将长期规则与项目资料保存到「项目」，下次打开对话仍可继续。"} </p>
      <Link to="/projects" className="inline-flex items-center gap-1 text-xs font-medium text-primary">管理项目记忆<ChevronRight className="size-3.5"/></Link>
    </section>
    <section className="space-y-2 px-1 text-[11px] text-muted-foreground"><p className="flex items-center gap-2"><ShieldCheck className="size-3.5"/>第三方模型未授权不会被调用</p><p className="flex items-center gap-2"><Clock3 className="size-3.5"/>不后台轮询额度</p></section>
   </aside>
  </div>

  {showHistory&&<div className="fixed inset-0 z-50 lg:hidden" role="presentation">
    <button className="absolute inset-0 bg-background/75 backdrop-blur-sm" aria-label="关闭历史会话" onClick={()=>setShowHistory(false)}/>
    <section role="dialog" aria-modal="true" aria-label="历史会话" className="absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col overflow-hidden border-r bg-card p-4 shadow-2xl">
      <div className="mb-5 flex items-center justify-between"><span className="text-lg font-bold">会话中心</span><Button variant="ghost" size="icon" aria-label="关闭" onClick={()=>setShowHistory(false)}><X className="size-4"/></Button></div>
      {histories}
    </section>
   </div>}
 </div>
}
