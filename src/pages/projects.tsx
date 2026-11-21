import { useState } from "react"
import { FolderPlus, Pencil, Trash2, Check, X, ShieldCheck } from "lucide-react"
import { useEntries, useMe } from "@/lib/tiny"
import { type WorkspaceProject, issueText } from "@/lib/workspace"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
export default function Projects() {
 const me=useMe(),{entries,error}=useEntries<WorkspaceProject>("project:",{order:"-$updated_at",limit:50})
 const [editKey,setEditKey]=useState<string|null>(null),[name,setName]=useState(""),[context,setContext]=useState("")
 const [saving,setSaving]=useState(false),[notice,setNotice]=useState(""),[deleteKey,setDeleteKey]=useState<string|null>(null)
 function start(key:string|null) {const found=entries?.find(e=>e.key===key);setEditKey(key??"new");setName(found?.value.name??"");setContext(found?.value.context??"");setNotice("");setDeleteKey(null)}
 async function save(){const n=name.trim();if(!me||!n||saving)return;setSaving(true);setNotice("")
 try {const key=editKey==="new"?"project:"+crypto.randomUUID():editKey;if(!key)throw new Error("请重新打开编辑页面");await tiny.db.set(key,{name:n.slice(0,80),context:context.slice(0,12000),updatedAt:new Date().toISOString()});setEditKey(null)}
 catch(e){setNotice("保存失败："+issueText(e))}finally{setSaving(false)} }
 async function remove(key:string){setNotice("");try{await tiny.db.delete(key);setDeleteKey(null)}catch(e){setNotice("删除失败："+issueText(e))}}
 return <div className="space-y-5">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold">项目记忆</h1><p className="mt-1 text-sm text-muted-foreground">给每个项目保存背景、规则和长期目标；关联该项目的对话都会读取同一份上下文。</p></div><Button onClick={()=>start(null)} disabled={!me}><FolderPlus className="size-4"/>新建项目</Button></div>
  <div className="flex items-start gap-2 rounded-xl border bg-muted/40 px-4 py-3 text-sm"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary"/><span>项目内容保存在当前账户云端，手机和电脑可继续使用。不会自动读取其他 AI 网站的私人聊天记录。</span></div>
  {notice&&<p role="alert" className="text-sm text-destructive">{notice}</p>}
  {error&&<p role="alert" className="text-sm text-destructive">项目读取失败：{issueText(error)}</p>}
  {editKey!==null&&<section className="space-y-3 rounded-2xl border bg-card p-4 sm:p-5"><h2 className="font-semibold">{editKey==="new"?"创建项目":"编辑项目"}</h2><label className="block space-y-1.5 text-sm"><span>项目名称</span><Input value={name} onChange={e=>setName(e.target.value)} maxLength={80} placeholder="例如：AI 创作工作台" autoFocus/></label><label className="block space-y-1.5 text-sm"><span>共享上下文 · 最多 12,000 字</span><Textarea value={context} onChange={e=>setContext(e.target.value)} maxLength={12000} rows={7} placeholder="项目目标、技术架构、既定约束、正在进行的任务、重要决策……"/></label><div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setEditKey(null)}><X className="size-4"/>取消</Button><Button disabled={!name.trim()||saving} onClick={()=>void save()}><Check className="size-4"/>{saving?"保存中…":"保存项目"}</Button></div></section>}
  {!me?<p className="text-sm text-muted-foreground">请先登录以管理云端项目。</p>:entries===undefined?<p className="text-sm text-muted-foreground">读取项目中…</p>:entries.length===0&&editKey===null?<div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">还没有项目。建立一个项目后，在聊天页面关联即可共享上下文。</div>:<div className="grid gap-3 md:grid-cols-2">{entries.map(e=><section key={e.key} className="flex flex-col gap-3 rounded-2xl border bg-card p-4"><div className="flex items-center justify-between gap-2"><h2 className="min-w-0 truncate font-semibold">{e.value.name}</h2><span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">云端同步</span></div><p className="min-h-12 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground line-clamp-3">{e.value.context||"尚未填写项目记忆"}</p><div className="mt-auto flex items-center justify-end gap-2">{deleteKey===e.key?<><span className="text-xs text-destructive">确认删除？</span><Button size="sm" variant="outline" onClick={()=>setDeleteKey(null)}>取消</Button><Button size="sm" variant="destructive" onClick={()=>void remove(e.key)}>删除</Button></>:<><Button variant="outline" size="sm" onClick={()=>start(e.key)}><Pencil className="size-3.5"/>编辑</Button><Button variant="ghost" size="icon" aria-label={"删除"+e.value.name} onClick={()=>setDeleteKey(e.key)}><Trash2 className="size-4"/></Button></>}</div></section>)}</div>}
 </div>
}
