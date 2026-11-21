import {Link} from "react-router"
import {ArrowRight,CheckCircle2,ExternalLink,GitBranch,KeyRound,LockKeyhole,ShieldCheck,Server,Smartphone,Sparkles} from "lucide-react"
import {PwaInstall} from "@/components/pwa-install"
import {PROVIDERS,KEY_PANEL} from "@/lib/providers"
export default function Settings(){
 return <div className="mx-auto max-w-5xl space-y-5 pb-5">
  <div><p className="mb-1 text-[11px] font-semibold tracking-[.16em] text-primary">AIGZT / SETTINGS</p><h1 className="text-2xl font-bold sm:text-3xl">模型连接与工作台设置</h1><p className="mt-1 text-sm text-muted-foreground">从安全连接到直接选择模型，每一步都有真实操作入口。</p></div>
  <section className="workspace-surface space-y-4 rounded-2xl p-4 sm:p-6">
   <div className="flex items-center gap-2"><KeyRound className="size-5 text-primary"/><h2 className="font-semibold">添加你的 AI 服务商</h2></div>
   <p className="text-sm leading-6 text-muted-foreground">已声明七个 HTTPS 安全连接（包括 GPT、Grok、Gemini、千问）。点击「安全设置密钥」前往 Tiniest Cloud 的 Connections 页面，选择对应名称粘贴 API Key。密钥不会进入本工作台前端、聊天记录或 GitHub。</p>
   <div className="space-y-2">{PROVIDERS.map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-muted/20 p-3"><div><p className="text-sm font-semibold">{p.name}</p><p className="mt-1 text-xs text-muted-foreground">{p.freeNote}</p></div><a href={p.signup} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border px-3 text-xs font-medium hover:text-primary">申请密钥<ExternalLink className="size-3.5"/></a></div>)}</div>
   <a href={KEY_PANEL} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground sm:w-auto"><LockKeyhole className="size-4"/>安全设置密钥<ExternalLink className="size-4"/></a>
   <p className="text-xs leading-5 text-muted-foreground">当前界面不会假设密钥已填写。配置后前往模型中心点击「检测并获取模型」，只有通过验证的目录才能被标记为可用。</p>
   <Link className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline" to="/directory">前往模型中心<ArrowRight className="size-4"/></Link>
  </section>
  <div className="grid gap-3 sm:grid-cols-2">
   <section className="workspace-surface rounded-2xl p-4"><CheckCircle2 className="size-5 text-primary"/><h2 className="mt-3 font-semibold">平台内置 AI</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">通过账号实时读取 tiny.ai.limits，选择允许使用的具体模型；不需要你另找 API Key。</p></section>
   <section className="workspace-surface rounded-2xl p-4"><Server className="size-5 text-primary"/><h2 className="mt-3 font-semibold">独立 FreeLLMAPI 网关</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">保留真实网关适配，待独立部署并指定 HTTPS 地址后可接入。Tiniest Cloud 不代替常驻网关服务。</p><a href="https://github.com/tashfeenahmed/freellmapi" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">查看官方部署指南<ExternalLink className="size-3.5"/></a></section>
  </div>
  <PwaInstall/>
  <section className="workspace-surface grid gap-4 rounded-2xl p-4 sm:grid-cols-2 sm:p-5"><div><h2 className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-primary"/>账户与数据</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">聊天历史、图片及项目背景保存在账户云端。外部模型只接收当前被选中的对话及相关项目记忆，不自动同步全部历史。</p></div><div><h2 className="flex items-center gap-2 font-semibold"><GitBranch className="size-4 text-primary"/>源码及版本</h2><a href="https://github.com/slq520168-creator/aigzt" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary">aigzt / main<ExternalLink className="size-3.5"/></a><p className="mt-2 text-xs text-muted-foreground">先更新草稿并检查，正式发布由工作台所有者控制。</p></div></section>
 </div>
}
