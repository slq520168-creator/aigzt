import type { WorkspaceMessage } from "@/lib/workspace"

/**
 * FreeLLMAPI is an independent, single-user gateway. The frontend never holds a
 * provider API key or the router's unified key. Tiniest Cloud attaches that
 * secret to the named HTTPS connection "freellmapi" on the server.
 */
const CONNECTION = "freellmapi"

export type GatewayModel = { id: string; owned_by?: string }

export async function discoverGatewayModels(): Promise<GatewayModel[]> {
  const response = await tiny.fetch(CONNECTION, { method: "GET", path: "/v1/models" })
  if (!response.ok) throw new Error(`网关响应 HTTP ${response.status}：请检查 HTTPS 地址、统一密钥和上游服务状态`)
  const payload = response.json as { data?: unknown } | null
  if (!payload || !Array.isArray(payload.data)) throw new Error("网关模型目录返回格式不正确")
  const models = payload.data.filter((x): x is GatewayModel =>
    typeof x === "object" && x !== null && "id" in x && typeof x.id === "string"
  )
  if (!models.length) throw new Error("网关已连接，但当前没有可用模型。请检查上游密钥及模型配置")
  return models
}

export async function gatewayComplete(
  messages: WorkspaceMessage[],
  system: string,
  model = "auto"
): Promise<{ content: string; route: string }> {
  const response = await tiny.fetch(CONNECTION, {
    method: "POST",
    path: "/v1/chat/completions",
    json: {
      model,
      stream: false,
      messages: [
        { role: "system", content: system },
        ...messages.slice(-18).map(m => ({ role: m.role, content: m.content.slice(0, 12000) })),
      ],
    },
  })
  if (!response.ok) throw new Error(`网关请求失败 HTTP ${response.status}：${response.json && typeof response.json === "object" && "error" in response.json ? "请检查上游免费配额和路由健康度" : "请检查网关连接"}`)
  const payload = response.json as { choices?: { message?: { content?: unknown } }[]; model?: string } | null
  const content = payload?.choices?.[0]?.message?.content
  if (typeof content !== "string" || !content.trim()) throw new Error("网关未返回有效的文本回复")
  const route = response.headers["x-routed-via"] ?? response.headers["X-Routed-Via"] ?? payload?.model ?? model
  return { content, route }
}
