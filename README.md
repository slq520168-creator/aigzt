# aigzt · AI 聚合工作台

基于 React + TypeScript + Vite 构建的网页版、手机版 AI 统一工作台。当前以 **Tiniest Cloud 草稿预览**，正式站未发布。

## 功能

- 原生 AI 对话、云端会话保存及跨设备继续。
- 项目记忆：每个项目的长期背景与规则保存一次，并自动作为对话上下文使用。
- FreeLLMAPI 统一接口：在可验证的 HTTPS 连接存在后，可通过 `/v1/models` 发现模型，并调用 `/v1/chat/completions`，支持 `auto`、`auto:fast`、`auto:smart` 路由。
- 未连接的网关不会被显示为可用；不会把公开的理论免费额度冒充用户实时余额。
- 简体中文界面、深浅色主题、移动端底部导航。

## 快速开始

本项目采用 Tiniest Cloud 的官方 SDK（`/sdk.js`），只有部署在该平台后才能进行账户登录、云端存储以及 AI 调用。

```bash
npm install
npm run build
```

在本地 `npm run dev` 时不会出现虚构的登录和 AI 服务。

## FreeLLMAPI 对接

**FreeLLMAPI 必须是独立运行的真实网关。此代码库不是对上游 FreeLLMAPI 的复制，也没有偷偷部署任何网关。**

1. 使用官方开源项目 [tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi) 的安装文档，在自己控制的运行环境部署网关。
2. 按官方说明配置真实持有、允许使用的上游 API 密钥及统一密钥，检查限流与路由健康度。
3. 给网关配置**仅授权用户可访问**的 HTTPS 域名。该项目定位个人实验用途，不能把管理控制台或单用户网关直接公开为公共多租户服务。
4. 在 Tiniest Cloud 中声明名为 `freellmapi` 的连接：`kind=bearer`，`base_url=https://你的网关域名`（不带 `/v1`），并由项目所有者在其安全的 Secrets 页面设置**统一密钥**。
5. 在模型中心点击「检测并获取模型」，成功后 AI 对话页的 FreeLLMAPI 引擎可选择。
6. 若网关出错，界面明确返回错误，不会无提示改用其他收费模型。内部免费配额的切换由 FreeLLMAPI 处理。

**安全约束：**严禁将任何 API Key、统一网关密钥、环境变量文件或真实令牌提交到此公开仓库。网页不存储密钥。不要将 87 家服务商的理论总容量视作已经获得的使用额度。

## 部署规则

- GitHub 主仓库：`slq520168-creator/aigzt`，只维护 `main`。
- 当前草稿：Tiniest Cloud `ai-unified-workspace--lq`。
- 每次更新先做 TypeScript / Vite 构建校验，再建立草稿预览；**未经确认不发布正式版本**。
- 不修改其他项目，不部署新增付费基础设施。

## 上游与版权

FreeLLMAPI 原项目：[tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi)。本仓库为独立工作台前端、并未分发其源码。


## 免费额度聚合进度

- 默认入口先选择 FREE 智能调度：站点免费线路优先，故障时只切有限配额的内置 AI 备用，不自动走付费线路。
- 当前真实免费来源不能等同 FreeLLMAPI 理论声称的 87 家与 1313 个端点。OpenRouter 免费路由尚需有效服务商密钥，Groq/Cerebras 公共应用许可未核准，所以不会假报全部在线。
- 普通用户可以在设置中通过 OpenRouter 账号授权，或使用个人 OpenAI/Grok/Gemini/千问等 API Key；密钥只在本人浏览器内存中，选择加密保存后才写入本人云端密文。
- GPT/Grok 等文本与创作媒体调用通过独立的 Cloudflare BYOK Worker 中转，不借用站长付费密钥；媒体请求需要单次费用确认。
- 免费池 Tiniest Cloud 后端函数重命名为 `freerouter`，以避免下划线函数文件未被部署平台识别的问题。该改动已提交源代码，但还需发布并完成 `run_function` 实测；不要把构建通过当作正式验证。
- Tiniest Cloud 免费每日源码构建次数已达上限，本轮不再重复尝试；当前源码修复放在 GitHub main，正式版本继续保持已有发布状态。
- 英文 `Preview of version ...` 提示来自 Tiniest Cloud 预览宿主，不是网站弹窗，正式 live URL 不显示这条预览提示。
