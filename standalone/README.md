# AIGZT 独立站（Cloudflare）

**正式自有域名**：https://aigzt.youxuansi.online  
**Worker**：`aigzt-standalone`（Cloudflare Workers）  
**D1 数据库**：`aigzt-standalone`（独立，不复用 IM、YOUXI、餐饮）  
**源码**：本目录 `worker.js` + `index.html` + `style.css` + `client.js`，分支 `main`。

## 已部署设计
- 前端纯静态资源直接由 Worker 返回，不依赖 Tiniest Cloud SDK、登录或存储。没有平台生成的英文水印。
- 独立账号：邮箱和密码（PBKDF2-SHA256 盐值哈希），Secure + HttpOnly + SameSite=Lax 会话 Cookie；D1 私有聊天记录按用户 ID 隔离；注册每个网络 UTC 日最多 2 次。
- 免费文字：Workers AI 的 Llama 3.1、GLM Flash、Gemma，网站自有额度每人每天最多 8 次、全站每天最多 45 次。**这不是整个 Cloudflare 账户实际剩余的 Neurons**，账号免费额度由 Cloudflare 自己控制；不要把请求次数当作无成本承诺。
- 免费图片：Cloudflare Workers AI FLUX Schnell，每人每天 1 次、全站每天 4 次，仅返回生成内容供下载，不持久化媒体对象。
- 模型大厅：实时读取 OpenRouter 公共模型目录，显示实际总数、价格是否为零及模型类别；免费目录与具备个人密钥才可调用的模型严格区分。外部目录故障时，本站免费模型仍可见。
- 用户自带密钥：OpenRouter、OpenAI、Grok、Gemini、Qwen、Groq、Cerebras。密钥仅由用户输入并在当前网页内存中持有，每次请求经本站 Worker 转发至供应商官方 HTTPS 地址，不写进服务器数据库；可能收费的文字模型需明确勾选费用确认。
- OpenRouter 用户账号官方 OAuth：使用 PKCE S256 浏览器跳转，回调经 Worker 与官方接口兑换用户授权密钥；没有保存 OpenRouter 密码，授权 Key 只保存在当前页面内存。此授权流程需要用户真实登录后验收。
- 视频：使用用户自己的 Grok API Key 提交官方 Imagine 视频任务，需明确费用确认，完成后手动查询任务，不后台无限轮询。
- 端到端风控：服务端校验会话归属、模型白名单、每日总量、请求速率、Origin 与用户 API Key，不将用户密钥写入日志。

## 部署
在 Cloudflare Workers 中更新 `aigzt-standalone`，以 module Worker 形式将四个源文件中的占位符 `__HTML__`、`__CSS__`、`__CLIENT__` 替换为文件文本的 JSON 字符串后上传。`worker.js` 的 D1 绑定名为 `DB`，Workers AI 绑定名为 `AI`，速率限制绑定名为 `RATE`。兼容日期使用当前 Cloudflare 接受的 UTC 日期。禁止把 API Key 写入仓库。

## 验收与仍需完成的工作
- 已实测自有域名首页、`/health`、`/api/me`、`/api/models`、`/app.js`、`/style.css` 均 HTTP 200。
- 公共模型目录曾实测返回 476 个真实模型；未来数量以 API 实际数据为准。
- Cloudflare 账号的 Llama 免费模型已直接验证可返回真实文本；GLM、Gemma 的帐户级推理可请求，但网页对话格式处理和默认配额仍需正式浏览器验收。
- 注册后聊天、D1 历史同步、FLUX 图片、Grok 视频需要带登录态/个人密钥的端到端验收。不得标注已全面验收。
- 旧 Tiniest Cloud V15 和其用户数据未删除。旧平台身份与 D1 独立账号尚未合并；旧聊天记录不会自动出现在新站。必须经过用户合法身份验证和数据迁移，才能切换原用户。
- 完整工具插件调用、代码沙盒执行、第三方账号 OAuth 登录、密码找回和邮箱验证仍需完成，不得在前台制造假连接或伪造执行结果。
- 没有修改 `youxuansi.online` 根域名或原 IM Workers / 数据库。自有域名 `aigzt.youxuansi.online` 独立指向 `aigzt-standalone`。
