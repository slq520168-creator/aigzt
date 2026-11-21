import {useEffect,useState} from "react"
import {ExternalLink,Eye,EyeOff,KeyRound,LockKeyhole,LoaderCircle,LogIn,ShieldCheck,Trash2,X} from "lucide-react"
import {useEntries} from "@/lib/tiny"
import {PROVIDERS,discoverProviderModels,engineName,type ExternalProvider} from "@/lib/providers"
import {addPersonalKey,beginOpenRouterOAuth,deletePersonalKey,encryptPersonalKey,forgetPersonalKey,hasPersonalKey,unlockPersonalKey,watchPersonalKeys,type StoredKey} from "@/lib/user-keys"
import {issueText} from "@/lib/workspace"
type Props={initial?:ExternalProvider;inline?:boolean;onClose?:()=>void;onReady?:(provider:ExternalProvider)=>void}
export default function MyConnections({initial="openrouter",inline=false,onClose,onReady}:Props){
 const [source,setSource]=useState<ExternalProvider>(initial)
 const [key,setKey]=useState("")
 const [reveal,setReveal]=useState(false)
 const [pass,setPass]=useState("")
 const [encrypted,setEncrypted]=useState(false)
 const [connected,setConnected]=useState(hasPersonalKey(initial))
 const [busy,setBusy]=useState(false)
 const [notice,setNotice]=useState("")
 const {entries}=useEntries<StoredKey>("my-secret:",{limit:20})
 useEffect(()=>watchPersonalKeys(()=>setConnected(hasPersonalKey(source))),[source])
 useEffect(()=>{setConnected(hasPersonalKey(source));setKey("");setPass("");setNotice("")},[source])
 const saved=entries?.some(x=>x.key==="my-secret:"+source)??false
 const profile=PROVIDERS.find(p=>p.id===source)!
 async function add(){
  if(busy)return
  setBusy(true);setNotice("")
  try{
   if(encrypted&&pass.length<12)throw Error("加密口令至少需要 12 个字符")
   const options=await discoverProviderModels(source,key.trim())
   if(!options.length)throw Error("此密钥没有任何兼容聊天模型")
   addPersonalKey(source,key)
   if(encrypted)await encryptPersonalKey(source,pass)
   setKey("");setPass("")
   setNotice("已验证 "+options.length+" 个可用模型"+(encrypted?"，加密保存到你的个人云端":"；仅当前页面会话有效"))
   onReady?.(source)
  }catch(e){setNotice("连接未完成："+issueText(e))}
  finally{setBusy(false)}
 }
 async function unlock(){
  setBusy(true);setNotice("")
  try{
   await unlockPersonalKey(source,pass)
   const models=await discoverProviderModels(source)
   setNotice("已解锁并验证 "+models.length+" 个真实模型")
   setPass("");onReady?.(source)
  }catch(e){forgetPersonalKey(source);setNotice(issueText(e))}
  finally{setBusy(false)}
 }
 async function forget(removeCloud:boolean){
  setBusy(true);setNotice("")
  try{
   if(removeCloud)await deletePersonalKey(source)
   else forgetPersonalKey(source)
   setNotice(removeCloud?"已断开并删除云端密文":"已断开当前页面会话")
  }catch(e){setNotice("操作失败："+issueText(e))}
  finally{setBusy(false)}
 }
 const panel=<div className="space-y-3">
  <div className="flex items-center justify-between gap-2"><div><h2 className="text-base font-semibold">连接我的 AI 账号</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">网站免费池优先；个人额度只在你主动选择时使用。</p></div>{onClose&&<button type="button" onClick={onClose} aria-label="关闭" className="grid size-9 place-items-center rounded-xl hover:bg-muted"><X className="size-5"/></button>}</div>
  <label className="block text-xs font-medium">选择服务商
   <select value={source} onChange={e=>setSource(e.target.value as ExternalProvider)} className="mt-2 h-11 w-full rounded-xl border bg-background px-3 text-[14px]">
    {PROVIDERS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
   </select>
  </label>
  <div className="rounded-xl bg-muted/55 p-3 text-xs leading-5">
   <p className="font-medium">{profile.name} · {connected?"我的个人密钥已载入本页面":saved?"已加密保存在个人云端，尚未解锁":"尚未连接个人密钥"}</p>
   <p className="mt-1 text-muted-foreground">{profile.freeNote}</p>
  </div>
  {source==="openrouter"&&<button type="button" disabled={busy} onClick={()=>void beginOpenRouterOAuth().catch(e=>setNotice(issueText(e)))} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground"><LogIn className="size-4"/>登录 OpenRouter 并授权 AIGZT</button>}
  <div className="flex items-center justify-between"><p className="text-xs font-medium">或手动填写自己的 API Key</p><a href={profile.signup} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary">申请 / 管理密钥<ExternalLink className="size-3.5"/></a></div>
  <div className="relative"><input type={reveal?"text":"password"} autoComplete="off" spellCheck={false} value={key} onChange={e=>setKey(e.target.value)} placeholder="仅填写你个人账户的 API Key" aria-label="我的 API Key" className="h-11 w-full rounded-xl border bg-background px-3 pr-12 text-[16px]"/><button type="button" aria-label={reveal?"隐藏密钥":"显示密钥"} onClick={()=>setReveal(x=>!x)} className="absolute right-1 top-1 grid size-9 place-items-center text-muted-foreground">{reveal?<EyeOff className="size-4"/>:<Eye className="size-4"/>}</button></div>
  <label className="flex items-start gap-2 text-xs leading-5"><input type="checkbox" checked={encrypted} onChange={e=>setEncrypted(e.target.checked)} className="mt-1 size-4"/><span>用我设置的加密口令保存密文到个人云端（可跨设备解锁）。不选则只在当前页面会话使用。</span></label>
  {encrypted&&<input type="password" autoComplete="new-password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="独立加密口令，至少 12 字符" className="h-11 w-full rounded-xl border bg-background px-3 text-[16px]" aria-label="云端加密口令"/>}
  <button type="button" disabled={!key.trim()||busy||(encrypted&&pass.length<12)} onClick={()=>void add()} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-3 text-sm font-semibold text-background disabled:opacity-45">{busy?<LoaderCircle className="size-4 animate-spin"/>:<KeyRound className="size-4"/>}验证模型并连接</button>
  {saved&&<div className="space-y-2 border-t pt-3"><p className="text-xs font-semibold">已有加密密钥 · 解锁使用</p><input type="password" autoComplete="off" value={pass} onChange={e=>setPass(e.target.value)} placeholder="输入之前的加密口令" className="h-10 w-full rounded-xl border bg-background px-3 text-[16px]" aria-label="解锁口令"/><button type="button" onClick={()=>void unlock()} disabled={busy||pass.length<12} className="inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs disabled:opacity-50"><LockKeyhole className="size-4"/>解锁个人云端密钥</button></div>}
  {connected&&<button type="button" disabled={busy} onClick={()=>void forget(false)} className="rounded-xl border px-3 py-2 text-xs">断开当前会话密钥</button>}
  {saved&&<button type="button" disabled={busy} onClick={()=>void forget(true)} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs text-destructive"><Trash2 className="size-4"/>删除我的云端加密密钥</button>}
  {notice&&<p role="status" className="rounded-xl bg-muted p-3 text-xs leading-5">{notice}</p>}
  <p className="flex gap-2 text-[11px] leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0"/>个人文字模型调用通过 AIGZT 专用 Cloudflare 中转访问固定服务商 API，中转不保存个人密钥，也不借用站长密钥。图片和视频接口依服务商权限使用。登录 ChatGPT、Grok 等官网不等于授权 API；目前仅 OpenRouter 支持已实现的真正网站授权。个人付费模型可能按你的账户计费。</p>
 </div>
 return inline?<section className="rounded-2xl border bg-card p-4 sm:p-5">{panel}</section>:
  <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center"><button type="button" onClick={onClose} className="absolute inset-0 bg-foreground/20" aria-label="关闭连接窗口"/><div role="dialog" aria-modal="true" aria-label="连接我的 AI" className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border bg-card p-4 shadow-xl sm:max-h-[85dvh] sm:rounded-2xl sm:p-5">{panel}</div></div>
}
