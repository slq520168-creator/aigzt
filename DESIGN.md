# AIGZT · AI 多模型工作台 V8
目标：免费模型聚合 + 连续项目上下文 + 真正可操作的手机、桌面工作区。
UI：默认浅色，柔和青绿强调；历史会话在手机端抽屉，聊天时隐藏冗余欢迎头，内部滚动避免页面跳动，输入区域留在聊天区底部。
真实能力：tiny.ai 流式文本与图片生成分析（最多4张/每张5 MB），tiny.files 云端存储和按会话清理；FreeLLMAPI 真实模型读取与选择，仅验证后可启用；项目 TXT/MD/CSV 导入文本到记忆。
PWA：官方 manifest /sw.js 及图标，注册服务工作者，iOS 安装操作说明；不声称离线 AI 可用。
约束：不提供假余额/假模型/假按钮，不写明文 API Key、不用 localStorage，不创建第二套后台，保持已有数据。
交付流程：只部署草稿，构建通过，浏览器实机尽可能检查，代码一次提交 aigzt/main，不发布正式网站。

V9 移动端专项：首屏任务卡压缩到单行内容，已选会话隐藏欢迎头；手机 HEIC/HEIF 自动尝试浏览器内转 JPEG；一次请求用同步 inFlight 锁防止重复发送；忙碌期间不允许修改项目和模式覆盖消息。

## V10 手机聊天根因修复
- 移除手机会话卡片 410px 固定最小高度，改为根应用 Shell / 主内容 / 聊天卡片的统一 flex 剩余空间分配。
- iOS Safari 使用 visualViewport 的实际可见高度同步 CSS 变量，键盘弹出时压缩的是会话布局，不再把整个页面推走。
- 输入焦点期间隐藏顶部/底部网站导航和次要模型、任务、项目工具栏，留给消息列表；失焦恢复。
- 消息列表独立滚动并设置 min-height:0，编辑器固定在聊天卡片底部，不覆盖历史消息。Desktop / 其他页面不变。

## V11 手机消息高度专项
根因：V10 CSS `.aigzt-chat-card > .workspace-scroll` 同时选中消息列表、引擎栏和任务栏，导致所有横向可滚动工具栏 `flex:1` 平均瓜分高度；现用 `data-chat-messages` 唯一标记，只给消息区增长，其他栏 `flex:0 0 auto`。减少工具栏纵向留白，保留键盘聚焦时隐藏全局导航。Tiniest Cloud 邮件登录页是平台自带界面，不能通过应用 CSS 控制；YOUXI 收藏页属于独立项目，本次不修改。

## V12 iOS 整页上移根因修复
V10/V11 仅设置 #root 高度和 body overflow，却没有把根容器固定；Safari 软键盘弹出后滚动 layout viewport，导致整页仍能被推走。V12 使用 visualViewport.resize + scroll 的 height/offsetTop 维护固定 #root，在移动聊天状态中禁止根滚动；只有消息列表 overflow-y:auto，输入栏不随整页滚动。保留 V11 对工具栏高度的唯一性修复。非聊天页面不受此布局影响。

## V14 模型闭环
真实模型来源：平台 tiny.ai.limits / 安全连接 OpenRouter（仅 free）/ Groq / Cerebras / 预留 FreeLLMAPI；模型管理页检测并从目录直接进入会话，聊天顶部模型选择器与实际调用一致，按会话保存选择。所有外部密钥由 Tiniest Cloud Connections 设置，未连接明确报错不伪造，禁止付费兜底。保留已有手机/PWA/聊天存储逻辑。
