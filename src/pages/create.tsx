import {useEffect,useMemo,useRef,useState} from "react"
import {Link,useSearchParams} from "react-router"
import {CheckCircle2,Download,ExternalLink,ImagePlus,LoaderCircle,RefreshCw,Video,ShieldCheck} from "lucide-react"
import {useEntries,useMe} from "@/lib/tiny"
import {availableMediaModels,generateMedia,queryMediaStatus,type MediaJob,type MediaKind,type MediaProvider} from "@/lib/media"
import {engineName} from "@/lib/providers"
import {issueText} from "@/lib/workspace"

export default function Create(){
 const me=useMe()
 const [params,setParams]=useSearchParams()
 const kind:MediaKind=params.get("mode")==="video"?"video":"image"
 const [provider,setProvider]=useState<MediaProvider>("grok")
 const [options,setOptions]=useState<{id:string;name:string}[]>([])
 const [model,setModel]=useState("")
 const [prompt,setPrompt]=useState("")
 const [verified,setVerified]=useState(false)
 const [consent,setConsent]=useState(false)
 const [checking,setChecking]=useState(false)
 const [creating,setCreating]=useState(false)
 const [updating,setUpdating]=useState("")
 const [notice,setNotice]=useState("")
 const locked=useRef(false)
 const {entries:records,error}=useEntries<MediaJob>("media-job:",{order:"-$updated_at",limit:25})
 const history=useMemo(()=>records?.filter(x=>x.value.kind===kind)??[],[records,kind])
 useEffect(()=>{setOptions([]);setModel("");setVerified(false);setConsent(false);setNotice("")},[kind,provider])
 async function loadModels(){
  if(locked.current)return
  locked.current=true;setChecking(true);setNotice("")
  try{
   const models=await availableMediaModels(provider,kind)
   setOptions(models);setModel(models[0]?.id??"");setVerified(true)
  }catch(e){setOptions([]);setModel("");setVerified(false);setNotice("连接验证失败："+issueText(e))}
  finally{locked.current=false;setChecking(false)}
 }
 async function create(){
  if(locked.current||creating)return
  if(!verified||!options.some(x=>x.id===model)){setNotice("先检测并选择实际有权限的媒体模型");return}
  if(!consent){setNotice("图像和视频 API 可能产生费用，请先确认本次生成");return}
  locked.current=true;setCreating(true);setNotice("")
  const id=crypto.randomUUID()
  try{
   const job=await generateMedia({id,kind,provider,model,prompt})
   await tiny.db.set("media-job:"+id,job)
   setPrompt("")
   setConsent(false)
   setNotice(job.status==="done"?"生成成功，结果已记录":job.status==="pending"?"任务已提交，请在下方手动查询进度":"生成失败："+(job.error||"未知原因"))
  }catch(e){setNotice("生成未确认成功："+issueText(e)+"。若请求超时，仍可能产生服务商费用；再次提交前请先查看服务商账户记录。")}
  finally{locked.current=false;setCreating(false)}
 }
 async function refresh(job:MediaJob){
  if(locked.current)return
  locked.current=true;setUpdating(job.id);setNotice("")
  try{
   const next=await queryMediaStatus(job)
   await tiny.db.set("media-job:"+job.id,next)
   if(next.status==="pending")setNotice("任务仍在生成中，请稍后再次手动查询")
   if(next.status==="failed")setNotice("生成失败："+(next.error||"请核对服务商返回信息"))
  }catch(e){setNotice("进度查询失败："+issueText(e))}
  finally{locked.current=false;setUpdating("")}
 }
 const resultUrl=(job:MediaJob)=>job.fileId?tiny.files.url(job.fileId):job.url
 return <div className="mx-auto max-w-[850px] space-y-4 pb-8 pt-3">
  <div><h1 className="text-xl font-semibold">AI 图片与视频创作</h1><p className="mt-1 text-xs leading-6 text-muted-foreground">使用真实服务商生成，不使用文字聊天模型冒充画图或视频接口。</p></div>
  <div className="flex gap-2 border-b pb-3">
   <button type="button" onClick={()=>setParams({mode:"image"})} className={"inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm "+(kind==="image"?"bg-foreground text-background":"bg-muted")}><ImagePlus className="size-4"/>生成图片</button>
   <button type="button" onClick={()=>setParams({mode:"video"})} className={"inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm "+(kind==="video"?"bg-foreground text-background":"bg-muted")}><Video className="size-4"/>生成视频</button>
  </div>
  <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
   <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-semibold">选择图片 / 视频服务</p><p className="mt-1 text-xs text-muted-foreground">账号未授权的服务不会生成内容。</p></div>
    <div className="flex gap-2">{(["grok",...(kind==="image"?["openai"] as const:[])] as MediaProvider[]).map(p=><button key={p} type="button" onClick={()=>setProvider(p)} className={"h-9 rounded-xl border px-3 text-xs "+(provider===p?"border-primary bg-secondary text-foreground":"border-border text-muted-foreground")}>{p==="grok"?"Grok Imagine":"GPT Image"}</button>)}</div>
   </div>
   <div className="flex flex-wrap items-center gap-2">
    <button type="button" disabled={!me||checking||creating} onClick={()=>void loadModels()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-secondary px-4 text-xs font-semibold disabled:opacity-50">{checking?<LoaderCircle className="size-4 animate-spin"/>:<RefreshCw className="size-4"/>}{checking?"检测中…":verified?"重新检测":"检测账户可用模型"}</button>
    <Link to="/settings" className="inline-flex h-8 items-center rounded-lg border px-3 text-xs text-primary">连接自己的 API Key</Link>
    {verified?<span className="flex items-center gap-1 text-xs text-primary"><CheckCircle2 className="size-4"/>读取到 {options.length} 个模型</span>:<span className="text-xs text-muted-foreground">需要实际服务商 API Key</span>}
   </div>
   {verified&&<div><label htmlFor="media-model" className="mb-2 block text-xs font-semibold">生成模型</label>
    <div className="space-y-1.5">{options.map(x=><button key={x.id} type="button" className={"flex min-h-10 w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm "+(model===x.id?"border-primary/50 bg-secondary":"border-border")} onClick={()=>setModel(x.id)}><span className="min-w-0 break-all">{x.name}</span>{model===x.id&&<CheckCircle2 className="size-4 shrink-0 text-primary"/>}</button>)}</div>
   </div>}
   <label htmlFor="media-prompt" className="block text-xs font-semibold">创作描述</label>
   <textarea id="media-prompt" aria-label="创作描述" value={prompt} onChange={e=>setPrompt(e.target.value)} rows={4} maxLength={1500} placeholder={kind==="image"?"描述想要画出的画面、风格、构图…":"描述镜头、场景、人物动作、运镜和氛围…"} className="w-full resize-y rounded-xl border bg-background p-3 text-[16px] leading-6 outline-none focus:border-primary/50"/>
   <label className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-[12px] leading-5"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 size-4 accent-current"/><span>我确认本次调用真实外部图片 / 视频生成 API，可能扣除服务商余额。**不自动重复执行、不自动付费切换。**</span></label>
   <button type="button" onClick={()=>void create()} disabled={!me||creating||!verified||!model||!prompt.trim()||!consent} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-45">{creating?<LoaderCircle className="size-4 animate-spin"/>:kind==="image"?<ImagePlus className="size-4"/>:<Video className="size-4"/>}{creating?"正在提交…":kind==="image"?"生成图片":"提交视频生成任务"}</button>
   <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0"/>服务商图像链接可能过期，及时下载保存。视频通过任务 ID 手动查询，避免后台重复请求。个人密钥经独立 HTTPS 中转发送，不使用站长的付费 API Key。</p>
  </section>
  {notice&&<p role="status" className="rounded-xl border bg-card p-3 text-xs leading-6">{notice}</p>}
  <section className="space-y-3">
   <h2 className="text-base font-semibold">我的{kind==="image"?"图片":"视频"}生成记录</h2>
   {error&&<p className="text-xs text-destructive">读取记录失败：{issueText(error)}</p>}
   {records===undefined?<p className="text-xs text-muted-foreground">正在同步记录…</p>:!history.length?<p className="rounded-xl border bg-card p-5 text-xs text-muted-foreground">还没有真实生成记录。</p>:
   history.map(({key,value:job})=><article key={key} className="space-y-2 rounded-xl border bg-card p-3 sm:p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="min-w-0 break-all text-xs font-medium">{job.model} · {job.status==="done"?"已完成":job.status==="pending"?"生成中":"失败"}</p>{job.status==="pending"&&<button type="button" disabled={Boolean(updating)} onClick={()=>void refresh(job)} className="inline-flex h-9 items-center gap-1 rounded-xl border px-3 text-xs"><RefreshCw className={"size-4 "+(updating===job.id?"animate-spin":"")}/>查询进度</button>}</div>
    <p className="text-sm leading-6">{job.prompt}</p>
    {job.status==="done"&&job.kind==="image"&&resultUrl(job)&&<img alt={"生成图片："+job.prompt.slice(0,80)} src={resultUrl(job)} loading="lazy" className="max-h-[460px] w-full rounded-xl object-contain"/>}
    {job.status==="done"&&job.kind==="video"&&resultUrl(job)&&<video src={resultUrl(job)} controls preload="metadata" className="max-h-[380px] w-full rounded-xl bg-black"/>}
    {job.status==="done"&&resultUrl(job)&&<a href={resultUrl(job)} target="_blank" rel="noopener noreferrer" download={job.fileId?job.id+"."+(job.kind==="image"?"jpg":"mp4"):undefined} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"><Download className="size-4"/>打开 / 保存作品<ExternalLink className="size-3.5"/></a>}
    {job.error&&<p className="text-xs text-destructive">{job.error}</p>}
    <p className="text-[11px] text-muted-foreground">{new Date(job.createdAt).toLocaleString("zh-CN")}</p>
   </article>)}
  </section>
 </div>
}
