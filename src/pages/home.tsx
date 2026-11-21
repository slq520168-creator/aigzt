import { lazy,Suspense,useEffect, useMemo, useRef, useState } from "react"
import { Link,useSearchParams } from "react-router"
import {PanelLeft,SquarePen,Ellipsis,Settings2,Moon,Sun} from "lucide-react"
const ChatMarkdown=lazy(()=>import("@/components/chat-markdown").then(x=>({default:x.ChatMarkdown})))
import {getTheme,setTheme} from "@/lib/theme"
import { ArrowUp, BookOpen, Bot, BrainCircuit, Check, ChevronRight, Clock3, Code2, Compass, Copy, FolderKanban, History, ImagePlus, Image as ImageIcon, Layers3, LoaderCircle, MessageSquareText, MoreHorizontal, PenLine, Plus, ChevronDown, RotateCcw, Search, ShieldCheck, Sparkles, Trash2, WandSparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useEntries,useMe } from "@/lib/tiny"
import { discoverGatewayModels,gatewayComplete,type GatewayModel } from "@/lib/gateway"
import ModelPicker from "@/components/model-picker"
import {discoverProviderModels,completeProvider,engineName,modelName,PROVIDERS,type ModelEngine} from "@/lib/providers"
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
 const [urlParams,setUrlParams]=useSearchParams()
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
 const [showMore,setShowMore]=useState(false)
 const [showTools,setShowTools]=useState(false)
 const [showProjectMenu,setShowProjectMenu]=useState(false)
 const [showAccount,setShowAccount]=useState(false)
 const [theme,setLocalTheme]=useState(getTheme)
 const followBottom=useRef(true)
 const [deleteConfirm,setDeleteConfirm]=useState(false)
 const [engine,setEngine]=useState<ModelEngine>("native")
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
   if(followBottom.current||busy){const el=chatScroll.current;if(el)el.scrollTop=el.scrollHeight}
 },[visibleMessages.length,busy,selected,streaming?.text.length])
 useEffect(()=>{followBottom.current=true;const el=chatScroll.current;if(el)el.scrollTop=el.scrollHeight},[selected])
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
 function openChat(key:string){const v=entries?.find(e=>e.key===key)?.value;setSelected(key);setShowHistory(false);setPending(null);setStreaming(null);setSelectedImages([]);setNotice("");setDeleteConfirm(false);setEngine(v?.engine??"native");setStrategy(v?.modelChoice??"auto")}
 useEffect(()=>{
  const source=urlParams.get("source"),model=urlParams.get("model")
  if(source&&model&&(source==="native"||source==="gateway"||PROVIDERS.some(p=>p.id===source))){
   setEngine(source as ModelEngine);setStrategy(model);setNotice("已选择模型 "+model+"，首次调用前会验证连接")
   setUrlParams({}, {replace:true})
  }
 },[urlParams,setUrlParams])
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
 async function chooseModel(source:ModelEngine,id:string){
  if(inFlight.current)return
  setEngine(source);setStrategy(id);setShowModels(false)
  if(current)try{
   await tiny.db.set(current.key,{...current.value,engine:source,modelChoice:id,updatedAt:new Date().toISOString()})
  }catch(e){setNotice("保存模型选择失败："+issueText(e))}
 }
 async function ask(messages:WorkspaceMessage[],mode:Mode,requestKey:string,project?:string){
  const context=projects?.find(p=>p.key===project)?.value.context
  const system="你是 AIGZT AI 统一工作台的中文助手。"+taskRules[mode]+"不得声称使用了未连接的模型或外部服务。"+(context?"\n当前项目共享上下文：\n"+context.slice(0,12000):"")
  if(engine==="gateway"){
   if(!gatewayReady)await discoverGatewayModels()
   const res=await gatewayComplete(messages,system,strategy)
   return {role:"assistant" as const,content:res.content,model:res.route}
  }
  if(engine!=="native"){
   // Re-verify existing selections when a chat is opened on another device.
   await discoverProviderModels(engine)
   const response=await completeProvider(engine,strategy,messages,system)
   return {role:"assistant" as const,content:response.content,model:engineName(engine)+" / "+response.route}
  }
  const history=messages.slice(-18).map(m=>m.role+": "+m.content.slice(0,10000)).join("\n\n")
  const images=messages.at(-1)?.role==="user"?messages.at(-1)?.attachments?.map(a=>a.id)??[]:[]
  let content="",updated=0
  for await(const chunk of tiny.ai.stream(history,{system,images,...(strategy!=="auto"?{model:strategy}:{})})){
   content+=chunk
   if(Date.now()-updated>70){setStreaming({key:requestKey,text:content});updated=Date.now()}
  }
  if(!content.trim())throw Error("AI 未返回有效回复，请重试")
  setStreaming({key:requestKey,text:content})
  return {role:"assistant" as const,content,model:strategy==="auto"?"平台自动选择":"请求模型："+strategy}
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
   if(engine!=="native"&&freshFiles.length)throw Error("当前第三方接口只支持文本，请切换内置 AI 分析图片")
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

 const side=<>
  <div className="chat-sidebar-title"><img src="/icon.svg" alt="" className="size-8 rounded-lg"/>aigzt</div>
  <button type="button" className="chat-sidebar-action" onClick={startNew}><SquarePen className="size-5"/>新建对话</button>
  <div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} aria-label="搜索聊天" placeholder="搜索聊天" className="h-10 rounded-xl border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"/></div>
  <p className="px-3 pt-4 pb-2 text-xs text-muted-foreground">最近对话</p>
  <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
   {chatsError?<p className="p-3 text-xs text-destructive">{issueText(chatsError)}</p>:entries===undefined?<p className="p-3 text-xs text-muted-foreground">正在同步…</p>:chats.length===0?<p className="p-3 text-xs text-muted-foreground">暂无聊天</p>:chats.map(item=><button type="button" disabled={busy} key={item.key} onClick={()=>openChat(item.key)} className={"chat-history-row "+(selected===item.key?"chat-history-selected":"")}><span className="truncate">{item.value.title}</span></button>)}
  </div>
  <div className="shrink-0 border-t border-border/60 pt-2">
   <Link to="/directory" className="chat-sidebar-action" onClick={()=>setShowHistory(false)}><Layers3 className="size-4"/>AI 模型</Link>
   <Link to="/projects" className="chat-sidebar-action" onClick={()=>setShowHistory(false)}><FolderKanban className="size-4"/>项目</Link>
   <Link to="/settings" className="chat-sidebar-action" onClick={()=>setShowHistory(false)}><Settings2 className="size-4"/>设置</Link>
   {me?<button type="button" onClick={()=>setShowAccount(v=>!v)} className="chat-sidebar-action truncate"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{me.email.slice(0,1).toUpperCase()}</span><span className="truncate">{me.email}</span></button>:<button type="button" className="chat-sidebar-action" onClick={()=>tiny.login()}>登录工作台</button>}
   {showAccount&&me&&<button type="button" onClick={()=>void tiny.logout()} className="chat-sidebar-action text-destructive">退出登录</button>}
  </div>
 </>
 return <section className="chat-shell" data-keyboard={inputFocused?"true":"false"}>
  <aside className="chat-desktop-sidebar hidden shrink-0 flex-col border-r bg-muted/30 p-3 md:flex">{side}</aside>
  <div className="chat-main">
   <header className="chat-topbar">
    <button className="chat-icon md:hidden" type="button" aria-label="打开会话列表" onClick={()=>setShowHistory(true)}><PanelLeft className="size-5"/></button>
    <button type="button" className="chat-model-selector" onClick={()=>{editor.current?.blur();setShowModels(true)}} aria-label="切换 AI 模型"><span className="max-w-[min(54vw,330px)] truncate">{engineName(engine)} · {modelName(engine,strategy)}</span><ChevronDown className="size-4 shrink-0 text-muted-foreground"/></button>
    <div className="ml-auto flex shrink-0 gap-1">
     <button type="button" className="chat-icon" aria-label="新建对话" onClick={startNew}><SquarePen className="size-5"/></button>
     <div className="relative"><button type="button" className="chat-icon" aria-label="更多操作" onClick={()=>setShowMore(v=>!v)}><Ellipsis className="size-5"/></button>
      {showMore&&<div className="chat-pop right-0 top-11 min-w-44">
       <button className="chat-pop-row" type="button" onClick={()=>{setShowMore(false);setShowProjectMenu(true)}}><FolderKanban className="size-4"/>关联项目</button>
       <Link className="chat-pop-row" to="/directory" onClick={()=>setShowMore(false)}><Layers3 className="size-4"/>添加 AI</Link>
       <button className="chat-pop-row" type="button" onClick={()=>{const next=theme==="dark"?"light":"dark";setTheme(next);setLocalTheme(next);setShowMore(false)}}>{theme==="dark"?<Sun className="size-4"/>:<Moon className="size-4"/>}切换主题</button>
       {selected&&<button className="chat-pop-row text-destructive" type="button" onClick={()=>{setDeleteConfirm(true);setShowMore(false)}}><Trash2 className="size-4"/>删除会话</button>}
      </div>}
     </div>
    </div>
   </header>
   <div ref={chatScroll} className="chat-messages" onScroll={e=>{const el=e.currentTarget;followBottom.current=el.scrollHeight-el.scrollTop-el.clientHeight<100}}>
    <div className={"chat-thread "+(!visibleMessages.length&&!busy?"chat-empty":"")}>
     {!visibleMessages.length&&!busy?<h1 className="chat-welcome">有什么可以帮你？</h1>:
      visibleMessages.map((msg,i)=><article key={selected+":"+i} className={"chat-message "+(msg.role==="user"?"chat-message-user":"chat-message-ai")}>
       {msg.role==="user"?<div className="chat-user-bubble"><span className="whitespace-pre-wrap break-words">{msg.content}</span>{msg.attachments?.length?<div className="mt-2 flex flex-wrap gap-2">{msg.attachments.map(a=><a key={a.id} href={tiny.files.url(a.id)} target="_blank" rel="noopener noreferrer"><img src={tiny.files.url(a.id)} alt={a.name} loading="lazy" className="h-28 max-w-36 rounded-xl object-cover"/></a>)}</div>:null}</div>:
       <div className="w-full min-w-0"><Suspense fallback={<p className="whitespace-pre-wrap break-words">{msg.content}</p>}><ChatMarkdown content={msg.content}/></Suspense><div className="chat-reply-actions"><button title="复制回复" aria-label="复制回复" onClick={()=>void copyMessage(msg.content)}><Copy className="size-4"/></button>{msg.model&&<span className="truncate text-[11px] text-muted-foreground">{msg.model}</span>}</div></div>}
      </article>)}
     {busy&&(streaming?.key===selected&&streaming.text?<div className="chat-message chat-message-ai"><Suspense fallback={<p className="whitespace-pre-wrap break-words">{streaming.text}</p>}><ChatMarkdown content={streaming.text}/></Suspense></div>:<p className="chat-message chat-message-ai flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 animate-pulse rounded-full bg-primary"/>{uploading||"正在思考…"}</p>)}
    </div>
   </div>
   <div className="chat-bottom">
    <div className="chat-bottom-inner">
     {deleteConfirm&&<div role="alertdialog" className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-destructive/30 bg-card p-3 text-xs"><span>删除当前会话及图片？</span><div className="flex gap-2"><button type="button" onClick={()=>setDeleteConfirm(false)}>取消</button><button type="button" className="rounded-lg bg-destructive px-3 py-2 text-white" onClick={()=>void remove()}>确认删除</button></div></div>}
     {notice&&<div role="status" className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-muted px-3 py-2 text-xs"><span className="break-words">{notice}</span><button aria-label="关闭提示" onClick={()=>setNotice("")}><X className="size-4"/></button></div>}
     {current?.value.messages.at(-1)?.role==="user"&&!busy&&<button className="mb-2 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs" onClick={()=>void retry()}><RotateCcw className="size-4"/>重新生成</button>}
     {selectedImages.length>0&&<div className="mb-2 flex flex-wrap gap-2">{selectedImages.map((file,i)=><span key={i} className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs"><span className="max-w-28 truncate">{file.name}</span><button aria-label={"移除"+file.name} onClick={()=>setSelectedImages(list=>list.filter((_,j)=>i!==j))}><X className="size-3.5"/></button></span>)}</div>}
     <form className="chat-composer" onSubmit={e=>{e.preventDefault();void send()}}>
      <textarea ref={editor} rows={1} className="chat-textarea" aria-label="输入聊天消息" placeholder={me?"询问任何问题":"请先登录工作台"} value={draft} onChange={e=>{setDraft(e.target.value);const el=e.currentTarget;el.style.height="auto";el.style.height=Math.min(160,el.scrollHeight)+"px"}} onFocus={()=>setInputFocused(true)} onBlur={()=>setInputFocused(false)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing&&window.matchMedia("(min-width:640px)").matches){e.preventDefault();void send()}}} disabled={!me||busy}/>
      <div className="chat-composer-actions">
       <div className="relative flex min-w-0 items-center gap-1">
        <button type="button" className="chat-plus" aria-label="添加附件和工具" onClick={()=>{editor.current?.blur();setShowTools(v=>!v);setShowProjectMenu(false)}}><Plus className="size-5"/></button>
        <button type="button" className="chat-mode" onClick={()=>{editor.current?.blur();setShowTools(v=>!v);setShowProjectMenu(false)}}><span className="truncate">{tools.find(t=>t.id===activeMode)?.label||"自由对话"}</span><ChevronDown className="size-3.5"/></button>
        {selectedProject&&<button type="button" className="chat-mode" onClick={()=>{editor.current?.blur();setShowProjectMenu(v=>!v);setShowTools(false)}}><FolderKanban className="size-3.5"/><span className="max-w-24 truncate">{selectedProject.value.name}</span></button>}
        {showTools&&<div className="chat-pop bottom-12 left-0 w-56">
         <button type="button" className="chat-pop-row" disabled={busy||converting||engine!=="native"} onClick={()=>{setShowTools(false);imageInput.current?.click()}}><ImagePlus className="size-4"/>添加图片</button>
         <button type="button" className="chat-pop-row" onClick={()=>{setShowTools(false);setShowProjectMenu(true)}}><FolderKanban className="size-4"/>关联项目</button><div className="my-1 border-t"/>
         {tools.map(t=><button type="button" key={t.id} className="chat-pop-row" onClick={()=>{void changeMode(t.id);setShowTools(false)}}>{t.id===activeMode?<Check className="size-4"/>:<span className="size-4"/>}{t.label}</button>)}
        </div>}
        {showProjectMenu&&<div className="chat-pop bottom-12 left-0 w-56"><p className="px-3 py-2 text-xs text-muted-foreground">项目上下文</p><button type="button" className="chat-pop-row" onClick={()=>{void chooseProject(null);setShowProjectMenu(false)}}>{!projectId?<Check className="size-4"/>:<span className="size-4"/>}未关联</button>{projects?.map(p=><button type="button" key={p.key} className="chat-pop-row" onClick={()=>{void chooseProject(p.key);setShowProjectMenu(false)}}><FolderKanban className="size-4"/><span className="truncate">{p.value.name}</span></button>)}<Link to="/projects" className="chat-pop-row border-t"><Plus className="size-4"/>管理项目</Link></div>}
       </div>
       <button type="submit" className="chat-send ml-auto" aria-label="发送消息" disabled={!me||busy||converting||(!draft.trim()&&!selectedImages.length)}>{busy?<LoaderCircle className="size-4 animate-spin"/>:<ArrowUp className="size-5"/>}</button>
      </div>
      <input type="file" className="sr-only" ref={imageInput} accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif" multiple aria-label="上传图片" onChange={e=>void addImages(e.target.files)}/>
     </form>
     <p className="chat-footnote">AIGZT · {engineName(engine)}</p>
    </div>
   </div>
  </div>
  {showHistory&&<div className="chat-drawer-bg"><button type="button" className="absolute inset-0 bg-foreground/25" aria-label="关闭会话列表" onClick={()=>setShowHistory(false)}/><aside role="dialog" aria-modal="true" aria-label="会话列表" className="chat-drawer"><button className="chat-icon absolute right-3 top-3 z-10" type="button" aria-label="关闭侧栏" onClick={()=>setShowHistory(false)}><X className="size-5"/></button>{side}</aside></div>}
  {showModels&&<ModelPicker currentSource={engine} currentModel={strategy} onClose={()=>setShowModels(false)} onChoose={(source,id)=>void chooseModel(source,id)}/>}
 </section>
}
