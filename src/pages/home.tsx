import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router"
import { ArrowUp, BookOpen, Bot, BrainCircuit, Check, ChevronRight, Clock3, Code2, Compass, Copy, FolderKanban, History, ImagePlus, Image as ImageIcon, Layers3, LoaderCircle, MessageSquareText, MoreHorizontal, PenLine, Plus, ChevronDown, RotateCcw, Search, ShieldCheck, Sparkles, Trash2, WandSparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useEntries,useMe } from "@/lib/tiny"
import { discoverGatewayModels,gatewayComplete,type GatewayModel } from "@/lib/gateway"
import { type WorkspaceChat,type WorkspaceMessage,type WorkspaceProject,type ChatAttachment,issueText } from "@/lib/workspace"

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
 const [inputFocused,setInputFocused]=useState(false)
 const [busy,setBusy]=useState(false)
 const [notice,setNotice]=useState("")
 const [showHistory,setShowHistory]=useState(false)
 const [deleteConfirm,setDeleteConfirm]=useState(false)
 const [engine,setEngine]=useState<"native"|"gateway">("native")
 const [gatewayReady,setGatewayReady]=useState(false)
 const [gatewayModels,setGatewayModels]=useState<GatewayModel[]>([])
 const [showModels,setShowModels]=useState(false)
 const [modelQuery,setModelQuery]=useState("")
 const [selectedImages,setSelectedImages]=useState<File[]>([])
 const [converting,setConverting]=useState(false)
 const [uploading,setUploading]=useState("")
 const [streaming,setStreaming]=useState<{key:string;text:string}|null>(null)
 const [checking,setChecking]=useState(false)
 const [strategy,setStrategy]=useState("auto")
 const [search,setSearch]=useState("")
 const [pending,setPending]=useState<SessionPending|null>(null)
 const chatScroll=useRef<HTMLDivElement>(null)
 const editor=useRef<HTMLTextAreaElement>(null)
 const imageInput=useRef<HTMLInputElement>(null)
 const inFlight=useRef(false)
 const current=entries?.find(e=>e.key===selected)
 const projectId=selected ? current?.value.projectId??null : projectForNew
 const selectedProject=projects?.find(e=>e.key===projectId)
 const activeMode=(current?.value.mode as Mode|undefined)??modeForNew
 const visibleMessages=pending&&pending.key===selected&&(current?.value.messages?.length??0)<pending.messages.length ? pending.messages : current?.value.messages??[]
 const chats=useMemo(()=>entries?.filter(e=>e.value.title.toLowerCase().includes(search.toLowerCase()))??[],[entries,search])
 const quickTools=tools.filter(t=>t.id!=="translate")
 const chatActive=Boolean(selected||inputFocused||draft.trim()||selectedImages.length||busy)
 const matchedModels=gatewayModels.filter(m=>m.id.toLowerCase().includes(modelQuery.toLowerCase()))

 useEffect(()=>{
   if(visibleMessages.length || busy){const el=chatScroll.current;if(el)el.scrollTop=el.scrollHeight}
 },[visibleMessages.length,busy,selected,streaming?.text.length])
 useEffect(()=>{
  // iOS WebKit scrolls the visual viewport separately from the layout viewport.
  // Keep one pinned chat shell sized and positioned to the actually visible area.
  const viewport=window.visualViewport
  const root=document.documentElement
  let raf=0
  function measure(){
   if(raf)cancelAnimationFrame(raf)
   raf=requestAnimationFrame(()=>{
    const height=viewport?.height??window.innerHeight
    const top=viewport?.offsetTop??0
    if(height>0){
     root.style.setProperty("--aigzt-visible-height",Math.round(height)+"px")
     root.style.setProperty("--aigzt-viewport-offset",Math.max(0,Math.round(top))+"px")
    }
   })
  }
  measure()
  viewport?.addEventListener("resize",measure)
  viewport?.addEventListener("scroll",measure)
  window.addEventListener("resize",measure)
  window.addEventListener("orientationchange",measure)
  return ()=>{
   if(raf)cancelAnimationFrame(raf)
   viewport?.removeEventListener("resize",measure)
   viewport?.removeEventListener("scroll",measure)
   window.removeEventListener("resize",measure)
   window.removeEventListener("orientationchange",measure)
   root.style.removeProperty("--aigzt-visible-height")
   root.style.removeProperty("--aigzt-viewport-offset")
  }
 },[])
 useEffect(()=>{
  if(current&&pending&&pending.key===selected&&current.value.messages.length>=pending.messages.length)setPending(null)
 },[current,pending,selected])
 useEffect(()=>{
  if(!showHistory)return
  function onEscape(e:KeyboardEvent){if(e.key==="Escape")setShowHistory(false)}
  document.addEventListener("keydown",onEscape)
  return ()=>document.removeEventListener("keydown",onEscape)
 },[showHistory])

 function startNew(){setSelected(null);setProjectForNew(null);setModeForNew("general");setDraft("");setSelectedImages([]);setPending(null);setStreaming(null);setNotice("");setShowHistory(false);setDeleteConfirm(false)}
 function openChat(key:string){const v=entries?.find(e=>e.key===key)?.value;setSelected(key);setShowHistory(false);setPending(null);setStreaming(null);setSelectedImages([]);setNotice("");setDeleteConfirm(false);setEngine(v?.engine==="gateway"&&gatewayReady?"gateway":"native");setStrategy(v?.modelChoice??"auto")}
 function useSuggestion(t:typeof tools[number]){setModeForNew(t.id);setDraft(t.prompt);editor.current?.focus()}
 async function changeMode(m:Mode) {
  if(inFlight.current)return
  setModeForNew(m)
  if(current){try{await tiny.db.set(current.key,{...current.value,mode:m,updatedAt:new Date().toISOString()})}catch(e){setNotice("切换任务模式失败："+issueText(e))}}
 }
 async function chooseProject(id:string|null){
  if(inFlight.current)return
  setNotice("")
  if(current){
   try{await tiny.db.set(current.key,{...current.value,projectId:id??undefined,updatedAt:new Date().toISOString()})}catch(e){setNotice("关联项目失败："+issueText(e))}
  }else setProjectForNew(id)
 }
 async function checkGateway(){
  if(checking)return
  setChecking(true);setNotice("")
  try{const models=await discoverGatewayModels();setGatewayModels(models);setGatewayReady(true)}
  catch(e){setGatewayReady(false);setGatewayModels([]);setEngine("native");setNotice("外部模型尚未接入："+issueText(e))}
  finally{setChecking(false)}
 }
 async function normalizeImage(file:File):Promise<File>{
  if(!(/\.(heic|heif)$/i.test(file.name)||/image\/hei[cf]/i.test(file.type)))return file
  const url=URL.createObjectURL(file)
  try {
   const image=new Image()
   image.src=url
   await image.decode()
   const scale=Math.min(1,2048/Math.max(image.naturalWidth,image.naturalHeight))
   const canvas=document.createElement("canvas")
   canvas.width=Math.round(image.naturalWidth*scale)
   canvas.height=Math.round(image.naturalHeight*scale)
   const ctx=canvas.getContext("2d")
   if(!ctx)throw Error("设备未提供图片转换能力")
   ctx.drawImage(image,0,0,canvas.width,canvas.height)
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error("图片转换失败")),"image/jpeg",.82))
   return new File([blob],file.name.replace(/\.(heic|heif)$/i,".jpg"),{type:"image/jpeg"})
  }catch{throw Error("此 HEIC 图片无法自动转换，请先在照片中导出 JPEG")}
  finally{URL.revokeObjectURL(url)}
 }
 async function addImages(list:FileList|null){
  if(!list||converting)return
  const incoming=Array.from(list)
  if(selectedImages.length+incoming.length>4){setNotice("一次最多上传 4 张图片");return}
  setConverting(true);setNotice("")
  try {
   const normalized=await Promise.all(incoming.map(normalizeImage))
   for(const x of normalized){
    if(!["image/jpeg","image/png","image/webp","image/gif"].includes(x.type))throw Error("图片仅支持 JPEG/PNG/WebP/GIF")
    if(x.size>5_000_000)throw Error("单张图片最多 5 MB")
   }
   setSelectedImages(prev=>[...prev,...normalized])
  }catch(e){setNotice("添加图片失败："+issueText(e))}
  finally{setConverting(false);if(imageInput.current)imageInput.current.value=""}
 }
 function chooseModel(id:string){setEngine("gateway");setStrategy(id);setShowModels(false)}
 async function ask(messages:WorkspaceMessage[],mode:Mode,requestKey:string,project?:string){
  const context=projects?.find(p=>p.key===project)?.value.context
  const system="你是 AIGZT AI 统一工作台的中文助手。"+taskRules[mode]+"不得声称使用了未连接的模型或外部服务。"+(context?"\n当前项目共享上下文：\n"+context.slice(0,12000):"")
  if(engine==="gateway"){
   if(!gatewayReady)throw new Error("请先验证 FreeLLMAPI 网关")
   const res=await gatewayComplete(messages,system,strategy)
   return {role:"assistant" as const,content:res.content,model:res.route}
  }
  const history=messages.slice(-18).map(m=>m.role+": "+m.content.slice(0,10000)).join("\n\n")
  const images=messages.at(-1)?.role==="user"?messages.at(-1)?.attachments?.map(a=>a.id)??[]:[]
  let content="",updated=0
  for await(const chunk of tiny.ai.stream(history,{system,images})){
   content+=chunk
   if(Date.now()-updated>70){setStreaming({key:requestKey,text:content});updated=Date.now()}
  }
  if(!content.trim())throw Error("AI 未返回有效回复，请重试")
  setStreaming({key:requestKey,text:content})
  return {role:"assistant" as const,content,model:"平台内置 AI"}
 }
 async function send(){
  const input=draft.trim()
  if((!input&&!selectedImages.length)||busy||inFlight.current||converting||!me)return
  inFlight.current=true;setBusy(true);setNotice("")
  const key=selected||"chat:"+crypto.randomUUID()
  const old=current?.value
  const mode=(old?.mode as Mode|undefined)??modeForNew
  const title=old?.title||input.slice(0,32)||"图片分析"
  const linked=old?.projectId??projectForNew??undefined
  const freshFiles=[...selectedImages]
  const uploaded:ChatAttachment[]=[]
  let saved=false
  try{
   if(engine==="gateway"&&freshFiles.length)throw Error("当前网关只连接文本模型，请切换内置 AI 分析图片")
   for(let i=0;i<freshFiles.length;i++){
    setUploading("正在上传图片 "+(i+1)+"/"+freshFiles.length)
    const file=freshFiles[i]
    const result=await tiny.files.put(file)
    uploaded.push({id:result.id,name:file.name,size:file.size,type:file.type})
   }
   setUploading("")
   const messages:WorkspaceMessage[]=[...(old?.messages||[]),{role:"user",content:input||"请分析这些图片",attachments:uploaded.length?uploaded:undefined}]
   if(JSON.stringify(messages).length>210000)throw Error("会话接近存储上限，请新开对话")
   await tiny.db.set(key,{title,messages,updatedAt:new Date().toISOString(),projectId:linked,mode,engine,modelChoice:strategy})
   saved=true;setSelected(key);setPending({key,messages});setDraft("");setSelectedImages([])
   const result=await ask(messages,mode,key,linked)
   const next=[...messages,result]
   if(JSON.stringify(next).length>210000)throw Error("回复超过会话存储上限，请新开对话")
   await tiny.db.set(key,{title,messages:next,updatedAt:new Date().toISOString(),projectId:linked,mode,engine,modelChoice:strategy})
  }catch(e){
   if(!saved)for(const file of uploaded){try{await tiny.files.delete(file.id)}catch{/* cleanup attempted */}}
   setNotice("本次请求未完成："+issueText(e))
  }finally{inFlight.current=false;setBusy(false);setUploading("");setStreaming(null)}
 }
 async function retry(){
  if(!current||busy||inFlight.current||!me||current.value.messages.at(-1)?.role!=="user")return
  inFlight.current=true;setBusy(true);setNotice("")
  try{
   const response=await ask(current.value.messages,((current.value.mode as Mode|undefined)??"general"),current.key,current.value.projectId)
   await tiny.db.set(current.key,{...current.value,messages:[...current.value.messages,response],updatedAt:new Date().toISOString()})
  }catch(e){setNotice("重试失败："+issueText(e))}
  finally{inFlight.current=false;setBusy(false);setStreaming(null)}
 }
 async function remove(){
  if(!selected||!deleteConfirm)return
  const attachments=current?.value.messages.flatMap(m=>m.attachments??[])??[]
  try{
   await tiny.db.delete(selected)
   let failed=0
   for(const a of attachments){try{await tiny.files.delete(a.id)}catch{failed++}}
   startNew()
   if(failed)setNotice("对话已删除，部分图片清理失败（"+failed+"张）")
  }catch(e){setNotice("删除失败："+issueText(e))}
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

 return <div className={"aigzt-chat-home "+(chatActive?"aigzt-chat-active ":"")+"space-y-3 sm:space-y-5"}>
  <div className={(chatActive?"hidden lg:flex":"flex")+" items-center justify-between gap-3"}>
   <div className="min-w-0">
    <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-primary"><span className="size-1.5 rounded-full bg-primary"/>AIGZT / AI WORKSPACE</div>
    <h1 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[30px]">一个空间，连接你的 AI</h1>
    <p className="mt-1 text-[12px] text-muted-foreground sm:text-sm">对话、写作、开发与项目资料集中管理</p>
   </div>
   <Button variant="outline" onClick={()=>setShowHistory(true)} className="h-10 shrink-0 rounded-xl lg:hidden"><History className="size-4"/>会话</Button>
  </div>

  <div className="hidden gap-3 lg:grid lg:grid-cols-3">
   <div className="workspace-surface flex min-w-0 items-center gap-3 rounded-2xl p-3 sm:p-4">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary"><Bot className="size-5"/></span>
    <div className="min-w-0"><p className="text-[11px] text-muted-foreground">当前对话引擎</p><p className="truncate text-sm font-semibold">{engine==="native"?"平台内置 AI":"FreeLLMAPI"}</p><p className="mt-0.5 text-[10px] text-primary">{engine==="native"?"已接入 · 可直接对话":"网关已通过检测"}</p></div>
   </div>
   <div className="workspace-surface hidden min-w-0 items-center gap-3 rounded-2xl p-3 sm:flex sm:p-4">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-foreground"><Layers3 className="size-5"/></span>
    <div><p className="text-[11px] text-muted-foreground">外部模型网关</p><p className="text-sm font-semibold">{gatewayReady?gatewayModels.length+" 个已发现":"尚未验证"}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{gatewayReady?"可选择智能调度":"需配置独立网关"}</p></div>
   </div>
   <div className="workspace-surface hidden min-w-0 items-center gap-3 rounded-2xl p-3 sm:flex sm:p-4">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-foreground"><FolderKanban className="size-5"/></span>
    <div><p className="text-[11px] text-muted-foreground">项目工作空间</p><p className="text-sm font-semibold">{projects?.length??"—"} 个已保存项目</p><p className="mt-0.5 text-[10px] text-muted-foreground">同一份上下文跨设备</p></div>
   </div>
  </div>

  <div className="aigzt-chat-layout grid min-h-0 items-start gap-4 lg:grid-cols-[225px_minmax(0,1fr)] xl:grid-cols-[225px_minmax(0,1fr)_240px]">
   <aside className="workspace-surface sticky top-[90px] hidden min-h-[570px] rounded-2xl p-3 lg:block">
    {histories}
    <div className="mt-5 border-t border-border/70 px-2 pt-4">
      <Link className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary" to="/projects"><FolderKanban className="size-4"/>项目空间<ChevronRight className="ml-auto size-4"/></Link>
    </div>
   </aside>

   <section className={"aigzt-chat-card workspace-surface flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[22px] "+(chatActive?"h-[calc(100dvh-172px)]":"h-[calc(100dvh-250px)] min-h-[455px]")+" lg:h-[calc(100dvh-222px)] lg:min-h-[525px]"}>
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/70 px-4 py-2.5 sm:px-5 sm:py-3.5">
     <div className="min-w-0"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary"/><span className="truncate text-[13px] font-semibold sm:text-sm">{current?.value.title||"新建对话"}</span></div><p className="ml-4 mt-0.5 text-[10px] text-muted-foreground">选择任务模式，开始使用你的 AI 工具箱</p></div>
     <div className="flex items-center gap-1">
      {selected&&(deleteConfirm?<><span className="text-[11px] text-destructive">删除会话？</span><Button size="sm" variant="outline" onClick={()=>setDeleteConfirm(false)}>取消</Button><Button size="sm" variant="destructive" onClick={()=>void remove()}>删除</Button></>:<Button size="icon" variant="ghost" aria-label="删除会话" onClick={()=>setDeleteConfirm(true)}><Trash2 className="size-4"/></Button>)}
      <Button size="icon" variant="secondary" aria-label="新建对话" onClick={startNew} className="rounded-lg"><Plus className="size-4"/></Button>
     </div>
    </div>
    <div className="aigzt-chat-tools workspace-scroll flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border/60 px-3 py-2 sm:px-5">
     <span className="shrink-0 text-[11px] text-muted-foreground">引擎</span>
     <Button size="sm" variant={engine==="native"?"default":"secondary"} onClick={()=>setEngine("native")} className="h-8 shrink-0 rounded-lg text-xs"><Check className="size-3"/>内置 AI</Button>
     <Button size="sm" variant={engine==="gateway"?"default":"secondary"} disabled={!gatewayReady} onClick={()=>setEngine("gateway")} className="h-8 shrink-0 rounded-lg text-xs"><Sparkles className="size-3"/>FreeLLMAPI</Button>
     <Button size="sm" variant="ghost" disabled={checking} onClick={()=>void checkGateway()} className="h-8 shrink-0 text-xs">{checking?"连接检测中…":gatewayReady?"重新检测":"连接网关"}<ChevronRight className="size-3"/></Button>
    </div>
    <div className={(chatActive?"flex":"hidden sm:flex")+" aigzt-chat-tools workspace-scroll shrink-0 items-center gap-2 overflow-x-auto border-b border-border/60 px-3 py-1.5 sm:px-5"}>
     <span className="shrink-0 text-[11px] text-muted-foreground">任务</span>
     {tools.map(t=><Button key={t.id} size="sm" variant={activeMode===t.id?"secondary":"ghost"} className={"h-8 shrink-0 rounded-lg px-3 text-[11px] "+(activeMode===t.id?"text-foreground":"text-muted-foreground")} onClick={()=>void changeMode(t.id)}>{t.label}</Button>)}
    </div>

    <div ref={chatScroll} data-chat-messages className="workspace-scroll min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
     {visibleMessages.length===0&&!busy?<div className="space-y-3 py-1 sm:space-y-5 sm:py-5">
      <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/13 text-primary sm:size-11 sm:rounded-2xl"><WandSparkles className="size-6"/></span><div><h2 className="text-base font-semibold sm:text-xl">今天想完成什么？</h2><p className="mt-0.5 text-[11px] leading-5 text-muted-foreground sm:mt-1 sm:text-sm sm:leading-6">选择任务即可开始。会话和项目资料自动保留，手机与电脑可接续使用。</p></div></div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">{quickTools.map(t=>{const Icon=t.icon;return <Button key={t.id} variant="outline" onClick={()=>useSuggestion(t)} className="workspace-button h-auto min-h-[72px] flex-row items-center justify-start gap-2 rounded-xl border-border/75 bg-card p-2.5 text-left hover:border-primary/40 hover:bg-primary/7 sm:min-h-[110px] sm:flex-col sm:items-start sm:justify-between sm:rounded-2xl sm:p-4">
       <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4.5"/></span>
       <span className="block w-full"><span className="block text-[13px] font-semibold sm:text-sm">{t.label}</span><span className="mt-0.5 hidden text-[10px] font-normal text-muted-foreground sm:block sm:text-xs">{t.detail}</span></span>
      </Button>})}</div>
      <div className="hidden items-center justify-between rounded-xl border border-border/70 bg-background/50 px-3 py-3 text-[11px] text-muted-foreground sm:flex"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary"/>不伪造第三方额度或模型调用</span><Link to="/directory" className="flex items-center gap-1 font-medium text-primary">模型中心<ChevronRight className="size-3.5"/></Link></div>
     </div>:visibleMessages.map((m,i)=><div key={i} className={"flex "+(m.role==="user"?"justify-end":"justify-start")}>
      <div className={"max-w-[96%] rounded-2xl px-3.5 py-3 text-[13px] leading-6 sm:max-w-[90%] sm:px-4 sm:text-sm "+(m.role==="user"?"rounded-tr-sm bg-primary text-primary-foreground":"rounded-tl-sm bg-muted/70 text-foreground")}>
       <div className="whitespace-pre-wrap break-words">{m.content}</div>{m.attachments?.length?<div className="mt-2 grid grid-cols-2 gap-2">{m.attachments.map(a=><a key={a.id} href={tiny.files.url(a.id)} target="_blank" rel="noopener noreferrer" aria-label={"查看图片："+a.name} className="block overflow-hidden rounded-lg"><img src={tiny.files.url(a.id)} alt={a.name} loading="lazy" className="h-28 w-full object-cover sm:h-40"/></a>)}</div>:null}
       {m.role==="assistant"&&<div className="mt-2 flex items-center gap-2 border-t border-border/60 pt-2 text-[10px] text-muted-foreground"><span className="truncate">{m.model??"AI 助手"}</span><Button size="icon" variant="ghost" aria-label="复制回复" className="ml-auto size-7" onClick={()=>void copyMessage(m.content)}><Copy className="size-3.5"/></Button></div>}
      </div>
     </div>)}
     {streaming?.key===selected&&streaming.text?<div className="max-w-[96%] whitespace-pre-wrap rounded-2xl bg-muted/70 p-3 text-sm leading-6">{streaming.text}<span className="ml-1 inline-block size-1.5 animate-pulse rounded-full bg-primary"/></div>:busy?<div className="flex items-center gap-2 rounded-xl px-2 py-3 text-xs text-muted-foreground"><LoaderCircle className="size-4 animate-spin text-primary"/>{uploading||"正在生成回复…"}</div>:null}
    </div>
    <div className="aigzt-chat-composer shrink-0 space-y-2 border-t border-border/70 bg-card p-3 sm:p-4">
     <div className="aigzt-chat-tools workspace-scroll flex items-center gap-2 overflow-x-auto pb-1"><span className="shrink-0 text-[11px] text-muted-foreground"><FolderKanban className="mr-1 inline size-3.5"/>项目</span><Button size="sm" variant={!projectId?"secondary":"ghost"} className="h-7 shrink-0 rounded-lg text-[11px]" onClick={()=>void chooseProject(null)}>未关联</Button>{projects?.slice(0,5).map(p=><Button key={p.key} size="sm" variant={projectId===p.key?"secondary":"ghost"} className="h-7 max-w-36 shrink-0 rounded-lg text-[11px]" onClick={()=>void chooseProject(p.key)}><span className="truncate">{p.value.name}</span></Button>)}<Link to="/projects" className="ml-auto shrink-0 text-[11px] font-medium text-primary">管理项目</Link></div>
     {engine==="gateway"&&<div className="flex items-center gap-1 overflow-x-auto py-1"><Button size="sm" variant="secondary" className="h-8 max-w-full shrink-0 text-xs" onClick={()=>setShowModels(true)}><span className="max-w-44 truncate">{strategy==="auto"?"智能调度":strategy==="auto:fast"?"快速优先":strategy==="auto:smart"?"深度优先":strategy}</span><ChevronDown className="size-3"/></Button><span className="text-[11px] text-muted-foreground">选择真实模型</span></div>}
     {selectedImages.length>0&&<div className="flex flex-wrap gap-1.5">{selectedImages.map((file,i)=><span key={i} className="inline-flex max-w-full items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[11px]"><ImageIcon className="size-3.5"/><span className="max-w-28 truncate">{file.name}</span><Button size="icon" variant="ghost" className="size-6" aria-label={"移除图片："+file.name} onClick={()=>setSelectedImages(list=>list.filter((_,j)=>j!==i))}><X className="size-3"/></Button></span>)}</div>}{notice&&<div role="alert" className="flex flex-wrap items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-[11px] text-foreground"><span className="flex-1">{notice}</span><Button size="icon" variant="ghost" aria-label="关闭消息" onClick={()=>setNotice("")} className="size-6"><X className="size-3"/></Button></div>}
     {current?.value.messages.at(-1)?.role==="user"&&!busy&&<Button variant="outline" size="sm" className="h-8 text-xs" onClick={()=>void retry()}><RotateCcw className="size-3.5"/>重试回复</Button>}
     <form onSubmit={e=>{e.preventDefault();void send()}} className="flex items-end gap-1 rounded-2xl border border-border bg-background/45 p-1.5 focus-within:border-primary/50">
      <input ref={imageInput} type="file" className="sr-only" accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif" multiple aria-label="选择图片" onChange={e=>void addImages(e.target.files)}/>
      <Button type="button" size="icon" variant="ghost" aria-label="添加图片" disabled={!me||busy||converting||engine==="gateway"} className="mb-0.5 size-10 shrink-0 rounded-xl" onClick={()=>imageInput.current?.click()}><ImagePlus className="size-5"/></Button>
      <Textarea ref={editor} onFocus={()=>setInputFocused(true)} onBlur={()=>setInputFocused(false)} aria-label="输入聊天内容" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing&&window.matchMedia("(min-width:640px)").matches){e.preventDefault();void send()}}} placeholder={me?"给 AI 发送消息，Shift + Enter 换行…":"请先登录工作台"} disabled={!me||busy} className="aigzt-chat-input workspace-editor min-h-11 flex-1 resize-none border-0 bg-transparent p-2 text-[16px] shadow-none focus-visible:border-0 focus-visible:ring-0"/>
      <Button size="icon" type="submit" aria-label="发送消息" disabled={!me||busy||converting||(!draft.trim()&&!selectedImages.length)} className="size-10 shrink-0 rounded-xl"><ArrowUp className="size-5"/></Button>
     </form>
     <p className="aigzt-chat-caption flex items-center justify-between gap-2 px-1 text-[10px] text-muted-foreground"><span>{engine==="native"?"平台内置 AI":"FreeLLMAPI · "+strategy}{selectedProject?" · "+selectedProject.value.name:""}</span><span>{converting?"正在转换图片…":selectedImages.length?"可发送图片":"会话自动保存"}</span></p>
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

  {showModels&&<div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
  <button className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" aria-label="关闭模型选择" onClick={()=>setShowModels(false)}/>
  <section role="dialog" aria-modal="true" aria-label="选择模型" className="relative w-full max-w-xl rounded-t-3xl border bg-card p-4 shadow-2xl sm:rounded-3xl sm:p-5">
   <div className="mb-3 flex items-center justify-between"><div><h2 className="font-semibold">选择 AI 模型</h2><p className="mt-1 text-xs text-muted-foreground">来自真实连接的 FreeLLMAPI 网关</p></div><Button size="icon" variant="ghost" aria-label="关闭" onClick={()=>setShowModels(false)}><X className="size-4"/></Button></div>
   <Input value={modelQuery} onChange={e=>setModelQuery(e.target.value)} aria-label="搜索模型" placeholder="搜索模型 ID…" className="mb-3 h-11"/>
   <div className="workspace-scroll max-h-[min(60dvh,450px)] space-y-1 overflow-y-auto">
    {([["auto","智能调度"],["auto:fast","快速优先"],["auto:smart","深度优先"]] as const).map(([id,label])=><Button key={id} variant={strategy===id?"secondary":"ghost"} className="h-11 w-full justify-start" onClick={()=>chooseModel(id)}><Sparkles className="size-4"/>{label}</Button>)}
    {matchedModels.slice(0,70).map(m=><Button key={m.id} variant={strategy===m.id?"secondary":"ghost"} className="h-11 w-full justify-start" onClick={()=>chooseModel(m.id)}><Bot className="size-4 shrink-0"/><span className="min-w-0 truncate">{m.id}</span></Button>)}
   </div>
   {matchedModels.length>70&&<p className="mt-2 text-xs text-muted-foreground">结果较多，请输入更具体的模型名称</p>}
  </section>
 </div>}
 {showHistory&&<div className="fixed inset-0 z-50 lg:hidden" role="presentation">
    <button className="absolute inset-0 bg-background/75 backdrop-blur-sm" aria-label="关闭历史会话" onClick={()=>setShowHistory(false)}/>
    <section role="dialog" aria-modal="true" aria-label="历史会话" className="absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col overflow-hidden border-r bg-card p-4 shadow-2xl">
      <div className="mb-5 flex items-center justify-between"><span className="text-lg font-bold">会话中心</span><Button variant="ghost" size="icon" aria-label="关闭" onClick={()=>setShowHistory(false)}><X className="size-4"/></Button></div>
      {histories}
    </section>
   </div>}
 </div>
}
