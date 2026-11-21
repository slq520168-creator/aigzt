import { Link } from "react-router"
import { ArrowUpRight, CheckCircle2, ExternalLink, GitBranch, KeyRound, LockKeyhole, Server, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card"
const steps=[
 {number:"01",name:"运行 FreeLLMAPI",description:"在你控制的独立环境安装真实网关，并使用 HTTPS 保护。"},
 {number:"02",name:"配置免费模型授权",description:"按提供商协议设置自己持有的 API Key，检查限额与地区规则。"},
 {number:"03",name:"设置安全连接",description:"在 Tiniest Cloud 的 Connections / Secrets 页面将统一密钥安全绑定到 freellmapi。"},
 {number:"04",name:"实际验证并启用",description:"回到模型中心读取 /v1/models；验证成功后聊天页面可开启外部模型。"},
]
export default function Settings(){
 return <div className="mx-auto max-w-5xl space-y-5">
  <div><p className="mb-1 text-[11px] font-bold tracking-[.16em] text-primary">SYSTEM / CONNECTIONS</p><h1 className="text-[25px] font-bold sm:text-[30px]">工作台设置</h1><p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">统一管理 AI 引擎、网关授权和云端数据。所有状态以真实连接为准。</p></div>
  <div className="grid gap-3 sm:grid-cols-2">
   <section className="workspace-surface rounded-2xl p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary"><Sparkles className="size-5"/></div><span className="inline-flex items-center gap-1 text-xs text-primary"><CheckCircle2 className="size-4"/>已接入</span></div><h2 className="mt-4 font-semibold">平台内置 AI</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">已集成到现有对话系统。通过 Tiniest Cloud 的授权、限额及应用内生成接口提供回答。</p></section>
   <section className="workspace-surface rounded-2xl p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-foreground"><Server className="size-5"/></div><span className="text-xs text-muted-foreground">待连接</span></div><h2 className="mt-4 font-semibold">FreeLLMAPI 聚合网关</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">接口适配代码已部署到草稿。没有真实 HTTPS 网关和统一密钥前不会显示为可用。</p></section>
  </div>
  <section className="workspace-surface rounded-2xl p-4 sm:p-6"><div className="mb-4 flex items-center gap-2"><KeyRound className="size-5 text-primary"/><h2 className="text-lg font-semibold">网关接入流程</h2></div><div className="space-y-0">{steps.map((s,i)=><div className="flex gap-3" key={s.number}><div className="flex flex-col items-center"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-xs font-bold text-foreground">{s.number}</span>{i<steps.length-1&&<span className="my-1 w-px flex-1 bg-border"/>}</div><div className="pb-5"><h3 className="pt-1 text-sm font-semibold">{s.name}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{s.description}</p></div></div>)}</div>
  <div className="flex flex-wrap gap-2 border-t border-border/70 pt-4"><a href="https://github.com/tashfeenahmed/freellmapi" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-medium hover:text-primary">官方网关说明<ExternalLink className="size-4"/></a><a href="https://app.tiniest.cloud/build/ai-unified-workspace--lq" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground">打开连接设置<ArrowUpRight className="size-4"/></a></div></section>
  <section className="workspace-surface grid gap-4 rounded-2xl p-4 sm:grid-cols-2 sm:p-5"><div><h2 className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-primary"/>云端账户与安全</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">会话及项目记忆通过平台账户隔离并同步。不使用浏览器 localStorage 保存重要数据，也不会把 API 密钥写进页面或 GitHub。</p></div><div><h2 className="flex items-center gap-2 text-sm font-semibold"><GitBranch className="size-4 text-primary"/>GitHub 版本管理</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">源码统一维护在 aigzt 仓库的 main 分支。正式发布由你在构建后台确认，不会因查看草稿而自动上线。</p><a href="https://github.com/slq520168-creator/aigzt" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">查看 GitHub 仓库<ExternalLink className="size-3.5"/></a></div></section>
  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><LockKeyhole className="size-4"/>当前未授予外部网关访问密钥</span><Link className="font-medium text-primary hover:underline" to="/directory">进入模型中心</Link></div>
 </div>
}
