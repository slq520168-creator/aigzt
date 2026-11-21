# AIGZT — ChatGPT-style interaction v15
Primary chat route shows a single responsive full-screen conversation. It has a sidebar of real account conversations on desktop, mobile history drawer, top model dropdown, one scrollable message region and a bottom composer. No dashboard cards or bottom tabs on chat.
Existing tiny.db chats, project memory, image upload, stream, provider picker and security connections are reused. Assistant responses render Markdown via react-markdown/remark-gfm. Other routes retain the existing AppHeader.
iPhone viewport uses existing visualViewport resize + offset vars. No global fetch wrapper, no fake data, no new backend. Tiniest Cloud draft only until explicit publish.

Mobile payload: model/settings/project routes and Markdown renderer are lazy-loaded; only chat shell and SDK load on fresh chat. Avoids eager rendering work on iPhone.

## V17 model UI design
No isolated model room or duplicated model card grid. Header dropdown and /directory use ModelCatalog, with real on-demand provider lists, source filters, shared cloud-saved favorite models (tiny.db model-fav:*), verified model choice, API-key setup and honest unconnected labels. Header has a short model label and quick-add + button. Background and header on every route share one flat light theme, with dark opt-in. No site-wide mobile bottom nav. Draft only.

## V19 媒体创作真实流程
可通过聊天框 + 入口或左侧导航进入图片/视频。独立媒体 API：Grok image/video 模型实时权限发现，图片 POST /v1/images/generations、视频 POST /v1/videos/generations，任务手动 GET 结果，按用户保存 cloud media-job。OpenAI Image 模型实时发现 + PNG/JPEG base64 响应解码与 tiny.files.put 私有存储，但必须注意 Tiniest Cloud 2MB fetch response limit 和 10 秒超时，失败如实提示。每次媒体生成需用户确认可能产生 API 费用；不后台轮询或自行付费。编程已有会话 taskRules.code/任务切换，不具备自动编译执行环境。GPT/Grok/Google/Qwen 分别独立 API Key，不与 ChatGPT plugins 同步。

## V20 final polish
Add direct coding assistant in chat sidebar and + menu (uses existing code task mode, no fake sandbox execution). Avoid classifying Gemini image/video models as text chat. Timeouts in media requests explicitly warn about possible charged-but-unconfirmed jobs. Only one tool route per creator action; no polling.
